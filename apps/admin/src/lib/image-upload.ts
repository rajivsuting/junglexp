import sharp from 'sharp';
import { bucket } from '@/lib/gcs';

// Image sizes for responsive variants
export const IMAGE_SIZES = {
  small: { width: 480, height: null as number | null, suffix: "_sm" },
  medium: { width: 768, height: null as number | null, suffix: "_md" },
  large: { width: 1024, height: null as number | null, suffix: "_lg" },
  original: {
    width: null as number | null,
    height: null as number | null,
    suffix: "",
  },
} as const;

export type ImageSize = keyof typeof IMAGE_SIZES;

export interface ImageVariant {
  size: ImageSize;
  url: string;
  width?: number;
  height?: number;
}

export interface UploadResult {
  variants: ImageVariant[];
  originalName: string;
}

function tsName(base: string, suffix: string) {
  const nameWithoutExt = base.split(".").slice(0, -1).join(".") || base;
  const timestamp = Date.now();
  return suffix
    ? `${timestamp}-${nameWithoutExt}${suffix}.webp`
    : `${timestamp}-${nameWithoutExt}.webp`;
}

async function processImage(buffer: Buffer, size: ImageSize) {
  const { width, height } = IMAGE_SIZES[size];
  let inst = sharp(buffer);

  if (width || height) {
    inst = inst.resize({
      width: width ?? undefined,
      height: height ?? undefined,
      fit: "inside",
      withoutEnlargement: true,
    });
  }

  const { data, info } = await inst
    .webp({ quality: 85 })
    .toBuffer({ resolveWithObject: true });
  return { buffer: data, metadata: info };
}

function publicGcsUrl(destination: string) {
  return `https://storage.googleapis.com/${process.env.GCP_BUCKET_NAME}/${destination}`;
}

export async function uploadAndMakeVariantsFromBuffer(
  input: Buffer,
  originalName: string
): Promise<UploadResult> {
  const variants: ImageVariant[] = [];

  for (const [key, cfg] of Object.entries(IMAGE_SIZES)) {
    const size = key as ImageSize;
    try {
      const { buffer, metadata } = await processImage(input, size);
      const fileName = tsName(originalName, cfg.suffix);
      const destination = `uploads/${fileName}`;
      await bucket().file(destination).save(buffer, {
        contentType: "image/webp",
        resumable: false,
      });
      const url = publicGcsUrl(destination);
      variants.push({
        size,
        url,
        width: metadata.width,
        height: metadata.height,
      });
    } catch (e) {
      console.error(`Variant ${size} failed`, e);
    }
  }

  if (variants.length === 0) {
    throw new Error("Failed to process any image variants");
  }

  return { variants, originalName };
}

export async function uploadAndMakeVariantsFromFile(
  file: File
): Promise<UploadResult> {
  if (!file.type.startsWith("image/")) {
    throw new Error("File must be an image");
  }
  const input = Buffer.from(await file.arrayBuffer());
  return uploadAndMakeVariantsFromBuffer(input, file.name);
}

