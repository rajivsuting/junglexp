"use server";

import { and, count, eq, ilike, inArray, or } from "drizzle-orm";

import { db, schema } from "@repo/db";
import { PlaceImages, Places } from "@repo/db/schema/places";
import { createPoint } from "@repo/db/utils/postgis";
import {
  generateSlug,
  generateUniqueSlug,
} from "@repo/db/utils/slug-generator";

import type { TNewPlace, TPlaceBase } from "@repo/db/schema/places";
export interface TGetPlacesFilters {
  page?: number;
  limit?: number;
  search?: string;
}

export interface TGetPlacesResponse {
  places: TPlaceBase[];
  total: number;
  page: number;
  totalPages: number;
}

export interface TPlaceWithImages extends TPlaceBase {
  images?: Array<{
    id: number;
    order: number;
    image: {
      id: number;
      created_at: Date | null;
      updated_at: Date | null;
      small_url: string;
      medium_url: string;
      large_url: string;
      original_url: string;
      alt_text: string;
    } | null;
  }>;
}

export interface TCreatePlaceWithImages {
  name: string;
  description: string;
  location: { x: number; y: number };
  images?: Array<{
    file?: File;
    alt_text: string;
    order: number;
  }>;
}

export interface TUpdatePlaceWithImages {
  name?: string;
  description?: string;
  location?: { x: number; y: number };
  images?: Array<{
    image_id?: number;
    file?: File;
    alt_text: string;
    order: number;
    _type: "existing" | "new";
  }>;
}

// New types for image management
type CreatePlaceImagesPayload = {
  existing: Array<{ image_id: number; order: number }>;
  added: Array<{ image: any; order: number }>; // brand-new image to create then attach
  removed: number[]; // ignored for create
};

export const getPlaces = async (
  filters: TGetPlacesFilters = {}
): Promise<TGetPlacesResponse> => {
  try {
    const { page = 1, limit = 10, search } = filters;
    const offset = (page - 1) * limit;

    // Build search conditions
    const searchConditions = [];
    if (search) {
      searchConditions.push(ilike(schema.Places.name, `%${search}%`));
      searchConditions.push(ilike(schema.Places.description, `%${search}%`));
    }

    const where =
      searchConditions.length > 0 ? or(...searchConditions) : undefined;

    // Get total count
    const totalResult = await db
      .select({ count: count() })
      .from(schema.Places)
      .where(where);

    const total = totalResult[0]?.count || 0;
    const totalPages = Math.ceil(total / limit);

    // Get places with pagination and images
    const places = await db.query.Places.findMany({
      where,
      limit,
      offset,
      orderBy: Places.name,
      with: {
        images: {
          with: {
            image: true,
          },
          orderBy: PlaceImages.order,
        },
      },
    });

    return {
      places,
      total,
      page,
      totalPages,
    };
  } catch (error) {
    console.error("Error fetching places:", error);
    throw new Error("Failed to fetch places");
  }
};

export const getPlaceById = async (
  id: number
): Promise<TPlaceWithImages | null> => {
  try {
    const place = await db.query.Places.findFirst({
      where: eq(schema.Places.id, id),
      with: {
        images: {
          with: {
            image: true,
          },
          orderBy: PlaceImages.order,
        },
      },
    });
    return place || null;
  } catch (error) {
    console.error("Error fetching place by ID:", error);
    return null;
  }
};

export const getPlaceBySlug = async (
  slug: string
): Promise<TPlaceBase | null> => {
  try {
    const [place] = await db
      .select()
      .from(schema.Places)
      .where(eq(schema.Places.slug, slug));

    return place || null;
  } catch (error) {
    console.error("Error fetching place by slug:", error);
    throw new Error("Failed to fetch place by slug");
  }
};

const getExistingSlugs = async (): Promise<string[]> => {
  const existingSlugs = await db
    .select({ slug: Places.slug })
    .from(schema.Places);
  return existingSlugs.map((p) => p.slug);
};

export const createPlace = async (
  data: Omit<TNewPlace, "slug">,
  imagesPayload?: CreatePlaceImagesPayload
): Promise<TPlaceBase> => {
  try {
    // Get existing slugs to ensure uniqueness
    const existingSlugList = await getExistingSlugs();

    // Generate unique slug if not provided
    let slug = generateSlug(data.name);
    slug = generateUniqueSlug(slug, existingSlugList);

    const [newPlace] = await db
      .insert(schema.Places)
      .values({ ...data, slug })
      .returning();

    if (!newPlace) {
      throw new Error("Failed to create place");
    }

    // Handle images if provided
    if (imagesPayload && imagesPayload.added.length > 0) {
      // Insert new Images for any 'added' entries that include full image payload
      const toInsert = imagesPayload.added.filter(
        (a): a is { image: any; order: number } => "image" in a
      );

      if (toInsert.length > 0) {
        const imageRows = toInsert.map((a) => a.image);
        const created = await db
          .insert(schema.Images)
          .values(imageRows)
          .returning();

        if (created && created.length === toInsert.length) {
          // Create place-image relationships
          const placeImageRows = created.map((img, idx) => ({
            place_id: newPlace.id,
            image_id: img.id,
            order: toInsert[idx]!.order,
          }));

          await db.insert(schema.PlaceImages).values(placeImageRows);
        }
      }
    }

    return newPlace;
  } catch (error) {
    console.error("Error creating place:", error);
    throw new Error("Failed to create place");
  }
};

export const updatePlace = async (
  id: number,
  data: Partial<Omit<TPlaceBase, "id">>,
  imagesPayload?: CreatePlaceImagesPayload
): Promise<TPlaceBase> => {
  try {
    const existingPlace = await getPlaceById(id);

    if (!existingPlace) {
      throw new Error("Place not found");
    }

    let slug = existingPlace.slug;

    if (data.name && existingPlace.name !== data.name) {
      const existingSlugList = await getExistingSlugs();
      slug = generateSlug(data.name);
      slug = generateUniqueSlug(slug, existingSlugList);
    }

    const [updatedPlace] = await db
      .update(schema.Places)
      .set({ ...data, slug })
      .where(eq(schema.Places.id, id))
      .returning();

    if (!updatedPlace) {
      throw new Error("Failed to update place");
    }

    // Handle images if provided
    if (imagesPayload) {
      // Handle removed images
      if (imagesPayload.removed.length > 0) {
        await db
          .delete(schema.PlaceImages)
          .where(
            and(
              eq(schema.PlaceImages.place_id, id),
              inArray(schema.PlaceImages.image_id, imagesPayload.removed)
            )
          );
      }

      // Handle added images
      if (imagesPayload.added.length > 0) {
        const toInsert = imagesPayload.added.filter(
          (a): a is { image: any; order: number } => "image" in a
        );

        if (toInsert.length > 0) {
          const imageRows = toInsert.map((a) => a.image);
          const created = await db
            .insert(schema.Images)
            .values(imageRows)
            .returning();

          if (created && created.length === toInsert.length) {
            const placeImageRows = created.map((img, idx) => ({
              place_id: id,
              image_id: img.id,
              order: toInsert[idx]!.order,
            }));

            await db.insert(schema.PlaceImages).values(placeImageRows);
          }
        }
      }

      // Handle existing images with updated order
      if (imagesPayload.existing.length > 0) {
        for (const existing of imagesPayload.existing) {
          await db
            .update(schema.PlaceImages)
            .set({ order: existing.order })
            .where(
              and(
                eq(schema.PlaceImages.place_id, id),
                eq(schema.PlaceImages.image_id, existing.image_id)
              )
            );
        }
      }
    }

    return updatedPlace;
  } catch (error) {
    console.error("Error updating place:", error);
    throw new Error("Failed to update place");
  }
};

export const deletePlace = async (id: number): Promise<void> => {
  try {
    await db.delete(schema.Places).where(eq(schema.Places.id, id));
  } catch (error) {
    console.error("Error deleting place:", error);
    throw new Error("Failed to delete place");
  }
};

/**
 * Calculate distance between a point and a geometry using Haversine formula
 * This is a fallback when PostGIS distance calculation is not available
 */
function calculateDistanceFromGeometry(
  lat1: number,
  lon1: number,
  geometry: any
): number {
  // For now, we'll use a simplified approach
  // In a real implementation, you'd extract the coordinates from the geometry
  // and use the Haversine formula or PostGIS ST_Distance

  // This is a placeholder - you might want to implement proper geometry parsing
  // or use PostGIS functions directly in the database query

  const R = 6371; // Earth's radius in kilometers
  // Placeholder calculation - replace with actual geometry coordinate extraction
  const lat2 = 0; // Extract from geometry
  const lon2 = 0; // Extract from geometry

  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) *
      Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

/**
 * Create a place with coordinates (helper function for easier API usage)
 */
export const createPlaceWithCoordinates = async (
  name: string,
  description: string,
  latitude: number,
  longitude: number,
  slug?: string
): Promise<TPlaceBase> => {
  try {
    // Create the geometry using raw SQL since createPoint returns SQL expression
    const location = createPoint(latitude, longitude) as any;

    const placeData: TNewPlace = {
      name,
      description,
      location,
      slug: slug || "",
    };

    return await createPlace(placeData);
  } catch (error) {
    console.error("Error creating place with coordinates:", error);
    throw new Error("Failed to create place with coordinates");
  }
};

export const updatePlaceImages = async (
  placeId: number,
  imageUpdates: Array<{
    image_id: number;
    order: number;
    alt_text?: string;
  }>
) => {
  // Get existing place images
  const existing = await db
    .select()
    .from(schema.PlaceImages)
    .where(eq(schema.PlaceImages.place_id, placeId));

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
      db
        .delete(schema.PlaceImages)
        .where(
          and(
            eq(schema.PlaceImages.place_id, placeId),
            inArray(schema.PlaceImages.image_id, imagesToDelete)
          )
        )
    );
  }

  // Create new images
  if (imagesToCreate.length > 0) {
    const newImages = imagesToCreate.map((update) => ({
      place_id: placeId,
      image_id: update.image_id,
      order: update.order,
    }));
    operations.push(db.insert(schema.PlaceImages).values(newImages));
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
          db
            .update(schema.PlaceImages)
            .set({ order: updateData.order })
            .where(eq(schema.PlaceImages.id, img.id))
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
      db
        .update(schema.Images)
        .set({ alt_text: update.alt_text })
        .where(eq(schema.Images.id, update.image_id))
    );
    await Promise.all(altTextOperations);
  }

  // Return updated place images
  return await db
    .select()
    .from(schema.PlaceImages)
    .where(eq(schema.PlaceImages.place_id, placeId))
    .orderBy(schema.PlaceImages.order);
};
