import { Storage } from '@google-cloud/storage';

require("dotenv").config();

// Ensure all necessary environment variables are set
if (
  !process.env.GCP_PROJECT_ID ||
  !process.env.GCP_CLIENT_EMAIL ||
  !process.env.GCP_PRIVATE_KEY
) {
  // Handle this error appropriately in production, e.g., throw an error or exit.
} else {
}

const storage = new Storage({
  projectId: process.env.GCP_PROJECT_ID,
  credentials: {
    client_email: process.env.GCP_CLIENT_EMAIL,
    // Replace escaped newlines with actual newlines for the private key
    private_key: process.env.GCP_PRIVATE_KEY
      ? process.env.GCP_PRIVATE_KEY.replace(/\\n/g, "\n")
      : undefined,
  },
});

const bucketName = process.env.GCP_BUCKET_NAME!;
const bucket = () => storage.bucket(bucketName);

export { storage, bucket };

export function toObjectNameFromUrl(url: string): string {
  // Example: https://storage.googleapis.com/etrouper-image-bucket/uploads/1755628648907-image-5_sm.webp
  // We want: uploads/1755628648907-image-5_sm.webp
  try {
    const u = new URL(url);
    // pathname starts with /bucket-name/uploads/.... when using "https://storage.googleapis.com/<bucket>/<object>"
    // or might be /uploads/... if using a custom domain or a different format.
    // Case 1 (storage.googleapis.com/<bucket>/<object>):
    const path = u.pathname.replace(/^\/+/, ""); // strip leading slash(es)
    const segments = path.split("/");
    // If first segment equals the bucket name, drop it:
    if (segments[0] === bucketName) {
      return segments.slice(1).join("/");
    }
    // Otherwise, assume pathname already starts with object name (uploads/..)
    return segments.join("/");
  } catch {
    // Fallback: try to find 'uploads/' substring in raw string
    const i = url.indexOf("uploads/");
    return i >= 0 ? url.slice(i) : url;
  }
}
