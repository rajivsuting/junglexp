import { bucket } from '@/lib/gcs';

type UploadVideoParams = {
  data: Uint8Array | Buffer | ArrayBuffer;
  fileName: string;
  contentType: string; // e.g. "video/mp4"
};

function getEnv(name: string): string {
  const v = process.env[name];
  if (!v) {
    throw new Error(`Missing required env var: ${name}`);
  }
  return v;
}

// GCS public URL builder
function publicGcsUrl(destination: string) {
  return `https://storage.googleapis.com/${getEnv("GCP_BUCKET_NAME")}/${destination}`;
}

function buildPublicUrl(key: string): string {
  return publicGcsUrl(key);
}

function sanitizeFileName(name: string): string {
  return name
    .trim()
    .replace(/[^a-zA-Z0-9._-]+/g, "-")
    .replace(/-+/g, "-")
    .toLowerCase();
}

export async function uploadVideo(params: UploadVideoParams) {
  const { data, fileName, contentType } = params;

  const gcsBucketName = getEnv("GCP_BUCKET_NAME");
  const prefix = process.env.GCS_VIDEO_PREFIX || "uploads/videos";
  const safeName = sanitizeFileName(fileName);
  const key = `${prefix.replace(/\/$/, "")}/${Date.now()}-${safeName}`;

  const body =
    data instanceof Uint8Array
      ? data
      : data instanceof ArrayBuffer
        ? Buffer.from(new Uint8Array(data))
        : Buffer.isBuffer(data)
          ? data
          : Buffer.from([]);

  if (!body || body.length === 0) {
    throw new Error("Upload data is empty");
  }

  await bucket().file(key).save(body, {
    contentType,
    resumable: false,
  });

  return {
    bucket: gcsBucketName,
    key,
    url: buildPublicUrl(key),
    contentType,
  } as const;
}
