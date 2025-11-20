// lib/gcs.js
import { Storage } from '@google-cloud/storage';

// Ensure environment variables are loaded (only for local development)
if (process.env.NODE_ENV !== "production") {
  require("dotenv").config({ path: "./.env" });
}

export const storage = new Storage({
  projectId: process.env.GCP_PROJECT_ID,
  credentials: {
    client_email: process.env.GCP_CLIENT_EMAIL,
    // Replace escaped newlines with actual newlines for the private key
    private_key: process.env.GCP_PRIVATE_KEY
      ? process.env.GCP_PRIVATE_KEY.replace(/\\n/g, "\n")
      : undefined,
  },
});

export const bucket = () => storage.bucket(process.env.GCP_BUCKET_NAME!);
