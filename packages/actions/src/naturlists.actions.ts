"use server";
import { and, count, db, eq, ilike, inArray } from '@repo/db/index';
import { Naturalist, NaturalistActivities } from '@repo/db/schema/naturalist';

import type {
  TNewNaturalist,
  TNewNaturalistActivities,
} from "@repo/db/schema/naturalist";

type GetNaturalistsFilters = {
  park_ids?: number[];
  search?: string;
  page?: number;
  limit?: number;
};

export const getNaturalists = async (filters: GetNaturalistsFilters) => {
  if (!db) return { naturalists: [], total: 0 };

  const { park_ids, search, page, limit } = filters;

  const where = and(
    park_ids ? inArray(Naturalist.park_id, park_ids) : undefined,
    search ? ilike(Naturalist.name, `%${search}%`) : undefined
  );

  const naturalists = await db!.query.Naturalist.findMany({
    with: {
      image: true,
      park: true,
      naturalistActivities: {
        with: {
          activity: true,
        },
      },
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
  if (!db) return null;

  const naturalist = await db!.query.Naturalist.findFirst({
    where: eq(Naturalist.id, id),
    with: {
      image: true,
      park: true,
      naturalistActivities: {
        with: {
          activity: {
            with: {
              packages: true,
              images: {
                with: {
                  image: true,
                },
              },
            },
          },
        },
      },
    },
  });
  return naturalist;
};

export const createNaturalist = async (
  naturalist: TNewNaturalist,
  activityIds: number[] = []
) => {
  const [newNaturalist] = await db
    .insert(Naturalist)
    .values(naturalist)
    .returning();

  if (activityIds.length > 0 && newNaturalist) {
    const naturalistActivities: TNewNaturalistActivities[] = activityIds.map(
      (activityId) => ({
        naturalist_id: newNaturalist.id,
        activity_id: activityId,
      })
    );
    await db.insert(NaturalistActivities).values(naturalistActivities);
  }

  return newNaturalist;
};

export const updateNaturalist = async (
  id: number,
  naturalist: Partial<TNewNaturalist>,
  activityIds?: number[]
) => {
  const [updatedNaturalist] = await db
    .update(Naturalist)
    .set(naturalist)
    .where(eq(Naturalist.id, id))
    .returning();

  // Update activities if provided
  if (activityIds !== undefined && updatedNaturalist) {
    // Get existing activities
    const existingActivities = await db.query.NaturalistActivities.findMany({
      where: eq(NaturalistActivities.naturalist_id, id),
    });

    const existingActivityIds = existingActivities
      .map((a) => a.activity_id)
      .filter((id): id is number => id !== null);

    // Find activities to delete
    const toDelete = existingActivities.filter(
      (a) => a.activity_id !== null && !activityIds.includes(a.activity_id)
    );

    // Find activities to add
    const toAdd = activityIds.filter(
      (aid) => !existingActivityIds.includes(aid)
    );

    // Delete removed activities
    if (toDelete.length > 0) {
      await db.delete(NaturalistActivities).where(
        inArray(
          NaturalistActivities.id,
          toDelete.map((a) => a.id)
        )
      );
    }

    // Add new activities
    if (toAdd.length > 0) {
      const newActivities: TNewNaturalistActivities[] = toAdd.map(
        (activityId) => ({
          naturalist_id: id,
          activity_id: activityId,
        })
      );
      await db.insert(NaturalistActivities).values(newActivities);
    }
  }

  return updatedNaturalist;
};
