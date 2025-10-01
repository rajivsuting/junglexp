import { log } from 'console';

// lib/gcs.js
import { Storage } from '@google-cloud/storage';

// Ensure environment variables are loaded (only for local development)
if (process.env.NODE_ENV !== "production") {
  require("dotenv").config({ path: "./.env.local" });
}

// Ensure all necessary environment variables are set
if (
  !process.env.GCP_PROJECT_ID ||
  !process.env.GCP_CLIENT_EMAIL ||
  !process.env.GCP_PRIVATE_KEY
) {
  console.error("Missing GCP credentials in environment variables.");
  // Handle this error appropriately in production, e.g., throw an error or exit.
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
const bucket = storage.bucket(bucketName);

export { storage, bucket };
