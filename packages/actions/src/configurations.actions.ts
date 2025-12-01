"use server";

import { eq } from "drizzle-orm";
import { db } from "@repo/db";
import { Configurations } from "@repo/db/schema/configurations";
import type { TNewConfiguration } from "@repo/db/schema/configurations";
import { getOrSet, setJSON } from "./libs/cache";
import { redis } from "./libs/redis";
import { revalidatePath } from "next/cache";

const CONFIG_CACHE_KEY = "config";

export const getConfiguration = async (key: string) => {
  if (!db) return null;

  return await getOrSet(
    async () => {
      const config = await db!.query.Configurations.findFirst({
        where: eq(Configurations.key, key),
      });
      return config || null;
    },
    {
      key: `${CONFIG_CACHE_KEY}:${key}`,
      ttlSeconds: 60 * 60 * 24, // 24 hours
    }
  );
};

export const updateConfiguration = async (
  key: string,
  value: string,
  description?: string
) => {
  if (!db) throw new Error("Database connection not available");

  const existing = await db.query.Configurations.findFirst({
    where: eq(Configurations.key, key),
  });

  let result;
  if (existing) {
    const [updated] = await db
      .update(Configurations)
      .set({
        value,
        description: description ?? existing.description,
        updated_at: new Date(),
      })
      .where(eq(Configurations.key, key))
      .returning();
    result = updated;
  } else {
    const newConfig: TNewConfiguration = {
      key,
      value,
      description,
    };
    const [created] = await db
      .insert(Configurations)
      .values(newConfig)
      .returning();
    result = created;
  }

  setJSON(`${CONFIG_CACHE_KEY}:${key}`, result);

  return result;
};
