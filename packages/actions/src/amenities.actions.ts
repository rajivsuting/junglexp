"use server";
import { db } from "@repo/db";
import { Amenities, insertAmenitiesSchema } from "@repo/db/schema/amenities";

import type { TNewAmenity } from "@repo/db/schema/amenities";

export const getAllAmenities = async () => {
  if (!db) return [];
  
  return await db.query.Amenities.findMany();
};

export const createAmenity = async (data: TNewAmenity) => {
  if (!db) throw new Error("Database connection not available");
  
  const parsed = insertAmenitiesSchema.parse(data);
  const [result] = await db.insert(Amenities).values(parsed).returning();

  if (!result) {
    throw new Error("Failed to create amenity");
  }

  return result;
};

export const createAmenities = async (data: TNewAmenity[]) => {
  if (!db) throw new Error("Database connection not available");
  
  if (data.length === 0) return [];

  const parsedAmenities = data.map((amenity) =>
    insertAmenitiesSchema.parse(amenity)
  );

  const results = await db
    .insert(Amenities)
    .values(parsedAmenities)
    .returning();

  if (!results || results.length === 0) {
    throw new Error("Failed to create amenities");
  }

  return results;
};
