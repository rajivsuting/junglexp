import { NextRequest, NextResponse } from 'next/server';

import { uploadVideo } from '@/lib/video-upload';

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const form = await req.formData();
    const file = form.get("file") as File | null;
    if (!file) {
      return NextResponse.json(
        { success: false, error: "No file provided" },
        { status: 400 }
      );
    }
    if (!file.type.startsWith("video/")) {
      return NextResponse.json(
        { success: false, error: "Invalid content type" },
        { status: 400 }
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const res = await uploadVideo({
      data: buffer,
      fileName: file.name,
      contentType: file.type,
    });

    return NextResponse.json({ success: true, data: res });
  } catch (e: any) {
    console.error("Video upload failed", e);
    return NextResponse.json(
      { success: false, error: e?.message || "Upload failed" },
      { status: 500 }
    );
  }
}
