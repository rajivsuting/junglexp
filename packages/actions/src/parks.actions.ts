"use server";
import { and, count, eq, ilike, inArray } from 'drizzle-orm';

import { db, schema } from '@repo/db';
import { Images } from '@repo/db/schema/image';
import {
    NationalParks, nationaParkInsertSchema, ParkImages, parkImagesInsertSchema
} from '@repo/db/schema/park';

import { deleteImages } from './image.actions';
import { getOrSet } from './libs/cache';
import { nationalParkBySlugKey } from './libs/keys';

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
  if (!db()) throw new Error("Database connection not available");

  const parsed = nationaParkInsertSchema.parse(payload);
  // @ts-ignore
  const newPark = await db()!.insert(schema.NationalParks).values(parsed);

  return newPark;
};

export const deleteNationalPark = async (parkId: string) => {
  if (!db()) throw new Error("Database connection not available");

  await db()
    .delete(schema.NationalParks)
    .where(eq(schema.NationalParks.id, Number(parkId)));
};

export const getNationalParkById = async (parkId: string) => {
  if (!db()) return null;

  try {
    const park = await db()!.query.NationalParks.findFirst({
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
          where: (parkImages, { eq }) => eq(parkImages.is_mobile, false),
        },
        mobile_images: {
          with: {
            image: true,
          },
          where: (parkImages, { eq }) => eq(parkImages.is_mobile, true),
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
  if (!db()) return null;
  return getOrSet(
    () =>
      db()!.query.NationalParks.findFirst({
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
            where: (parkImages, { eq }) => eq(parkImages.is_mobile, false),
          },
          mobile_images: {
            with: {
              image: true,
            },
            where: (parkImages, { eq }) => eq(parkImages.is_mobile, true),
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

const upsertImages = async (
  parkId: number,
  isMobile: boolean,
  imagesPayload: CreateParkImagesPayload
) => {
  if (!db()) throw new Error("Database connection not available");

  // 2) Insert new Images for any 'added' entries that include full image payload
  const toInsert = imagesPayload.added.filter(
    (a): a is { image: NewImageInput; order: number } => "image" in a
  );

  let insertedImages: { id: number; order: number }[] = [];
  if (toInsert.length > 0) {
    const imageRows = toInsert.map((a) => ({ ...a.image }));
    const created = await db()!.insert(Images).values(imageRows).returning(); // TImage[]
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
    await db()
      .delete(ParkImages)
      .where(
        and(
          eq(ParkImages.park_id, parkId),
          inArray(ParkImages.image_id, imagesPayload.removed)
        )
      );

    try {
      const res = await deleteImages(imagesPayload.removed);
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
  const currentJoins = await db()
    .select()
    .from(ParkImages)
    .where(eq(ParkImages.park_id, parkId));

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
        // @ts-ignore
        parkImagesInsertSchema.parse({
          park_id: parkId,
          image_id: target.id,
          order: target.order,
          is_mobile: isMobile,
        })
      );
    }
  }

  if (toInsertJoins.length > 0) {
    await db()!.insert(ParkImages).values(toInsertJoins);
  }

  for (const u of toUpdate) {
    await db()
      .update(ParkImages)
      .set({ order: u.order })
      .where(
        and(eq(ParkImages.park_id, parkId), eq(ParkImages.image_id, u.image_id))
      );
  }

  // Update alt text for existing images if provided
  const altTextUpdates = imagesPayload.existing.filter(
    (existing) => existing.alt_text !== undefined
  );
  if (altTextUpdates.length > 0) {
    const altTextOperations = altTextUpdates.map((update) =>
      db()!
        .update(Images)
        .set({ alt_text: update.alt_text })
        .where(eq(Images.id, update.image_id))
    );
    await Promise.all(altTextOperations);
  }

  // 6) Build return payload with joined images
  const finalImageIds: number[] = allForJoin.map((x) => x.id as number);
  const imagesMap = new Map<number, any>();
  if (finalImageIds.length > 0) {
    const imgs = await db()
      .select()
      .from(Images)
      .where(inArray(Images.id, finalImageIds));
    for (const img of imgs) imagesMap.set(img.id, img);
  }

  // Re-read joins to ensure we reflect the latest order/state
  const finalJoins = await db()
    .select()
    .from(ParkImages)
    .where(eq(ParkImages.park_id, parkId));

  const responseImages = finalJoins
    .map((pi) => ({
      image_id: pi.image_id,
      park_id: pi.park_id,
      is_mobile: pi.is_mobile,
      image: imagesMap.get(pi.image_id) ?? null,
      order: pi.order,
    }))
    .sort((a, b) => a.order - b.order);

  return responseImages;
};

export const getNationalParks = async (
  filters: TGetNationalParksFilters = {}
) => {
  if (!db()) return { destinations: [], total: 0 };

  let where = undefined;

  if (filters.search) {
    where = ilike(schema.NationalParks.name, `%${filters.search}%`);
  }

  const totalResponse = await db()!
    .select({ count: count() })
    .from(NationalParks)
    .where(where);

  const destinations = await db()!.query.NationalParks.findMany({
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
        where: (parkImages, { eq }) => eq(parkImages.is_mobile, false),
        // orderBy: (images, { asc }) => [asc(images.order)],
      },
      mobile_images: {
        with: {
          image: true,
        },
        where: (parkImages, { eq }) => eq(parkImages.is_mobile, true),
        // orderBy: (images, { asc }) => [asc(images.order)],
      },
    },
  });

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
  existing: Array<{ image_id: number; order: number; alt_text?: string }>;
  added: Array<{ image: NewImageInput; order: number }>; // brand-new image to create then attach
  removed: number[]; // ignored for create
};

export const createPark = async (
  data: TNewNationalPark,
  imagesPayload: CreateParkImagesPayload,
  mobileImagesPayload: CreateParkImagesPayload,
  parkId?: number
) => {
  if (!db()) throw new Error("Database connection not available");

  const parsed = nationaParkInsertSchema.parse(data);

  // 1) Create or fetch park
  let park: TNationalParkBase;
  if (parkId) {
    const found = await db()!.query.NationalParks.findFirst({
      where: eq(schema.NationalParks.id, parkId),
    });

    if (!found) throw new Error("Failed to find park");

    await db()
      .update(NationalParks)
      .set({
        name: parsed.name,
        description: parsed.description,
        slug: parsed.slug,
        // @ts-ignore
        city_id: parsed.city_id,
      })
      .where(eq(schema.NationalParks.id, parkId));

    park = found as TNationalParkBase;
  } else {
    // @ts-ignore
    const [createdPark] = await db()
      .insert(NationalParks)
      .values(parsed as any)
      .returning();
    if (!createdPark) throw new Error("Failed to create park");
    park = createdPark as TNationalParkBase;
  }

  const responseImages = await upsertImages(park.id, false, imagesPayload);

  const mobileResponseImages = await upsertImages(
    park.id,
    true,
    mobileImagesPayload
  );
  return {
    park: {
      ...park,
      images: responseImages,
      mobile_images: mobileResponseImages,
    },
  };
};

export const updateParkImages = async (
  parkId: number,
  imageUpdates: Array<{
    image_id: number;
    order: number;
    alt_text?: string;
  }>
) => {
  if (!db()) throw new Error("Database connection not available");

  // Get existing place images
  const existing = await db()
    .select()
    .from(ParkImages)
    .where(eq(ParkImages.park_id, parkId));

  const existingImageIds = existing
    .filter((img) => img.image_id !== null)
    .map((img) => img.image_id as number);

  const newImageIds = imageUpdates.map((update) => update.image_id);

  // Identify images to delete (existing not in new list)
  const imagesToDelete = existingImageIds.filter(
    (existingImageId) => !newImageIds.includes(existingImageId)
  );

  // Identify images to create (new not in existing list)
  const imagesToCreate = imageUpdates.filter(
    (update) => !existingImageIds.includes(update.image_id)
  );

  const operations = [];

  // Delete removed images
  if (imagesToDelete.length > 0) {
    operations.push(
      db()
        .delete(ParkImages)
        .where(
          and(
            eq(ParkImages.park_id, parkId),
            inArray(ParkImages.image_id, imagesToDelete)
          )
        )
    );
  }

  // Create new images
  if (imagesToCreate.length > 0) {
    const newImages = imagesToCreate.map((update) => ({
      park_id: parkId,
      image_id: update.image_id,
      order: update.order,
    }));

    operations.push(db()!.insert(ParkImages).values(newImages));
  }

  // Update order for existing images
  const imagesToUpdate = existing.filter(
    (img) => img.image_id !== null && newImageIds.includes(img.image_id)
  );

  for (const img of imagesToUpdate) {
    if (img.image_id !== null) {
      const updateData = imageUpdates.find((u) => u.image_id === img.image_id);
      if (updateData && img.order !== updateData.order) {
        operations.push(
          db()
            .update(ParkImages)
            .set({ order: updateData.order })
            .where(eq(ParkImages.id, img.id))
        );
      }
    }
  }

  // Execute all operations
  if (operations.length > 0) {
    await Promise.all(operations);
  }

  // Update alt text for images if provided
  const imageAltTextUpdates = imageUpdates.filter(
    (update) => update.alt_text !== undefined
  );
  if (imageAltTextUpdates.length > 0) {
    const altTextOperations = imageAltTextUpdates.map((update) =>
      db()!
        .update(Images)
        .set({ alt_text: update.alt_text })
        .where(eq(Images.id, update.image_id))
    );
    await Promise.all(altTextOperations);
  }

  // Return updated place images
  return await db()!
    .select()
    .from(ParkImages)
    .where(eq(ParkImages.park_id, parkId))
    .orderBy(ParkImages.order);
};
