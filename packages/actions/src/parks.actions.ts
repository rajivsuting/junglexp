"use server";
import { count, eq, ilike } from "drizzle-orm";

import { db, nationaParkInsertSchema, schema } from "@repo/db";

import { NationalParks } from "../../db/schema/park";

import type { TNewNationalPark, TNationalParkWithCity } from "@repo/db";

export const createNationalPark = async (payload: TNewNationalPark) => {
  const parsed = nationaParkInsertSchema.parse(payload);

  const newPark = await db.insert(schema.NationalParks).values(parsed);

  return newPark;
};

export const deleteNationalPark = async (parkId: string) => {
  await db
    .delete(schema.NationalParks)
    .where(eq(schema.NationalParks.id, Number(parkId)));
};

export const getNationalParkById = async (parkId: string) => {
  try {
    const park = await db.query.NationalParks.findFirst({
      where: eq(schema.NationalParks.id, Number(parkId)),
      with: {
        city: {
          with: {
            state: true,
          },
        },
      },
    });

    if (!park) {
      return null;
    }

    // Only return if the destination has a city with a state
    if (!park.city?.state) {
      return null;
    }

    return park as TNationalParkWithCity;
  } catch (error) {
    console.error("Error fetching national park by ID:", error);
    return null;
  }
};

export const getNationalParkBySlug = async (slug: string) => {
  const park = await db.query.NationalParks.findFirst({
    where: eq(schema.NationalParks.slug, slug),
  });

  return park || null;
};

type TGetNationalParksFilters = {
  search?: string | undefined;
  page?: number;
  limit?: number;
};

export const getNationalParks = async (
  filters: TGetNationalParksFilters = {}
) => {
  let where = undefined;

  if (filters.search) {
    where = ilike(schema.NationalParks.name, `%${filters.search}%`);
  }

  const totalResponse = await db
    .select({ count: count() })
    .from(NationalParks)
    .where(where);

  const destinations = await db.query.NationalParks.findMany({
    where,
    limit: filters.limit,
    offset:
      filters.page && filters.limit ? (filters.page - 1) * filters.limit : 0,
    with: {
      city: {
        with: { state: true },
      },
    },
  });

  return {
    parks: destinations as unknown as TNationalParkWithCity[],
    total: totalResponse[0]?.count ?? 0,
  };
};
