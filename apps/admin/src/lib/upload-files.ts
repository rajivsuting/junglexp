import type { UploadResult } from "@repo/actions/parks.actions";

// Types should match your server response
export interface ImageVariant {
  size: "small" | "medium" | "large" | "original";
  url: string;
  width?: number;
  height?: number;
}

// Types should match your server response for created TImage
export interface TImage {
  id: number;
  created_at: string | null; // dates serialized as strings in JSON
  updated_at: string | null;
  small_url: string;
  medium_url: string;
  large_url: string;
  original_url: string;
  alt_text: string;
}

// If you still want to keep variants, derive them client-side if needed.
// But the main thing you need is the created image row.
export interface UploadResultWithImage {
  image: TImage;
  originalName: string;
}

type ProgressMap = Record<string, number>;

const DEFAULT_ENDPOINT = "/api/v1/upload-image";

// Tune these for your needs
const CHUNK_SIZE = 4 * 1024 * 1024; // 4MB chunks
const LARGE_FILE_THRESHOLD = 12 * 1024 * 1024; // >=12MB will use chunked path

function setProgress(
  onProgress: ((p: ProgressMap) => void) | undefined,
  name: string,
  percent: number
) {
  onProgress?.({ [name]: Math.max(0, Math.min(100, Math.round(percent))) });
}

// Pseudocode/TypeScript — implement in your @repo/db/utils as appropriate
export function getImageMapFromUploadResult(result: UploadResult) {
  const small = result.variants.find((v) => v.size === "small");
  const medium = result.variants.find((v) => v.size === "medium");
  const large = result.variants.find((v) => v.size === "large");
  const original = result.variants.find((v) => v.size === "original");

  if (!small || !medium || !large || !original) {
    throw new Error("Missing required image variants");
  }

  return {
    image: {
      small_url: small.url,
      medium_url: medium.url,
      large_url: large.url,
      original_url: original.url,
    },
    // If your Images schema needs more fields, set them here
    // e.g., created_at: new Date(), mime_type, width/height, etc.
  };
}

export function getImagesMapFromUploadResult(result: UploadResult[]) {
  return result.map((r) => getImageMapFromUploadResult(r));
}

/**
 * Single-shot upload for one file using XHR.
 * Expects server JSON: { success: true, data: { image: TImage } } (or data: [{ image }] )
 */
export function uploadSingleWithProgress(
  file: File,
  onProgress?: (progressByFile: ProgressMap) => void,
  endpoint: string = DEFAULT_ENDPOINT
): Promise<UploadResultWithImage> {
  return new Promise((resolve, reject) => {
    const formData = new FormData();
    formData.append("file", file);

    const xhr = new XMLHttpRequest();
    xhr.open("POST", endpoint);

    xhr.upload.addEventListener("progress", (event) => {
      if (!event.lengthComputable) return;
      const percent = (event.loaded / event.total) * 100;
      setProgress(onProgress, file.name, percent);
    });

    xhr.addEventListener("readystatechange", () => {
      if (xhr.readyState !== XMLHttpRequest.DONE) return;
      try {
        const json = JSON.parse(xhr.responseText || "{}");
        if (
          xhr.status >= 200 &&
          xhr.status < 300 &&
          json.success &&
          json.data
        ) {
          setProgress(onProgress, file.name, 100);
          const data = getImageMapFromUploadResult(json.data);
          if (!data?.image) {
            reject(new Error("Upload succeeded but no image returned"));
            return;
          }
          const result: UploadResultWithImage = {
            image: data.image as TImage,
            originalName: file.name,
          };
          resolve(result);
        } else {
          reject(
            new Error(json.error || `Upload failed with status ${xhr.status}`)
          );
        }
      } catch {
        reject(new Error("Upload failed"));
      }
    });

    xhr.addEventListener("error", () =>
      reject(new Error("Network error during upload"))
    );
    xhr.send(formData);
  });
}

/**
 * Chunked upload for one file with granular progress.
 * Server should return final { success, data: { image: TImage } } on the last chunk (index === total - 1).
 * Uses the same endpoint with ?chunked=1 and fields: chunk, name, size, index, total.
 */
export async function uploadFileChunked(
  file: File,
  onProgress?: (progressByFile: ProgressMap) => void,
  endpoint: string = DEFAULT_ENDPOINT
): Promise<UploadResultWithImage> {
  const total = Math.max(1, Math.ceil(file.size / CHUNK_SIZE));
  let uploadedBytes = 0;
  let finalResult: UploadResultWithImage | null = null;

  for (let index = 0; index < total; index++) {
    const start = index * CHUNK_SIZE;
    const end = Math.min(start + CHUNK_SIZE, file.size);
    const chunk = file.slice(start, end);

    await new Promise<void>((resolve, reject) => {
      const form = new FormData();
      form.append("chunk", chunk);
      form.append("name", file.name);
      form.append("size", String(file.size));
      form.append("index", String(index));
      form.append("total", String(total));

      const xhr = new XMLHttpRequest();
      xhr.open("POST", `${endpoint}?chunked=1`);

      xhr.upload.addEventListener("progress", (e) => {
        if (!e.lengthComputable) return;
        const currentOverall = ((uploadedBytes + e.loaded) / file.size) * 100;
        setProgress(onProgress, file.name, currentOverall);
      });

      xhr.addEventListener("readystatechange", () => {
        if (xhr.readyState !== XMLHttpRequest.DONE) return;
        try {
          if (xhr.status >= 200 && xhr.status < 300) {
            // bytes for this chunk fully uploaded
            uploadedBytes += chunk.size;
            setProgress(
              onProgress,
              file.name,
              (uploadedBytes / file.size) * 100
            );

            // On last chunk, server should return the final image
            const json = JSON.parse(xhr.responseText || "{}");
            if (index === total - 1) {
              if (json.success && json.data) {
                const data = getImageMapFromUploadResult(json.data);
                if (!data?.image) {
                  reject(
                    new Error("Final compose succeeded but no image returned")
                  );
                  return;
                }
                finalResult = {
                  image: data.image as TImage,
                  originalName: file.name,
                };
                setProgress(onProgress, file.name, 100);
              } else {
                reject(
                  new Error(json.error || `Final compose failed: ${xhr.status}`)
                );
                return;
              }
            }
            resolve();
          } else {
            let errorMsg = "Chunk upload failed";
            try {
              const json = JSON.parse(xhr.responseText || "{}");
              errorMsg = json.error || `${errorMsg}: ${xhr.status}`;
            } catch {
              errorMsg = `${errorMsg}: ${xhr.status}`;
            }
            reject(new Error(errorMsg));
          }
        } catch (e) {
          reject(e instanceof Error ? e : new Error("Chunk handling failed"));
        }
      });

      xhr.addEventListener("error", () =>
        reject(new Error("Network error during chunk upload"))
      );
      xhr.send(form);
    });
  }

  if (!finalResult) {
    throw new Error("Chunked upload completed but no final image received");
  }
  return finalResult;
}

/**
 * Multi-file uploader with progress. Automatically chooses:
 * - Single-shot for small files
 * - Chunked for large files
 */
export async function uploadFilesWithProgress(
  files: File[],
  onProgress?: (progressByFile: ProgressMap) => void,
  endpoint: string = DEFAULT_ENDPOINT
): Promise<UploadResultWithImage[]> {
  const tasks = files.map(async (file) => {
    const useChunked = file.size >= LARGE_FILE_THRESHOLD;
    try {
      if (useChunked) {
        return await uploadFileChunked(file, onProgress, endpoint);
      } else {
        return await uploadSingleWithProgress(file, onProgress, endpoint);
      }
    } catch (err) {
      // Surface per-file failure with 0% to make UI aware
      setProgress(onProgress, file.name, 0);
      throw err;
    }
  });

  return Promise.all(tasks);
}
