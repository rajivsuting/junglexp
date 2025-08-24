"use server";
import { and, count, eq, ilike, inArray } from "drizzle-orm";

import { db, schema } from "@repo/db";
import { Images } from "@repo/db/schema/image";
import {
  NationalParks,
  nationaParkInsertSchema,
  ParkImages,
  parkImagesInsertSchema,
} from "@repo/db/schema/park";

import { deleteImages } from "./image.actions";
import { getOrSet } from "./libs/cache";
import { nationalParkBySlugKey } from "./libs/keys";

import type {
  TNewNationalPark,
  TNationalPark,
  TNationalParkBase,
} from "@repo/db";
// Types should match your server response
export interface ImageVariant {
  size: "small" | "medium" | "large" | "original";
  url: string;
  width?: number;
  height?: number;
}

export interface UploadResult {
  variants: ImageVariant[];
  originalName: string;
}

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
  console.log("parkId", parkId);
  try {
    const park = await db.query.NationalParks.findFirst({
      where: eq(schema.NationalParks.id, Number(parkId)),
      with: {
        city: {
          with: {
            state: true,
          },
        },
        images: {
          with: {
            image: true,
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

    return park as any as TNationalPark;
  } catch (error) {
    console.error("Error fetching national park by ID:", error);
    return null;
  }
};

export const getNationalParkBySlug = async (slug: string) => {
  return getOrSet(
    () =>
      db.query.NationalParks.findFirst({
        where: eq(schema.NationalParks.slug, slug),
        with: {
          city: {
            with: {
              state: true,
            },
          },
          images: {
            with: {
              image: true,
            },
          },
        },
      }),
    {
      key: await nationalParkBySlugKey(slug),
    }
  );
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

  console.log("filters", filters);

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
      images: {
        with: {
          image: true,
        },
        // orderBy: (images, { asc }) => [asc(images.order)],
      },
    },
  });

  console.log("destinations", JSON.stringify(destinations, null, 2));

  return {
    parks: destinations as unknown as TNationalPark[],
    total: totalResponse[0]?.count ?? 0,
  };
};

type NewImageInput = {
  small_url: string;
  medium_url: string;
  large_url: string;
  original_url: string;
};

type CreateParkImagesPayload = {
  existing: Array<{ image_id: number; order: number }>;
  added: Array<{ image: NewImageInput; order: number }>; // brand-new image to create then attach
  removed: number[]; // ignored for create
};

export const createPark = async (
  data: TNewNationalPark,
  imagesPayload: CreateParkImagesPayload,
  parkId?: number
) => {
  const parsed = nationaParkInsertSchema.parse(data);

  // 1) Create or fetch park
  let park: TNationalParkBase;
  if (parkId) {
    const found = await db.query.NationalParks.findFirst({
      where: eq(schema.NationalParks.id, parkId),
    });

    if (!found) throw new Error("Failed to find park");

    await db
      .update(NationalParks)
      .set({
        name: parsed.name,
        description: parsed.description,
        slug: parsed.slug,
        city_id: parsed.city_id,
      })
      .where(eq(schema.NationalParks.id, parkId));

    park = found as TNationalParkBase;
  } else {
    const [createdPark] = await db
      .insert(NationalParks)
      .values(parsed)
      .returning();
    if (!createdPark) throw new Error("Failed to create park");
    park = createdPark as TNationalParkBase;
  }

  // 2) Insert new Images for any 'added' entries that include full image payload
  const toInsert = imagesPayload.added.filter(
    (a): a is { image: NewImageInput; order: number } => "image" in a
  );

  let insertedImages: { id: number; order: number }[] = [];
  if (toInsert.length > 0) {
    const imageRows = toInsert.map((a) => a.image);
    const created = await db.insert(Images).values(imageRows).returning(); // TImage[]
    if (!created || created.length !== toInsert.length) {
      throw new Error("Failed to insert images");
    }
    insertedImages = created.map((img, idx) => ({
      id: img.id,
      order: toInsert[idx]!.order,
    }));
  }

  // 3) Combine all joins (existing + newly inserted), then remove the ones marked as removed
  const existingPairs = imagesPayload.existing.map((e) => ({
    id: e.image_id,
    order: e.order,
    source: "existing" as const,
  }));

  const addedExistingIdPairs = imagesPayload.added
    .filter((a) => "image_id" in a)
    .map((a) => ({
      id: a.image_id,
      order: a.order,
      source: "added-existing" as const,
    }));

  const addedNewPairs = insertedImages.map(({ id, order }) => ({
    id,
    order,
    source: "added-new" as const,
  }));

  const removedSet = new Set(imagesPayload.removed);

  // EXCLUDE removed, not include
  let allForJoin = [
    ...existingPairs,
    ...addedExistingIdPairs,
    ...addedNewPairs,
  ].filter((x) => !removedSet.has(x.id as number));

  // Normalize duplicates: keep the one with the lowest order (or last one); here we keep the lowest order
  const byImage = new Map<
    number,
    {
      id: number;
      order: number;
      source: "existing" | "added-existing" | "added-new";
    }
  >();
  for (const row of allForJoin) {
    const prev = byImage.get(row.id as number);
    if (!prev || row.order < prev.order) {
      byImage.set(row.id as number, row as any);
    }
  }
  allForJoin = Array.from(byImage.values());

  // Sort by order
  allForJoin.sort((a, b) => a.order - b.order);

  // 4) Apply removals: delete only for this park
  if (imagesPayload.removed.length > 0) {
    await db
      .delete(ParkImages)
      .where(
        and(
          eq(ParkImages.park_id, park.id),
          inArray(ParkImages.image_id, imagesPayload.removed)
        )
      );

    try {
      const res = await deleteImages(imagesPayload.removed);
      console.log("images deleted", res);
    } catch (error) {
      console.error("Error deleting images", error);
    }
  }

  // 5) Upsert join rows to reflect final order
  // Strategy:
  // - Fetch current joins for this park
  // - For each target in allForJoin:
  //   - If exists -> update order if changed
  //   - Else -> insert
  const currentJoins = await db
    .select()
    .from(ParkImages)
    .where(eq(ParkImages.park_id, park.id));

  const currentByImage = new Map<number, (typeof currentJoins)[number]>();
  for (const pj of currentJoins) currentByImage.set(pj.image_id, pj);

  const toUpdate: Array<{ image_id: number; order: number }> = [];
  const toInsertJoins: Array<{
    park_id: number;
    image_id: number;
    order: number;
  }> = [];

  for (const target of allForJoin) {
    const existing = currentByImage.get(target.id as number);
    if (existing) {
      if (existing.order !== target.order) {
        toUpdate.push({ image_id: target.id as number, order: target.order });
      }
    } else {
      toInsertJoins.push(
        parkImagesInsertSchema.parse({
          park_id: park.id,
          image_id: target.id,
          order: target.order,
        })
      );
    }
  }

  if (toInsertJoins.length > 0) {
    await db.insert(ParkImages).values(toInsertJoins);
  }

  for (const u of toUpdate) {
    await db
      .update(ParkImages)
      .set({ order: u.order })
      .where(
        and(
          eq(ParkImages.park_id, park.id),
          eq(ParkImages.image_id, u.image_id)
        )
      );
  }

  // 6) Build return payload with joined images
  const finalImageIds: number[] = allForJoin.map((x) => x.id as number);
  const imagesMap = new Map<number, any>();
  if (finalImageIds.length > 0) {
    const imgs = await db
      .select()
      .from(Images)
      .where(inArray(Images.id, finalImageIds));
    for (const img of imgs) imagesMap.set(img.id, img);
  }

  // Re-read joins to ensure we reflect the latest order/state
  const finalJoins = await db
    .select()
    .from(ParkImages)
    .where(eq(ParkImages.park_id, park.id));

  const responseImages = finalJoins
    .map((pi) => ({
      image_id: pi.image_id,
      park_id: pi.park_id,
      image: imagesMap.get(pi.image_id) ?? null,
      order: pi.order,
    }))
    .sort((a, b) => a.order - b.order);

  return {
    park: {
      ...park,
      images: responseImages,
    },
  };
};
