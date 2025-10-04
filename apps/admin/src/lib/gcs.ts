import { log } from 'console';

// lib/gcs.js
import { Storage } from '@google-cloud/storage';

// Ensure environment variables are loaded (only for local development)
if (process.env.NODE_ENV !== "production") {
  require("dotenv").config({ path: "./.env.local" });
}

let storage: Storage | null = null;
let bucket: any = null;

function getStorage() {
  if (!storage) {
    // Ensure all necessary environment variables are set
    if (
      !process.env.GCP_PROJECT_ID ||
      !process.env.GCP_CLIENT_EMAIL ||
      !process.env.GCP_PRIVATE_KEY
    ) {
      throw new Error("Missing GCP credentials in environment variables.");
    }

    storage = new Storage({
      projectId: process.env.GCP_PROJECT_ID,
      credentials: {
        client_email: process.env.GCP_CLIENT_EMAIL,
        // Replace escaped newlines with actual newlines for the private key
        private_key: process.env.GCP_PRIVATE_KEY
          ? process.env.GCP_PRIVATE_KEY.replace(/\\n/g, "\n")
          : undefined,
      },
    });
  }
  return storage;
}

function getBucket() {
  if (!bucket) {
    const bucketName = process.env.GCP_BUCKET_NAME;
    if (!bucketName) {
      throw new Error("A bucket name is needed to use Cloud Storage.");
    }
    bucket = getStorage().bucket(bucketName);
  }
  return bucket;
}

export { getStorage as storage, getBucket as bucket };
