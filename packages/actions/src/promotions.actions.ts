"use server";

import { asc, desc, eq } from "drizzle-orm";

import { db } from "@repo/db/index";
import { promotionInsertSchema, Promotions } from "@repo/db/schema/promotions";

import { getOrSet } from "./libs/cache";
import { activePromotionsKey, inactivePromotionsKey } from "./libs/keys";
import { redis } from "./libs/redis";

import type { TNewPromotion, TPromotionBase } from "@repo/db/schema/promotions";

async function revalidateActivePromotionsCache() {
  const key = await activePromotionsKey();
  const rows = await db
    .select()
    .from(Promotions)
    .where(eq(Promotions.isActive, true))
    .orderBy(asc(Promotions.order));
  await redis.set(key, JSON.stringify(rows));
}

async function revalidateInactivePromotionsCache() {
  const key = await inactivePromotionsKey();
  const rows = await db
    .select()
    .from(Promotions)
    .where(eq(Promotions.isActive, false))
    .orderBy(asc(Promotions.order));
  await redis.set(key, JSON.stringify(rows));
}

export const createPromotion = async (data: TNewPromotion) => {
  const parsed = promotionInsertSchema.parse(data);

  if (parsed.isActive) {
    const [last] = await db
      .select({ order: Promotions.order })
      .from(Promotions)
      .where(eq(Promotions.isActive, true))
      .orderBy(desc(Promotions.order))
      .limit(1);

    const nextOrder = (last?.order ?? 0) + 1;
    parsed.order = nextOrder;
  }

  let [promotion] = await db.insert(Promotions).values(parsed).returning();

  if (!promotion) throw new Error("Failed to create promotion");

  if (parsed.isActive) {
    await revalidateActivePromotionsCache();
  } else {
    await revalidateInactivePromotionsCache();
  }

  return promotion;
};

export const updatePromotion = async (
  id: number,
  data: Partial<Omit<TPromotionBase, "id">>
) => {
  const parsed = promotionInsertSchema.parse(data);
  return db
    .update(Promotions)
    .set(parsed)
    .where(eq(Promotions.id, id))
    .returning();
};

export async function setPromotionsActive(ids: number[], isActive: boolean) {
  const [last] = await db
    .select({ order: Promotions.order })
    .from(Promotions)
    .where(eq(Promotions.isActive, isActive))
    .orderBy(desc(Promotions.order))
    .limit(1);

  const nextOrder = (last?.order ?? 0) + 1;

  const updates = ids.map((id, index) =>
    db
      .update(Promotions)
      .set({ isActive, order: nextOrder + index })
      .where(eq(Promotions.id, id))
      .returning()
  );

  const result = await Promise.all(updates);
  await revalidateActivePromotionsCache();
  await revalidateInactivePromotionsCache();

  return result;
}

export async function setPromotionActive(id: number, isActive: boolean) {
  const [current] = await db
    .select()
    .from(Promotions)
    .where(eq(Promotions.id, id))
    .limit(1);

  if (!current) throw new Error("Promotion not found");
  if (current.isActive === isActive) return current;

  if (isActive) {
    // Find the max order in the target block
    const [last] = await db
      .select({ order: Promotions.order })
      .from(Promotions)
      .where(eq(Promotions.isActive, isActive))
      .orderBy(desc(Promotions.order))
      .limit(1);

    const nextOrder = (last?.order ?? 0) + 1;

    const [updated] = await db
      .update(Promotions)
      .set({ isActive, order: nextOrder })
      .where(eq(Promotions.id, id))
      .returning();

    await revalidateActivePromotionsCache();
    await revalidateInactivePromotionsCache();

    return updated;
  } else {
    const [updated] = await db
      .update(Promotions)
      .set({ isActive, order: null })
      .where(eq(Promotions.id, id))
      .returning();

    // Get all remaining active promotions ordered by their current order
    const remainingActivePromotions = await db
      .select({ id: Promotions.id, order: Promotions.order })
      .from(Promotions)
      .where(eq(Promotions.isActive, true))
      .orderBy(asc(Promotions.order));

    // Update the orders to maintain continuous sequence (1, 2, 3, ...)
    if (remainingActivePromotions.length > 0) {
      const orderUpdates = remainingActivePromotions.map((promotion, index) =>
        db
          .update(Promotions)
          .set({ order: index + 1 })
          .where(eq(Promotions.id, promotion.id))
      );

      await Promise.all(orderUpdates);
    }

    await revalidateActivePromotionsCache();
    await revalidateInactivePromotionsCache();

    return updated;
  }
}

export const getInactivePromotions = async () => {
  return getOrSet(
    async () =>
      db.select().from(Promotions).where(eq(Promotions.isActive, false)),
    {
      key: await inactivePromotionsKey(),
    }
  );
};

export const getActivePromotions = async () => {
  return getOrSet(
    async () =>
      db.select().from(Promotions).where(eq(Promotions.isActive, true)),
    {
      key: await activePromotionsKey(),
    }
  );
};

export async function updatePromotionsOrder(promotionIds: number[]) {
  const updates = promotionIds.map((id, index) =>
    db
      .update(Promotions)
      .set({ order: index + 1 })
      .where(eq(Promotions.id, id))
      .returning()
  );

  const result = await Promise.all(updates);
  await revalidateActivePromotionsCache();

  return result;
}
