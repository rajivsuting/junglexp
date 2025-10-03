import { NextRequest, NextResponse } from 'next/server';

import { uploadVideo } from '@/lib/video-upload';

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const contentType = req.headers.get("content-type") || "";
    if (!contentType.includes("multipart/form-data")) {
      return NextResponse.json(
        { success: false, error: "Content-Type must be multipart/form-data" },
        { status: 400 }
      );
    }

    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    if (!file) {
      return NextResponse.json(
        { success: false, error: "No file provided" },
        { status: 400 }
      );
    }
    if (!file.type.startsWith("video/")) {
      return NextResponse.json(
        { success: false, error: "Invalid file type" },
        { status: 400 }
      );
    }

    const buffer = await file.arrayBuffer();

    const { url } = await uploadVideo({
      data: buffer,
      fileName: file.name,
      contentType: file.type,
    });

    return NextResponse.json({ success: true, url });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error?.message || "Upload failed" },
      { status: 500 }
    );
  }
}
