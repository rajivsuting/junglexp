"use server";
import { and, count, db, eq, ilike, inArray } from '@repo/db/index';
import { Naturalist } from '@repo/db/schema/naturalist';

import type { TNewNaturalist } from "@repo/db/schema/naturalist";

type GetNaturalistsFilters = {
  park_ids?: number[];
  search?: string;
  page?: number;
  limit?: number;
};

export const getNaturalists = async (filters: GetNaturalistsFilters) => {
  const { park_ids, search, page, limit } = filters;

  const where = and(
    park_ids ? inArray(Naturalist.park_id, park_ids) : undefined,
    search ? ilike(Naturalist.name, `%${search}%`) : undefined
  );

  const naturalists = await db.query.Naturalist.findMany({
    with: {
      image: true,
      park: true,
    },
    where,
    limit,
    offset:
      page !== undefined && limit !== undefined
        ? (page - 1) * limit
        : undefined,
  });
  const totalResponse = await db
    .select({ count: count() })
    .from(Naturalist)
    .where(where);
  return { naturalists, total: totalResponse[0]?.count ?? 0 };
};

export const getNaturalistById = async (id: number) => {
  const naturalist = await db.query.Naturalist.findFirst({
    where: eq(Naturalist.id, id),
    with: {
      image: true,
      park: true,
    },
  });
  return naturalist;
};

export const createNaturalist = async (naturalist: TNewNaturalist) => {
  const newNaturalist = await db.insert(Naturalist).values(naturalist);
  return newNaturalist;
};

export const updateNaturalist = async (
  id: number,
  naturalist: Partial<TNewNaturalist>
) => {
  const updatedNaturalist = await db
    .update(Naturalist)
    .set(naturalist)
    .where(eq(Naturalist.id, id));
  return updatedNaturalist;
};
