"use server";
import { and, count, eq, ilike } from 'drizzle-orm';

import { db, schema } from '@repo/db';
import { Zones, zonesInsertSchema } from '@repo/db/schema/zones';

import type { TZone } from "@repo/db/schema/types";
import type { TNewZone } from "@repo/db/schema/zones";

type TGetZonesFilters = {
  search?: string | undefined;
  page?: number;
  limit?: number;
  park?: number | undefined;
};

export const getZones = async (filters: TGetZonesFilters) => {
  const where = and(
    filters.search ? ilike(Zones.name, `%${filters.search}%`) : undefined,
    filters.park ? eq(Zones.park_id, filters.park) : undefined
  );

  const totalResponse = await db()
    .select({ count: count() })
    .from(Zones)
    .where(where);

  const zones = await db()!.query.Zones.findMany({
    where,
    limit: filters.limit,
    offset:
      filters.page && filters.limit ? (filters.page - 1) * filters.limit : 0,
    with: {
      park: true,
    },
  });

  return {
    zones: zones as unknown as TZone[],
    total: totalResponse[0]?.count ?? 0,
  };
};

export const createZone = async (payload: TNewZone) => {
  const parsed = zonesInsertSchema.parse(payload);
  // @ts-ignore
  const [newZone] = await db()!.insert(schema.Zones).values(parsed).returning();

  if (!newZone) {
    throw new Error("Failed to create zone");
  }

  return newZone;
};

export const updateZone = async (
  zoneId: number,
  payload: Partial<TNewZone>
) => {
  const parsed = zonesInsertSchema.partial().parse(payload) as any;
  // @ts-ignore
  const [updatedZone] = await db()
    .update(schema.Zones)
    .set(parsed)
    .where(eq(schema.Zones.id, zoneId))
    .returning();

  if (!updatedZone) {
    throw new Error("Failed to update zone");
  }

  return updatedZone;
};

export const deleteZone = async (zoneId: number) => {
  const [deletedZone] = await db()
    .delete(schema.Zones)
    .where(eq(schema.Zones.id, zoneId))
    .returning();

  if (!deletedZone) {
    throw new Error("Failed to delete zone");
  }

  return deletedZone;
};

export const getZoneById = async (zoneId: number) => {
  try {
    const zone = await db()!.query.Zones.findFirst({
      where: eq(schema.Zones.id, zoneId),
      with: {
        park: true,
      },
    });

    if (!zone) {
      return null;
    }

    return zone as unknown as TZone;
  } catch (error) {
    console.error("Error fetching zone by ID:", error);
    return null;
  }
};
