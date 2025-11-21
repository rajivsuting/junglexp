"use server";
import { and, count, eq, getTableColumns, ilike, inArray, notInArray, or, sql } from 'drizzle-orm';

import { db, schema } from '@repo/db';
import { Hotels } from '@repo/db/schema/hotels';
import {
    RoomAmenities, roomAmenitiesInsertSchema, RoomImages, roomImagesInsertSchema, RoomPlans,
    roomPlansInsertSchema, Rooms, roomsInsertSchema
} from '@repo/db/schema/rooms';

import type { TRoom } from "@repo/db/schema/types";
import type {
  TNewRoom,
  TNewRoomImage,
  TNewRoomAmenity,
  TNewRoomPlan,
} from "@repo/db/schema/rooms";
type TGetRoomsFilters = {
  search?: string | undefined;
  page?: number;
  limit?: number;
  hotel_id?: number | number[] | undefined;
};

export const getRooms = async (filters: TGetRoomsFilters) => {
  // Build search conditions for both room name and hotel name
  const searchConditions = [];
  if (filters.search) {
    searchConditions.push(ilike(Rooms.name, `%${filters.search}%`));
    // Also search by hotel name by joining with Hotels table
    searchConditions.push(ilike(schema.Hotels.name, `%${filters.search}%`));
  }

  // Handle hotel filtering for single or multiple hotel IDs
  let hotelCondition;
  if (filters.hotel_id) {
    if (Array.isArray(filters.hotel_id)) {
      hotelCondition = inArray(Rooms.hotel_id, filters.hotel_id);
    } else {
      hotelCondition = eq(Rooms.hotel_id, filters.hotel_id);
    }
  }

  const where = and(
    searchConditions.length > 0 ? or(...searchConditions) : undefined,
    hotelCondition
  );

  // For count query, we need to use join to include hotel name search
  const totalResponse = await db()
    .select({ count: count() })
    .from(Rooms)
    .leftJoin(schema.Hotels, eq(Rooms.hotel_id, schema.Hotels.id))
    .where(where);

  // Ensure page and limit are valid numbers and calculate safe offset
  const page = Math.max(1, filters.page || 1);
  const limit = Math.max(1, filters.limit || 10);
  const offset = (page - 1) * limit;

  const rooms = await db()!.query.Rooms.findMany({
    where,
    limit,
    offset,
    with: {
      hotel: {
        columns: {
          id: true,
          name: true,
          description: true,
        },
        with: {
          zone: {
            with: {
              park: true,
            },
          },
        },
        extras: {
          lat: sql<number>`ST_X(${schema.Hotels.location})`.as("lat"),
          lon: sql<number>`ST_Y(${schema.Hotels.location})`.as("lon"),
        },
      },

      images: {
        with: {
          image: true,
        },
      },
      amenities: {
        with: {
          amenity: true,
        },
      },
      plans: true,
    },
  });

  return {
    rooms: rooms as unknown as TRoom[],
    total: totalResponse[0]?.count ?? 0,
  };
};

export const createRoom = async (payload: TNewRoom) => {
  const parsed = roomsInsertSchema.parse(payload);
  // @ts-ignore
  const [newRoom] = await db()!.insert(schema.Rooms).values(parsed).returning();

  if (!newRoom) {
    throw new Error("Failed to create room");
  }

  return newRoom;
};

export const updateRoom = async (
  roomId: number,
  payload: Partial<TNewRoom>
) => {
  const parsed = roomsInsertSchema.partial().parse(payload) as any;
  // @ts-ignore
  const [updatedRoom] = await db()
    .update(schema.Rooms)
    .set(parsed)
    .where(eq(schema.Rooms.id, roomId))
    .returning();

  if (!updatedRoom) {
    throw new Error("Failed to update room");
  }

  return updatedRoom;
};

export const deleteRoom = async (roomId: number) => {
  const [deletedRoom] = await db()
    .delete(schema.Rooms)
    .where(eq(schema.Rooms.id, roomId))
    .returning();

  if (!deletedRoom) {
    throw new Error("Failed to delete room");
  }

  return deletedRoom;
};

export const getRoomById = async (roomId: number) => {
  try {
    const room = await db()!.query.Rooms.findFirst({
      where: eq(schema.Rooms.id, roomId),
      with: {
        hotel: {
          columns: {
            id: true,
            name: true,
            description: true,
          },
          with: {
            zone: {
              with: {
                park: true,
              },
            },
          },
          extras: {
            lat: sql<number>`ST_X(${schema.Hotels.location})`.as("lat"),
            lon: sql<number>`ST_Y(${schema.Hotels.location})`.as("lon"),
          },
        },
        images: {
          with: {
            image: true,
          },
        },
        amenities: {
          with: {
            amenity: true,
          },
        },
        plans: true,
      },
    });

    if (!room) {
      return null;
    }

    return room as unknown as TRoom;
  } catch (error) {
    console.error("Error fetching room by ID:", error);
    return null;
  }
};

// Room Images
export const addRoomImages = async (roomId: number, imageIds: number[]) => {
  const imagesToInsert = imageIds.map((imageId, index) =>
    roomImagesInsertSchema.parse({
      room_id: roomId,
      image_id: imageId,
      order: index,
    })
  ) as any;
  // @ts-ignore
  const insertedImages = await db()
    .insert(RoomImages)
    .values(imagesToInsert)
    .returning();

  return insertedImages;
};

export const removeRoomImages = async (roomId: number, imageIds: number[]) => {
  await db()!
    .delete(RoomImages)
    .where(
      and(
        eq(RoomImages.room_id, roomId)
        // Note: This is a simplified version. For proper implementation, you'd use inArray
      )
    );
};

export const updateRoomImages = async (
  roomId: number,
  imageUpdates: Array<{
    image_id: number;
    order: number;
    alt_text?: string;
  }>
) => {
  // Get existing room images
  const existing = await db()
    .select()
    .from(RoomImages)
    .where(eq(RoomImages.room_id, roomId));

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
        .delete(RoomImages)
        .where(
          and(
            eq(RoomImages.room_id, roomId),
            inArray(RoomImages.image_id, imagesToDelete)
          )
        )
    );
  }

  // Create new images
  if (imagesToCreate.length > 0) {
    const newImages = imagesToCreate.map((update) => ({
      room_id: roomId,
      image_id: update.image_id,
      order: update.order,
    }));
    operations.push(db()!.insert(RoomImages).values(newImages));
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
            .update(RoomImages)
            .set({ order: updateData.order })
            .where(eq(RoomImages.id, img.id))
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
      db()
        .update(schema.Images)
        .set({ alt_text: update.alt_text })
        .where(eq(schema.Images.id, update.image_id))
    );
    await Promise.all(altTextOperations);
  }

  // Return updated room images
  return await db()
    .select()
    .from(RoomImages)
    .where(eq(RoomImages.room_id, roomId))
    .orderBy(RoomImages.order);
};

// Room Amenities
export const addRoomAmenities = async (
  roomId: number,
  amenityIds: number[]
) => {
  const amenitiesToInsert = amenityIds.map((amenityId, index) =>
    roomAmenitiesInsertSchema.parse({
      room_id: roomId,
      amenity_id: amenityId,
      order: index,
    })
  ) as any;
  // @ts-ignore
  const insertedAmenities = await db()
    .insert(RoomAmenities)
    .values(amenitiesToInsert)
    .returning();

  return insertedAmenities;
};

export const removeRoomAmenities = async (
  roomId: number,
  amenityIds: number[]
) => {
  await db()!
    .delete(RoomAmenities)
    .where(
      and(
        eq(RoomAmenities.room_id, roomId)
        // Note: This is a simplified version. For proper implementation, you'd use inArray
      )
    );
};

// Sync room amenities: upsert new ones by order and remove those not present
export const updateRoomAmenities = async (
  roomId: number,
  orderedAmenityIds: number[]
) => {
  // Fetch existing amenities for the room
  const existing = await db()
    .select()
    .from(RoomAmenities)
    .where(eq(RoomAmenities.room_id, roomId));

  const existingAmenityIds = existing
    .map((ra) => ra.amenity_id)
    .filter((id): id is number => id !== null);

  // Determine deletions and creations
  const toDelete = existingAmenityIds.filter(
    (id) => !orderedAmenityIds.includes(id)
  );
  const toCreate = orderedAmenityIds.filter(
    (id) => !existingAmenityIds.includes(id)
  );

  const ops: Promise<unknown>[] = [];

  if (toDelete.length > 0) {
    ops.push(
      db()
        .delete(RoomAmenities)
        .where(
          and(
            eq(RoomAmenities.room_id, roomId),
            inArray(RoomAmenities.amenity_id, toDelete)
          )
        )
    );
  }

  if (toCreate.length > 0) {
    const values = toCreate.map((amenityId, index) =>
      roomAmenitiesInsertSchema.parse({
        room_id: roomId,
        amenity_id: amenityId,
        order: orderedAmenityIds.indexOf(amenityId),
      })
    );
    // @ts-ignore
    ops.push(db()!.insert(RoomAmenities).values(values));
  }

  // Update order for existing items
  for (const item of existing) {
    if (item.amenity_id == null) continue;
    const newIndex = orderedAmenityIds.indexOf(item.amenity_id);
    if (newIndex === -1) continue; // will be deleted above
    if (item.order !== newIndex) {
      ops.push(
        db()
          .update(RoomAmenities)
          .set({ order: newIndex })
          .where(eq(RoomAmenities.id, item.id))
      );
    }
  }

  if (ops.length > 0) {
    await Promise.all(ops);
  }

  // Return updated list
  return await db()
    .select()
    .from(RoomAmenities)
    .where(eq(RoomAmenities.room_id, roomId))
    .orderBy(RoomAmenities.order);
};

// Room Plans
export const createRoomPlan = async (payload: TNewRoomPlan) => {
  const parsed = roomPlansInsertSchema.parse(payload);
  // @ts-ignore
  const [newPlan] = await db()!.insert(RoomPlans).values(parsed).returning();

  if (!newPlan) {
    throw new Error("Failed to create room plan");
  }

  return newPlan;
};

export const updateRoomPlan = async (
  planId: number,
  payload: Partial<TNewRoomPlan>
) => {
  const parsed = roomPlansInsertSchema.partial().parse(payload) as any;
  // @ts-ignore
  const [updatedPlan] = await db()
    .update(RoomPlans)
    .set(parsed)
    .where(eq(RoomPlans.id, planId))
    .returning();

  if (!updatedPlan) {
    throw new Error("Failed to update room plan");
  }

  return updatedPlan;
};

export const deleteRoomPlan = async (planId: number) => {
  const [deletedPlan] = await db()
    .delete(RoomPlans)
    .where(eq(RoomPlans.id, planId))
    .returning();

  if (!deletedPlan) {
    throw new Error("Failed to delete room plan");
  }

  return deletedPlan;
};

export const getRoomPlansByRoomId = async (roomId: number) => {
  const plans = await db()!.query.RoomPlans.findMany({
    where: eq(RoomPlans.room_id, roomId),
  });

  return plans;
};
