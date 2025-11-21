"use server";
import { db } from '@repo/db/index';
import { insertSaftyFeaturesSchema, SaftyFeatures } from '@repo/db/schema/safty-features';

import type { TNewSaftyFeature } from "@repo/db/schema/safty-features";

export const getAllSafetyFeatures = async () => {
  return await db!.query.SaftyFeatures.findMany();
};

export const createSafetyFeature = async (data: TNewSaftyFeature) => {
  const parsed = insertSaftyFeaturesSchema.parse(data);
  // @ts-ignore
  const [result] = await db!.insert(SaftyFeatures).values(parsed).returning();

  if (!result) {
    throw new Error("Failed to create safety feature");
  }

  return result;
};

export const createSafetyFeatures = async (data: TNewSaftyFeature[]) => {
  if (data.length === 0) return [];

  const parsedSafetyFeatures = data.map((feature) =>
    insertSaftyFeaturesSchema.parse(feature)
  ) as any;
  // @ts-ignore
  const results = await db
    .insert(SaftyFeatures)
    .values(parsedSafetyFeatures)
    .returning();

  if (!results || results.length === 0) {
    throw new Error("Failed to create safety features");
  }

  return results;
};
