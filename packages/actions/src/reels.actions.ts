"use server";
import { and, count, db, desc, eq, ilike } from '@repo/db/index';
import { Reels } from '@repo/db/schema/reels';

import { getOrSet } from './libs/cache';

import type { TNewReel, TReelStatus } from "@repo/db/schema/reels";

export type TGetReelsFilters = {
  search?: string;
  page?: number;
  limit?: number;
  status?: TReelStatus;
};

const cacheReels = async () => {
  return db!.query.Reels.findMany({
    where: eq(Reels.status, "active"),
  });
};

export const getReelsFromCache = async () => {
  return getOrSet(() => cacheReels(), {
    key: "reels",
  });
};

export const getReels = async (filters: TGetReelsFilters) => {
  const { search, page = 1, limit = 10, status } = filters;

  const where = and(
    search ? ilike(Reels.title, `%${search}%`) : undefined,
    status ? eq(Reels.status, status) : undefined
  );

  const offset = (page - 1) * limit;

  const rows = await db!.query.Reels.findMany({
    where,
    with: {},
    orderBy: [desc(Reels.status)],
    limit,
    offset,
  });

  const totalResponse = await db
    .select({ value: count() })
    .from(Reels)
    .where(where);

  const total = totalResponse?.[0]?.value ?? 0;

  return { reels: rows, total };
};

export const getReelById = async (id: string) => {
  const row = await db!.query.Reels.findFirst({
    where: eq(Reels.id, id),
  });
  return row;
};

export const createReel = async (reel: TNewReel) => {
  const inserted = await db!.insert(Reels).values(reel).returning();
  await getReelsFromCache();
  return inserted[0] ?? null;
};

export const updateReel = async (id: string, values: Partial<TNewReel>) => {
  const updated = await db
    .update(Reels)
    .set(values)
    .where(eq(Reels.id, id))
    .returning();
  getReelsFromCache();
  return updated[0] ?? null;
};

export const setReelStatus = async (id: string, status: TReelStatus) => {
  const updated = await db
    .update(Reels)
    .set({ status })
    .where(eq(Reels.id, id))
    .returning();
  getReelsFromCache();
  return updated[0] ?? null;
};

export const deleteReel = async (id: string) => {
  await db!.delete(Reels).where(eq(Reels.id, id));
  getReelsFromCache();
  return { id };
};
