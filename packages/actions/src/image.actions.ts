"use server";
import { db, eq, inArray, sql } from "@repo/db";
import { Images } from "@repo/db/schema/image";

import { bucket, toObjectNameFromUrl } from "./libs/gcs";

import type { TImage, TNewImage } from "@repo/db/schema/image";

export const createImage = async (data: TNewImage) => {
  if (!db) throw new Error("Database connection not available");

  const result = await db!.insert(Images).values(data).returning();

  if (!result[0]) {
    throw new Error("Failed to create image");
  }

  return result[0];
};

export const createImages = async (data: TNewImage[]) => {
  if (!db) throw new Error("Database connection not available");

  const result = await db!.insert(Images).values(data).returning();

  return result;
};

export const deleteImages = async (imageIds: number[]) => {
  if (!db) throw new Error("Database connection not available");

  const deleted = await db
    .delete(Images)
    .where(inArray(Images.id, imageIds))
    .returning();

  const objectNames = new Set<string>();
  for (const img of deleted) {
    if (img.small_url) objectNames.add(toObjectNameFromUrl(img.small_url));
    if (img.medium_url) objectNames.add(toObjectNameFromUrl(img.medium_url));
    if (img.large_url) objectNames.add(toObjectNameFromUrl(img.large_url));
    if (img.original_url)
      objectNames.add(toObjectNameFromUrl(img.original_url));
  }

  return Promise.allSettled(
    Array.from(objectNames).map(async (name) => {
      return bucket().file(name).delete();
    })
  );
};

export const updateImages = async (rows: Pick<TImage, "id" | "alt_text">[]) => {
  if (!db) throw new Error("Database connection not available");

  const result = await db
    .insert(Images)
    .values(rows as any)
    .onConflictDoUpdate({
      target: Images.id, // assumes id is unique/PK
      set: {
        alt_text: sql`excluded.alt_text`,
      },
    })
    .returning();

  if (!result[0]) {
    throw new Error("Failed to update image");
  }

  return result[0];
};
