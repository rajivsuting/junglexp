"use server";
import { and, count, eq, ilike } from "drizzle-orm";

import { db } from "@repo/db";
import { Zones } from "@repo/db/schema/zones";

import type { TZone } from "@repo/db/schema/types";

type TGetZonesFilters = {
  search?: string | undefined;
  page?: number;
  limit?: number;
  park?: number | undefined;
};

export const getZones = async (filters: TGetZonesFilters) => {
  console.log(filters);
  const where = and(
    filters.search ? ilike(Zones.name, `%${filters.search}%`) : undefined,
    filters.park ? eq(Zones.park_id, filters.park) : undefined
  );

  const totalResponse = await db
    .select({ count: count() })
    .from(Zones)
    .where(where);

  const zones = await db.query.Zones.findMany({
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
