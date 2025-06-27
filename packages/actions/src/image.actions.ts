"use server";
import { db, inArray } from "@repo/db";
import { Images } from "@repo/db/schema/image";

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
  const result = await db
    .delete(Images)
    .where(inArray(Images.id, imageIds))
    .returning();

  if (!result[0]) {
    throw new Error("Failed to delete images");
  }

  return result;
};
