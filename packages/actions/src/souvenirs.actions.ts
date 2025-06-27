"use server";
import { and, count, db, eq, ilike, inArray } from "@repo/db";
import { SouvenirImages, Souvenirs } from "@repo/db/schema/souvenirs";

import { createImages, deleteImages } from "./image.actions";

import type { TSouvenir } from "@repo/db";
import type { TNewImage } from "@repo/db/schema/image";
import type {
  TNewSouvenirBase,
  TSouvenirBase,
} from "@repo/db/schema/souvenirs";

export type TGetSouvenirsFilters = {
  search?: string | undefined;
  availability?: boolean;
  park?: string;
  page: number;
  limit: number;
};

export const getSouvenirs = async (_filters: TGetSouvenirsFilters) => {
  let filters = [];

  if (_filters.search) {
    filters.push(ilike(Souvenirs.name, `%${_filters.search}%`));
  }

  if (_filters.availability && typeof _filters.availability === "boolean") {
    filters.push(eq(Souvenirs.is_available, _filters.availability));
  }

  if (_filters.park && !isNaN(Number(_filters.park))) {
    filters.push(eq(Souvenirs.park_id, Number(_filters.park)));
  }

  const where = filters.length > 0 ? and(...filters) : undefined;

  const totalResponse = await db
    .select({ count: count() })
    .from(Souvenirs)
    .where(where);

  const souvenirs = await db.query.Souvenirs.findMany({
    where,
    limit: _filters.limit,
    offset: _filters.page ? (_filters.page - 1) * _filters.limit : 0,
    with: {
      images: {
        with: {
          image: true,
        },
      },
      park: true,
    },
  });

  return {
    data: souvenirs as unknown as TSouvenir[],
    total: totalResponse[0]?.count ?? 0,
  };
};

export const getSouvenirById = async (id: string) => {
  return db.query.Souvenirs.findFirst({
    where: eq(Souvenirs.id, Number(id)),
    with: {
      park: true,
      images: {
        with: {
          image: true,
        },
      },
    },
  }) as unknown as TSouvenir;
};

export const getSouvenirBySlug = async (slug: string) => {
  return db.query.Souvenirs.findFirst({
    where: eq(Souvenirs.slug, slug),
    with: {
      images: true,
    },
  });
};

export const createSouvenir = async (
  data: Omit<TNewSouvenirBase, "images">,
  images: TNewImage[]
) => {
  const result = await db.insert(Souvenirs).values(data).returning();

  if (!result[0]) {
    throw new Error("Failed to create souvenir");
  }

  const souvenirId = result[0].id;
  const imageResult = await createImages(images);

  const souvenirImagestoStore = imageResult.map((item) => ({
    souvenir_id: souvenirId,
    image_id: item.id,
  }));

  const souvenirImages = await db
    .insert(SouvenirImages)
    .values(souvenirImagestoStore)
    .returning();

  return {
    data: {
      ...result[0],
      images: souvenirImages.map((item, index) => ({
        ...item,
        image: imageResult[index],
      })),
    } as unknown as TSouvenir,
  };
};

export const updateSouvenir = async (
  id: number,
  data: Omit<TSouvenirBase, "images" | "id" | "created_at" | "updated_at">,
  images: TNewImage[] = [],
  imagesToDelete: number[] = []
) => {
  const result = await db
    .update(Souvenirs)
    .set(data)
    .where(eq(Souvenirs.id, id))
    .returning();

  if (!result[0]) {
    throw new Error("Failed to update souvenir");
  }

  const souvenirId = Number(id);

  // Delete specified images from SouvenirImages table
  if (imagesToDelete.length > 0) {
    await db
      .delete(SouvenirImages)
      .where(
        and(
          eq(SouvenirImages.souvenir_id, souvenirId),
          inArray(SouvenirImages.image_id, imagesToDelete)
        )
      );
    await deleteImages(imagesToDelete);
  }

  // Add new images if provided
  let newSouvenirImages: any[] = [];
  if (images.length > 0) {
    const imageResult = await createImages(images);

    const souvenirImagesToStore = imageResult.map((item) => ({
      souvenir_id: souvenirId,
      image_id: item.id,
    }));

    newSouvenirImages = await db
      .insert(SouvenirImages)
      .values(souvenirImagesToStore)
      .returning();
  }

  // Fetch and return the updated souvenir with all current images
  const updatedSouvenir = await db.query.Souvenirs.findFirst({
    where: eq(Souvenirs.id, souvenirId),
    with: {
      park: true,
      images: {
        with: {
          image: true,
        },
      },
    },
  });

  return {
    data: updatedSouvenir as unknown as TSouvenir,
  };
};
