import crypto from 'crypto';
// app/api/v1/upload-image/route.ts
import { NextRequest, NextResponse } from 'next/server';
import path from 'path';

import { bucket } from '@/lib/gcs';
import { uploadAndMakeVariantsFromBuffer, uploadAndMakeVariantsFromFile } from '@/lib/image-upload';

export const runtime = "nodejs"; // ensure Node runtime (not Edge)

// ---------- Utilities ----------

// Deterministic session id per file name+size; include user info if needed
function getSessionId(name: string, size: number) {
  const h = crypto
    .createHash("sha256")
    .update(`${size}:${name}`)
    .digest("hex")
    .slice(0, 40);
  return `${size}-${h}`;
}

// ---------- Chunk helpers (GCS combine) ----------

async function saveChunk(sessionId: string, index: number, chunkBuf: Buffer) {
  const key = `uploads/chunks/${sessionId}/${index}`;
  await bucket()
    .file(key)
    .save(chunkBuf, {
      resumable: false,
      metadata: { contentType: "application/octet-stream" },
    });
  return key;
}

async function composeChunks(
  sessionId: string,
  total: number,
  composedKey: string
) {
  const sources = Array.from({ length: total }, (_, i) =>
    bucket().file(`uploads/chunks/${sessionId}/${i}`)
  );
  // bucket().combine performs GCS compose under the hood
  await bucket().combine(sources, bucket().file(composedKey));
}

async function cleanupChunks(sessionId: string, total: number) {
  const deletions = Array.from({ length: total }, (_, i) =>
    bucket()
      .file(`uploads/chunks/${sessionId}/${i}`)
      .delete({ ignoreNotFound: true })
  );
  await Promise.allSettled(deletions);
}

// ---------- Route handler ----------

export async function POST(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const isChunked = searchParams.get("chunked") === "1";

    // Simple single-shot upload
    if (!isChunked) {
      const form = await req.formData();
      const file = form.get("file") as File | null;
      if (!file) {
        return NextResponse.json(
          { success: false, error: "No file provided" },
          { status: 400 }
        );
      }
      const result = await uploadAndMakeVariantsFromFile(file);
      return NextResponse.json({ success: true, data: result });
    }

    // Chunked upload
    const form = await req.formData();
    const chunk = form.get("chunk") as File | null;
    const name = (form.get("name") as string) || "";
    const sizeStr = (form.get("size") as string) || "";
    const indexStr =
      (form.get("index") as string) || (form.get("start") as string) || "";
    const totalStr = (form.get("total") as string) || "";

    if (!chunk || !name || !sizeStr || !totalStr || !indexStr) {
      return NextResponse.json(
        { success: false, error: "Missing chunk upload fields" },
        { status: 400 }
      );
    }

    const size = Number(sizeStr);
    const total = Number(totalStr);
    const index = Number(indexStr);
    if (
      !Number.isFinite(size) ||
      !Number.isFinite(total) ||
      !Number.isFinite(index)
    ) {
      return NextResponse.json(
        { success: false, error: "Invalid numeric fields" },
        { status: 400 }
      );
    }

    const sessionId = getSessionId(name, size);
    const chunkBuf = Buffer.from(await chunk.arrayBuffer());
    await saveChunk(sessionId, index, chunkBuf);

    // If last chunk, compose and create variants
    if (index === total - 1) {
      const composedKey = `uploads/raw/${Date.now()}-${path.basename(name)}`;
      await composeChunks(sessionId, total, composedKey);

      // Download composed object and generate variants
      const [composedBuffer] = await bucket().file(composedKey).download();
      const result = await uploadAndMakeVariantsFromBuffer(
        composedBuffer,
        name
      );

      // Cleanup
      await cleanupChunks(sessionId, total);
      // Optional: remove raw composed object after variants created
      await bucket()
        .file(composedKey)
        .delete({ ignoreNotFound: true })
        .catch(() => {});

      return NextResponse.json({ success: true, data: result, composed: true });
    }

    // Acknowledge chunk received
    return NextResponse.json({ success: true, received: index });
  } catch (error: any) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { success: false, error: error?.message || "Upload failed" },
      { status: 500 }
    );
  }
}
