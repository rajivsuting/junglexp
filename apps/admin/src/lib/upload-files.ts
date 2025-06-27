"use client";

interface ImageVariant {
  size: string;
  url: string;
  width?: number;
  height?: number;
}

export interface UploadResult {
  variants: ImageVariant[];
  originalName: string;
}

// Helper function to get the best image URL for a given max width
export function getBestImageUrl(
  variants: ImageVariant[],
  maxWidth: number
): string {
  // Sort variants by width (ascending)
  const sortedVariants = variants
    .filter((v) => v.width) // Only consider variants with width
    .sort((a, b) => (a.width || 0) - (b.width || 0));

  // Find the smallest variant that's larger than or equal to maxWidth
  const bestVariant = sortedVariants.find((v) => (v.width || 0) >= maxWidth);

  // If no variant is large enough, use the largest available
  return (
    bestVariant?.url ||
    sortedVariants[sortedVariants.length - 1]?.url ||
    variants[0]?.url ||
    ""
  );
}

// Helper function to generate srcSet for responsive images
export function generateSrcSet(variants: ImageVariant[]): string {
  return variants
    .filter((v) => v.width && v.size !== "thumbnail") // Exclude thumbnail from srcSet
    .sort((a, b) => (a.width || 0) - (b.width || 0))
    .map((v) => `${v.url} ${v.width}w`)
    .join(", ");
}

export async function uploadFile(file: File): Promise<UploadResult> {
  const formData = new FormData();
  formData.append("files", file);

  const response = await fetch("/api/v1/upload-images", {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Upload failed");
  }

  const result = await response.json();

  if (!result.success || !result.data || result.data.length === 0) {
    throw new Error("Upload failed");
  }

  return result.data[0];
}

export async function uploadFiles(files: File[]): Promise<UploadResult[]> {
  const formData = new FormData();
  files.forEach((file) => {
    formData.append("files", file);
  });

  const response = await fetch("/api/v1/upload-images", {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Upload failed");
  }

  const result = await response.json();

  if (!result.success || !result.data) {
    throw new Error("Upload failed");
  }

  return result.data;
}
