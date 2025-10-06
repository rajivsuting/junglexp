'use server'
import { and, count, db, eq, gt, ilike, inArray } from '@repo/db'
import { Images } from '@repo/db/schema/image'
import { SouvenirImages, Souvenirs } from '@repo/db/schema/souvenirs'

import { createImages, deleteImages } from './image.actions'

import type { TSouvenir } from '@repo/db'
import type { TNewImage } from '@repo/db/schema/image'

import type { TNewSouvenirBase, TSouvenirBase } from '@repo/db/schema/souvenirs'

export type TGetSouvenirsFilters = {
  search?: string | undefined
  availability?: boolean
  park?: string
  page: number
  limit: number
}

export const getSouvenirs = async (_filters: TGetSouvenirsFilters) => {
  if (!db) return { souvenirs: [], total: 0 }

  let filters = []

  if (_filters.search) {
    filters.push(ilike(Souvenirs.name, `%${_filters.search}%`))
  }

  if (_filters.availability && typeof _filters.availability === 'boolean') {
    filters.push(!_filters.availability ? eq(Souvenirs.quantity, 0) : gt(Souvenirs.quantity, 0))
  }

  if (_filters.park && !isNaN(Number(_filters.park))) {
    filters.push(eq(Souvenirs.park_id, Number(_filters.park)))
  }

  const where = filters.length > 0 ? and(...filters) : undefined

  const totalResponse = await db.select({ count: count() }).from(Souvenirs).where(where)

  const souvenirs = await db!.query.Souvenirs.findMany({
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
  })

  return {
    data: souvenirs as unknown as TSouvenir[],
    total: totalResponse[0]?.count ?? 0,
  }
}

export const getSouvenirById = async (id: string) => {
  if (!db) return null
  return db!.query.Souvenirs.findFirst({
    where: eq(Souvenirs.id, Number(id)),
    with: {
      park: true,
      images: {
        with: {
          image: true,
        },
      },
    },
  }) as unknown as TSouvenir
}

export const getSouvenirBySlug = async (slug: string) => {
  return db!.query.Souvenirs.findFirst({
    where: eq(Souvenirs.slug, slug),

    with: {
      park: true,
      images: {
        with: {
          image: true,
        },
      },
    },
  })
}

export const createSouvenir = async (data: Omit<TNewSouvenirBase, 'images'>, images: TNewImage[]) => {
  const result = await db!.insert(Souvenirs).values(data).returning()

  if (!result[0]) {
    throw new Error('Failed to create souvenir')
  }

  const souvenirId = result[0].id
  const imageResult = await createImages(images)

  const souvenirImagestoStore = imageResult.map((item, index) => ({
    souvenir_id: souvenirId,
    image_id: item.id,
    order: index,
  }))

  const souvenirImages = await db.insert(SouvenirImages).values(souvenirImagestoStore).returning()

  return {
    data: {
      ...result[0],
      images: souvenirImages.map((item, index) => ({
        ...item,
        image: imageResult[index],
      })),
    } as unknown as TSouvenir,
  }
}

export const updateSouvenir = async (
  id: number,
  data: Omit<TSouvenirBase, 'images' | 'id' | 'created_at' | 'updated_at'>,
  images: TNewImage[] = [],
  imagesToDelete: number[] = []
) => {
  const result = await db.update(Souvenirs).set(data).where(eq(Souvenirs.id, id)).returning()

  if (!result[0]) {
    throw new Error('Failed to update souvenir')
  }

  const souvenirId = Number(id)

  // Delete specified images from SouvenirImages table
  if (imagesToDelete.length > 0) {
    await db
      .delete(SouvenirImages)
      .where(and(eq(SouvenirImages.souvenir_id, souvenirId), inArray(SouvenirImages.image_id, imagesToDelete)))
    await deleteImages(imagesToDelete)
  }

  // Add new images if provided
  let newSouvenirImages: any[] = []
  if (images.length > 0) {
    const imageResult = await createImages(images)

    const souvenirImagesToStore = imageResult.map((item, index) => ({
      souvenir_id: souvenirId,
      image_id: item.id,
      order: index,
    }))

    newSouvenirImages = await db.insert(SouvenirImages).values(souvenirImagesToStore).returning()
  }

  // Fetch and return the updated souvenir with all current images
  const updatedSouvenir = await db!.query.Souvenirs.findFirst({
    where: eq(Souvenirs.id, souvenirId),
    with: {
      park: true,
      images: {
        with: {
          image: true,
        },
      },
    },
  })

  return {
    data: updatedSouvenir as unknown as TSouvenir,
  }
}

// Create souvenir without images (to be managed separately)
export const createSouvenirBase = async (data: Omit<TNewSouvenirBase, 'images'>) => {
  const result = await db!.insert(Souvenirs).values(data).returning()
  if (!result[0]) throw new Error('Failed to create souvenir')
  return result[0]
}

// Update only base souvenir fields (no image mutations)
export const updateSouvenirBase = async (id: number, data: Omit<TSouvenirBase, 'id' | 'created_at' | 'updated_at'>) => {
  const result = await db.update(Souvenirs).set(data).where(eq(Souvenirs.id, id)).returning()
  if (!result[0]) throw new Error('Failed to update souvenir')
  return result[0]
}

// Update souvenir images: create, delete, reorder and alt text
export const updateSouvenirImages = async (
  souvenirId: number,
  imageUpdates: Array<{
    image_id: number
    order: number
    alt_text?: string
  }>
) => {
  // Get existing souvenir images
  const existing = await db.select().from(SouvenirImages).where(eq(SouvenirImages.souvenir_id, souvenirId))

  const existingImageIds = existing.filter(row => row.image_id !== null).map(row => row.image_id as number)

  const newImageIds = imageUpdates.map(u => u.image_id)

  // Identify images to delete (existing not in new list)
  const imagesToDelete = existingImageIds.filter(existingImageId => !newImageIds.includes(existingImageId))

  const operations: Promise<any>[] = []

  // Delete removed join rows
  if (imagesToDelete.length > 0) {
    operations.push(
      db
        .delete(SouvenirImages)
        .where(and(eq(SouvenirImages.souvenir_id, souvenirId), inArray(SouvenirImages.image_id, imagesToDelete)))
    )
  }

  // Create new join rows
  const imagesToCreate = imageUpdates.filter(update => !existingImageIds.includes(update.image_id))
  if (imagesToCreate.length > 0) {
    const rows = imagesToCreate.map(u => ({
      souvenir_id: souvenirId,
      image_id: u.image_id,
      order: u.order,
    }))
    operations.push(db!.insert(SouvenirImages).values(rows))
  }

  // Update order for existing join rows
  const imagesToUpdate = existing.filter(row => row.image_id !== null && newImageIds.includes(row.image_id))
  for (const row of imagesToUpdate) {
    if (row.image_id !== null) {
      const updateData = imageUpdates.find(u => u.image_id === row.image_id)
      if (updateData && row.order !== updateData.order) {
        operations.push(
          db
            .update(SouvenirImages)
            .set({ order: updateData.order })
            .where(eq(SouvenirImages.id, row.id as number))
        )
      }
    }
  }

  if (operations.length > 0) {
    await Promise.all(operations)
  }

  // Update alt text for images if provided
  const imageAltTextUpdates = imageUpdates.filter(u => u.alt_text !== undefined)
  if (imageAltTextUpdates.length > 0) {
    await Promise.all(
      imageAltTextUpdates.map(u => db.update(Images).set({ alt_text: u.alt_text! }).where(eq(Images.id, u.image_id)))
    )
  }

  // Return updated list
  return await db.select().from(SouvenirImages).where(eq(SouvenirImages.souvenir_id, souvenirId))
}
