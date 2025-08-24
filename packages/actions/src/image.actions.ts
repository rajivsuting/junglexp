"use server";
import { db, inArray } from '@repo/db';
import { Images } from '@repo/db/schema/image';

import { bucket, toObjectNameFromUrl } from './libs/gcs';

import type { TNewImage } from "@repo/db/schema/image";

export const createImage = async (data: TNewImage) => {
  const result = await db.insert(Images).values(data).returning();

  if (!result[0]) {
    throw new Error("Failed to create image");
  }

  return result[0];
};

export const createImages = async (data: TNewImage[]) => {
  const result = await db.insert(Images).values(data).returning();

  if (!result[0]) {
    throw new Error("Failed to create images");
  }

  return result;
};

export const deleteImages = async (imageIds: number[]) => {
  console.log("imageIds", imageIds);

  const deleted = await db
    .delete(Images)
    .where(inArray(Images.id, imageIds))
    .returning();

  console.log("deleted", deleted);

  const objectNames = new Set<string>();
  for (const img of deleted) {
    if (img.small_url) objectNames.add(toObjectNameFromUrl(img.small_url));
    if (img.medium_url) objectNames.add(toObjectNameFromUrl(img.medium_url));
    if (img.large_url) objectNames.add(toObjectNameFromUrl(img.large_url));
    if (img.original_url)
      objectNames.add(toObjectNameFromUrl(img.original_url));
  }

  console.log("objectNames", objectNames);

  return Promise.allSettled(
    Array.from(objectNames).map(async (name) => {
      return bucket.file(name).delete();
    })
  );
};
