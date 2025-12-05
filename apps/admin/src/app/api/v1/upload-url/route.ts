import { Storage } from "@google-cloud/storage";
import { bucket } from "@repo/actions/libs/gcs";
import type { NextRequest } from "next/server";

function generateUniqueName() {
  const now = new Date();
  const datePart = now
    .toISOString()
    .replace(/[-:T.]/g, "")
    .slice(0, 14);
  const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
  let randomPart = "";
  for (let i = 0; i < 20; i++) {
    randomPart += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return `${datePart}-${randomPart}`;
}

export async function POST(req: NextRequest) {
  const { contentType } = await req.json();

  const file = bucket().file(`uploads/videos/${generateUniqueName()}`);

  // Generate a URL that allows a PUT request for the next 15 minutes
  const [url] = await file.getSignedUrl({
    version: "v4",
    action: "write",
    expires: Date.now() + 15 * 60 * 1000, // 15 minutes
    contentType,
  });

  return Response.json({ url });
}
