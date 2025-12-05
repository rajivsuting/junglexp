import { Storage } from "@google-cloud/storage";
import { bucket } from "@repo/actions/libs/gcs";
import type { NextRequest } from "next/server";

function getEnv(name: string): string {
  const v = process.env[name];
  if (!v) {
    throw new Error(`Missing required env var: ${name}`);
  }
  return v;
}

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

function publicGcsUrl(destination: string) {
  return `https://storage.googleapis.com/${getEnv("GCP_BUCKET_NAME")}/${destination}`;
}

export async function POST(req: NextRequest) {
  const { contentType } = await req.json();

  const name = `uploads/videos/${generateUniqueName()}`;
  const file = bucket().file(name);

  // Generate a URL that allows a PUT request for the next 15 minutes
  const [url] = await file.getSignedUrl({
    version: "v4",
    action: "write",
    expires: Date.now() + 10 * 60 * 1000, // 10 minutes
    contentType,
  });

  return Response.json({ url, file: publicGcsUrl(name) });
}
