import fs from 'fs';
import { NextRequest, NextResponse } from 'next/server';
import path from 'path';
import sharp from 'sharp';

import { bucket } from '@/lib/gcs';

// Define image sizes for responsive images
const IMAGE_SIZES = {
  // thumbnail: { width: 150, height: 150, suffix: "_thumb" },
  small: { width: 480, height: null, suffix: "_sm" },
  medium: { width: 768, height: null, suffix: "_md" },
  large: { width: 1024, height: null, suffix: "_lg" },
  original: { width: null, height: null, suffix: "" },
} as const;

type ImageSize = keyof typeof IMAGE_SIZES;

interface ImageVariant {
  size: ImageSize;
  url: string;
  width?: number;
  height?: number;
}

interface UploadResult {
  variants: ImageVariant[];
  originalName: string;
}

async function processImage(
  buffer: Buffer,
  size: ImageSize
): Promise<{ buffer: Buffer; metadata: any }> {
  const { width, height } = IMAGE_SIZES[size];

  let sharpInstance = sharp(buffer);

  if (width || height) {
    const resizeOptions: any = {};
    if (width) resizeOptions.width = width;
    if (height) resizeOptions.height = height;

    // For thumbnail, use cover fit to maintain aspect ratio and crop if needed

    // For other sizes, maintain aspect ratio without cropping
    resizeOptions.fit = "inside";
    resizeOptions.withoutEnlargement = true;

    sharpInstance = sharpInstance.resize(resizeOptions);
  }

  // Convert to WebP for better compression and modern browser support
  const result = await sharpInstance
    .webp({ quality: 85 })
    .toBuffer({ resolveWithObject: true });

  return { buffer: result.data, metadata: result.info };
}

function generateFileName(originalName: string, suffix: string): string {
  const nameWithoutExt = originalName.split(".").slice(0, -1).join(".");
  const timestamp = Date.now();
  return suffix
    ? `${timestamp}-${nameWithoutExt}${suffix}.webp`
    : `${timestamp}-${nameWithoutExt}.webp`;
}

async function uploadSingleFile(file: File): Promise<UploadResult> {
  // Check if file is an image
  if (!file.type.startsWith("image/")) {
    throw new Error("File must be an image");
  }

  const arrayBuffer = await file.arrayBuffer();
  const inputBuffer = Buffer.from(arrayBuffer);
  const variants: ImageVariant[] = [];

  // Ensure upload directory exists
  const uploadsDir = path.join(process.cwd(), "public", "uploads", "images");
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
  }

  // Process and upload each image size
  for (const [sizeKey, sizeConfig] of Object.entries(IMAGE_SIZES)) {
    const size = sizeKey as ImageSize;

    try {
      const { buffer, metadata } = await processImage(inputBuffer, size);
      const fileName = generateFileName(file.name, sizeConfig.suffix);

      const destination = `uploads/${fileName}`; // Path in your GCS bucket

      await bucket().file(destination).save(buffer);

      const publicUrl = `https://storage.googleapis.com/${process.env.GCP_BUCKET_NAME}/${destination}`;

      variants.push({
        size,
        url: publicUrl,
        width: metadata.width,
        height: metadata.height,
      });
    } catch (error) {
      console.error(`Error processing ${size} variant:`, error);
      // Continue with other sizes even if one fails
    }
  }

  if (variants.length === 0) {
    throw new Error("Failed to process any image variants");
  }

  return {
    variants,
    originalName: file.name,
  };
}

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const files = formData.getAll("files") as File[];

    if (!files || files.length === 0) {
      return NextResponse.json({ error: "No files provided" }, { status: 400 });
    }

    // Process all files
    const results = await Promise.all(files.map(uploadSingleFile));

    return NextResponse.json({
      success: true,
      data: results,
    });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Upload failed" },
      { status: 500 }
    );
  }
}
