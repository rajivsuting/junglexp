"use server";
import { and, asc, count, desc, eq, getTableColumns, ilike, inArray, sql } from 'drizzle-orm';

import { db } from '@repo/db/index';
import { HotelAmenities } from '@repo/db/schema/hotel-amenities';
import {
    HotelFaqs, HotelImages, HotelPolicies, Hotels, HotelSaftyFeatures, hotelTypeEnum,
    insertHotelSchema
} from '@repo/db/schema/hotels';
import { Images } from '@repo/db/schema/image';
import { NationalParks } from '@repo/db/schema/park';
import { PlaceImages, Places } from '@repo/db/schema/places';
import { Policies } from '@repo/db/schema/policies';
import { RoomAmenities, RoomImages, RoomPlans, Rooms } from '@repo/db/schema/rooms';
import { Zones } from '@repo/db/schema/zones';

import type { TRoomBase, TRoomPlanBase } from "@repo/db/schema/rooms";
import type { THotelType, TNewHotel } from "@repo/db/schema/hotels";
import type { TImage } from "@repo/db/schema/image";
import type {
  THotel,
  TPlaceImage,
  TRoom,
  TRoomImage,
  TRoomPlan,
} from "@repo/db/schema/types";
export const getHotelsByParkSlug = async (slug: string) => {
  if (!db) return [];
  
  const hotels = await db
    .select({
      hotel: Hotels,
      zone: Zones,
      park: NationalParks,
    })
    .from(Hotels)
    .innerJoin(Zones, eq(Zones.id, Hotels.zone_id))
    .innerJoin(NationalParks, eq(NationalParks.id, Zones.park_id))
    .where(eq(NationalParks.slug, slug));

  return hotels.map((hotel) => ({
    ...hotel.hotel,
    park: hotel.park,
    zone: hotel.zone,
  }));
};

type TCreateHotePayload = {
  hotel: TNewHotel;
  // images: Omit<TImage, "hotel_id">[];
  // includes: TNewHotelAmenities[];
  // excludes: TNewHotelAmenities[];
  // policies: TNewPolicies[];
  // safetyFeatures: TNewSaftyFeatures[];
  // faqs: TNewFaqs[];
};

// const parseOrRemove = async (
//   newHotel: THotelBase,
//   hotel: TCreateHotePayload
// ) => {
//   try {
//     const parsedIncludes = hotel.includes.map((amenity) =>
//       insertHotelAmenitiesSchema.parse({ ...amenity, hotel_id: newHotel.id })
//     );
//     const parsedExcludes = hotel.excludes.map((amenity) =>
//       insertHotelAmenitiesSchema.parse({ ...amenity, hotel_id: newHotel.id })
//     );
//     const parsedPolicies = hotel.policies.map((policy) =>
//       insertPoliciesSchema.parse({ ...policy, hotel_id: newHotel.id })
//     );
//     const parsedSaftyFeatures = hotel.safetyFeatures.map((saftyFeature) =>
//       insertSaftyFeaturesSchema.parse({
//         ...saftyFeature,
//         hotel_id: newHotel.id,
//       })
//     );
//     const parsedFaqs = hotel.faqs.map((faq) =>
//       insertFaqsSchema.parse({ ...faq, hotel_id: newHotel.id })
//     );
//     const parsedImages = hotel.images.map((image) =>
//       selectHotelImageSchema.parse({ ...image, hotel_id: newHotel.id })
//     );

//     return {
//       parsedIncludes,
//       parsedExcludes,
//       parsedPolicies,
//       parsedSaftyFeatures,
//       parsedFaqs,
//       parsedImages,
//     };
//   } catch (error) {
//     await db.delete(Hotels).where(eq(Hotels.id, newHotel.id));
//     throw error;
//   }
// };

// export const createNewHotelWithDetails = async (hotel: TCreateHotePayload) => {
//   const parsedHotel = insertHotelSchema.parse({
//     ...hotel,
//   });

//   const [newHotel] = await db.insert(Hotels).values(parsedHotel).returning();

//   if (!newHotel) {
//     return new Error("Failed to create hotel");
//   }

//   const {
//     parsedIncludes,
//     parsedExcludes,
//     parsedPolicies,
//     parsedSaftyFeatures,
//     parsedFaqs,
//     parsedImages,
//   } = await parseOrRemove(newHotel, hotel);

//   const [includes, images, excludes, policies, safetyFeatures, faqs] =
//     await Promise.all([
//       db.insert(Hotels).values(parsedHotel).returning(),
//       db
//         .insert(HotelImages)
//         .values(
//           parsedImages.map((image) => ({
//             hotel_id: newHotel.id,
//             image_id: image.id,
//           }))
//         )
//         .returning(),
//       db.insert(HotelAmenities).values(parsedIncludes).returning(),
//       db.insert(HotelAmenities).values(parsedExcludes).returning(),
//       db.insert(HotelPolicies).values(parsedPolicies).returning(),
//       db.insert(SaftyFeatures).values(parsedSaftyFeatures).returning(),
//       db.insert(Faqs).values(parsedFaqs).returning(),
//     ]);

//   await Promise.all([
//     db
//       .insert(HotelSaftyFeatures)
//       .values(
//         parsedSaftyFeatures.map((feature) => ({
//           hotel_id: newHotel.id,
//           safty_feature_id: feature.id,
//         }))
//       )
//       .returning(),
//   ]);

//   return {
//     ...newHotel,
//     images: images.map((image, index) => ({
//       ...image,
//       image: parsedImages[index],
//     })),
//     includes,
//     excludes,
//     policies,
//     safetyFeatures,
//     faqs,
//   };
// };

export const createNewHotel = async (hotel: TNewHotel) => {
  if (!db) throw new Error("Database connection not available");
  
  const parsedHotel = insertHotelSchema.parse({
    ...hotel,
  });

  const [newHotel] = await db
    .insert(Hotels)
    .values(parsedHotel as any)
    .returning();

  if (!newHotel) {
    return new Error("Failed to create hotel");
  }

  return newHotel;
};

export const updateHotel = async (
  hotelId: number,
  hotel: Partial<TNewHotel>
) => {
  if (!db) throw new Error("Database connection not available");
  
  const [updatedHotel] = await db
    .update(Hotels)
    .set(hotel)
    .where(eq(Hotels.id, hotelId))
    .returning();

  return updatedHotel;
};

export const getHotelById = async (hotelId: number) => {
  if (!db) return null;
  
  const hotel = await db.query.Hotels.findFirst({
    where: eq(Hotels.id, hotelId),
    with: {
      zone: {
        with: {
          park: true,
        },
      },
      images: {
        with: {
          image: true,
        },
      },
      policies: {
        with: {
          policy: true,
        },
      },
      saftyFeatures: {
        with: {
          feature: true,
        },
      },
      amenities: {
        orderBy: [asc(RoomAmenities.order)],
        with: {
          amenity: true,
        },
      },
      faqs: {
        with: {
          faq: true,
        },
      },
    },
  });
  return hotel;
};

export const getHotelBySlug = async (slug: string) => {
  if (!db) return null;
  
  const hotel = await db.query.Hotels.findFirst({
    where: eq(Hotels.slug, slug),
    with: {
      zone: {
        with: {
          park: {
            with: {
              city: true,
            },
          },
        },
      },
      images: {
        with: {
          image: true,
        },
      },
      policies: {
        with: {
          policy: true,
        },
      },
      saftyFeatures: {
        with: {
          feature: true,
        },
      },
      amenities: {
        orderBy: [asc(RoomAmenities.order)],
        with: {
          amenity: true,
        },
      },
      faqs: {
        with: {
          faq: true,
        },
      },
      rooms: {
        with: {
          images: {
            orderBy: [asc(RoomImages.order)],
            with: {
              image: true,
            },
          },
          amenities: {
            orderBy: [asc(RoomAmenities.order)],
            with: { amenity: true },
          },
          plans: true,
        },
      },
    },
  });
  return hotel;
};

// Hotel Images Management Actions
export const createHotelImages = async (
  hotelId: number,
  imageIds: number[]
) => {
  if (!db) throw new Error("Database connection not available");
  
  const hotelImages = imageIds.map((imageId) => ({
    hotel_id: hotelId,
    image_id: imageId,
  }));

  return await db.insert(HotelImages).values(hotelImages).returning();
};

export const deleteHotelImages = async (
  hotelId: number,
  imageIds?: number[]
) => {
  if (!db) throw new Error("Database connection not available");
  
  if (imageIds && imageIds.length > 0) {
    return await db
      .delete(HotelImages)
      .where(
        and(
          eq(HotelImages.hotel_id, hotelId),
          inArray(HotelImages.image_id, imageIds)
        )
      )
      .returning();
  } else {
    // Delete all images for the hotel
    return await db
      .delete(HotelImages)
      .where(eq(HotelImages.hotel_id, hotelId))
      .returning();
  }
};

export const getHotelImages = async (hotelId: number) => {
  if (!db) return [];
  
  return await db.query.HotelImages.findMany({
    where: eq(HotelImages.hotel_id, hotelId),
    with: {
      image: true,
    },
  });
};

export const updateHotelImages = async (
  hotelId: number,
  imageUpdates: Array<{
    image_id: number;
    order: number;
    alt_text?: string;
  }>
) => {
  if (!db) throw new Error("Database connection not available");
  
  // Get existing hotel images
  const existing = await db
    .select()
    .from(HotelImages)
    .where(eq(HotelImages.hotel_id, hotelId));

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
        .delete(HotelImages)
        .where(
          and(
            eq(HotelImages.hotel_id, hotelId),
            inArray(HotelImages.image_id, imagesToDelete)
          )
        )
    );
  }

  // Create new images
  if (imagesToCreate.length > 0) {
    const newImages = imagesToCreate.map((update) => ({
      hotel_id: hotelId,
      image_id: update.image_id,
      order: update.order,
    }));
    operations.push(db.insert(HotelImages).values(newImages));
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
            .update(HotelImages)
            .set({ order: updateData.order })
            .where(eq(HotelImages.id, img.id))
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
      db!
        .update(Images)
        .set({ alt_text: update.alt_text })
        .where(eq(Images.id, update.image_id))
    );
    await Promise.all(altTextOperations);
  }

  // Return updated hotel images
  return await db!
    .select()
    .from(HotelImages)
    .where(eq(HotelImages.hotel_id, hotelId))
    .orderBy(HotelImages.order);
};

export const updateHotelPolicies = async (
  hotelId: number,
  kind: "include" | "exclude",
  policyIds: number[]
) => {
  if (!db) throw new Error("Database connection not available");
  
  // Get existing hotel policies with the specified kind using database join
  const existing = await db
    .select({
      id: HotelPolicies.id,
      hotel_id: HotelPolicies.hotel_id,
      policy_id: HotelPolicies.policy_id,
      order: HotelPolicies.order,
    })
    .from(HotelPolicies)
    .innerJoin(Policies, eq(HotelPolicies.policy_id, Policies.id))
    .where(and(eq(HotelPolicies.hotel_id, hotelId), eq(Policies.kind, kind)));

  const existingPolicyIds = existing
    .filter((policy) => policy.policy_id !== null)
    .map((policy) => policy.policy_id as number);

  // Find policies to create (new policy IDs not in existing)
  const policiesToCreate = policyIds.filter(
    (policyId) => !existingPolicyIds.includes(policyId)
  );

  // Find policies to delete (existing policy IDs not in new list)
  const policiesToDelete = existingPolicyIds.filter(
    (existingPolicyId) => !policyIds.includes(existingPolicyId)
  );

  const operations = [];

  // Delete policies that are no longer needed - using database query with join
  if (policiesToDelete.length > 0) {
    const deleteOperation = db
      .delete(HotelPolicies)
      .where(
        and(
          eq(HotelPolicies.hotel_id, hotelId),
          inArray(HotelPolicies.policy_id, policiesToDelete)
        )
      );
    operations.push(deleteOperation);
  }

  // Create new policies
  if (policiesToCreate.length > 0) {
    const newPolicies = policiesToCreate.map((policyId) => ({
      hotel_id: hotelId,
      policy_id: policyId,
      order: policyIds.indexOf(policyId),
    }));

    const createOperation = db.insert(HotelPolicies).values(newPolicies);
    operations.push(createOperation);
  }

  // Update order for existing policies that remain - batch update
  const policiesToUpdate = existing.filter(
    (policy) =>
      policy.policy_id !== null && policyIds.includes(policy.policy_id)
  );

  for (const policy of policiesToUpdate) {
    if (policy.policy_id !== null) {
      const newOrder = policyIds.indexOf(policy.policy_id);

      if (newOrder !== policy.order) {
        const updateOperation = db
          .update(HotelPolicies)
          .set({ order: newOrder })
          .where(eq(HotelPolicies.id, policy.id));
        operations.push(updateOperation);
      }
    }
  }

  // Execute all operations
  if (operations.length > 0) {
    await Promise.all(operations);
  }

  // Return updated policies using database query with join
  return db
    .select({
      id: HotelPolicies.id,
      hotel_id: HotelPolicies.hotel_id,
      policy_id: HotelPolicies.policy_id,
      order: HotelPolicies.order,
      policy: {
        id: Policies.id,
        kind: Policies.kind,
        label: Policies.label,
      },
    })
    .from(HotelPolicies)
    .innerJoin(Policies, eq(HotelPolicies.policy_id, Policies.id))
    .where(and(eq(HotelPolicies.hotel_id, hotelId), eq(Policies.kind, kind)))
    .orderBy(HotelPolicies.order);
};

export const getHotelsByParkId = async (parkId: number, type?: THotelType) => {
  if (!db) return [];
  
  // First get all hotels in the park
  const whereConditions = [eq(NationalParks.id, parkId)];

  // Add hotel type filter if provided
  if (type) {
    whereConditions.push(eq(Hotels.hotel_type, type));
  }

  const hotelsInPark = await db
    .select({
      hotel: Hotels,
      zone: Zones,
      park: NationalParks,
    })
    .from(Hotels)
    .innerJoin(Zones, eq(Zones.id, Hotels.zone_id))
    .innerJoin(NationalParks, eq(NationalParks.id, Zones.park_id))
    .where(and(...whereConditions))
    .orderBy(desc(Hotels.is_featured));

  // Then get all images for these hotels
  const hotelIds = hotelsInPark.map((h) => h.hotel.id);

  if (hotelIds.length === 0) {
    return [];
  }

  const hotelImages = await db
    .select({
      hotel_id: HotelImages.hotel_id,
      order: HotelImages.order,
      image: Images,
    })
    .from(HotelImages)
    .innerJoin(Images, eq(Images.id, HotelImages.image_id))
    .where(inArray(HotelImages.hotel_id, hotelIds))
    .orderBy(HotelImages.order);

  // Group images by hotel ID
  const imagesByHotelId = hotelImages.reduce(
    (acc, img) => {
      const hotelId = img.hotel_id;
      if (hotelId !== null && hotelId !== undefined) {
        if (!acc[hotelId]) {
          acc[hotelId] = [];
        }
        acc[hotelId].push({
          order: img.order,
          image: img.image,
        });
      }
      return acc;
    },
    {} as Record<number, Array<{ order: number; image: TImage }>>
  );

  // Fetch rooms for these hotels
  const rooms = await db
    .select({
      id: Rooms.id,
      hotel_id: Rooms.hotel_id,
      name: Rooms.name,
      description: Rooms.description,
      room_qty: Rooms.room_qty,
      capacity: Rooms.capacity,
    })
    .from(Rooms)
    .where(inArray(Rooms.hotel_id, hotelIds));

  const roomIds = rooms
    .map((r) => r.id)
    .filter((id): id is number => id !== null);

  // Fetch images for these rooms
  let imagesByRoomId: Record<
    number,
    Array<{ order: number; image: TImage }>
  > = {};
  if (roomIds.length > 0) {
    const roomImages = await db
      .select({
        room_id: RoomImages.room_id,
        order: RoomImages.order,
        image: Images,
      })
      .from(RoomImages)
      .innerJoin(Images, eq(Images.id, RoomImages.image_id))
      .where(inArray(RoomImages.room_id, roomIds))
      .orderBy(RoomImages.order);

    imagesByRoomId = roomImages.reduce(
      (acc, row) => {
        const key = row.room_id as number;
        if (key !== null && key !== undefined) {
          if (!acc[key]) acc[key] = [];
          acc[key].push({ order: row.order, image: row.image });
        }
        return acc;
      },
      {} as Record<number, Array<{ order: number; image: TImage }>>
    );
  }

  // Fetch plans for these rooms
  let plansByRoomId: Record<number, Array<TRoomPlanBase>> = {};
  if (roomIds.length > 0) {
    const plans = await db
      .select({
        id: RoomPlans.id,
        room_id: RoomPlans.room_id,
        plan_type: RoomPlans.plan_type,
        price: RoomPlans.price,
        description: RoomPlans.description,
        is_active: RoomPlans.is_active,
      })
      .from(RoomPlans)
      .where(inArray(RoomPlans.room_id, roomIds));

    plansByRoomId = plans.reduce(
      (acc, p) => {
        const rid = p.room_id as number;
        if (rid !== null && rid !== undefined) {
          if (!acc[rid]) acc[rid] = [];
          acc[rid].push(p as TRoomPlanBase);
        }
        return acc;
      },
      {} as Record<number, Array<TRoomPlanBase>>
    );
  }

  // Group rooms by hotel
  const roomsByHotelId = rooms.reduce(
    (acc, r) => {
      const hid = r.hotel_id as number;
      if (hid !== null && hid !== undefined) {
        if (!acc[hid]) acc[hid] = [];
        acc[hid].push({
          ...r,
          images: imagesByRoomId[r.id] || [],
          plans: plansByRoomId[r.id] || [],
        });
      }
      return acc;
    },
    {} as Record<
      number,
      Array<
        TRoomBase & { images: { order: number; image: TImage }[]; plans: any[] }
      >
    >
  );

  // Combine hotels with their images and rooms
  return hotelsInPark.map((hotel) => ({
    ...hotel.hotel,
    park: hotel.park,
    zone: hotel.zone,
    images: hotel.hotel.id ? imagesByHotelId[hotel.hotel.id] || [] : [],
    rooms: hotel.hotel.id ? roomsByHotelId[hotel.hotel.id] || [] : [],
  }));
};

export const getHotels = async (filters: {
  page?: number;
  limit?: number;
  search?: string;
  status?: string[];
  is_featured?: string[];
}) => {
  if (!db) return { hotels: [], total: 0 };
  
  const { page = 1, limit = 10, search, status, is_featured } = filters;

  // Build where conditions
  const whereConditions = [];

  if (search) {
    whereConditions.push(ilike(Hotels.name, `%${search}%`));
  }

  if (status && status.length > 0) {
    whereConditions.push(inArray(Hotels.status, status as any));
  }

  if (is_featured && is_featured.length > 0) {
    // Convert string array to boolean array
    const featuredBooleans = is_featured.map((f) => f === "true");
    whereConditions.push(inArray(Hotels.is_featured, featuredBooleans));
  }

  const whereClause =
    whereConditions.length > 0 ? and(...whereConditions) : undefined;

  const hotels = await db.query.Hotels.findMany({
    where: whereClause,
    limit: limit,
    offset: (page - 1) * limit,
    with: {
      zone: {
        with: {
          park: true,
        },
      },
      images: {
        with: {
          image: true,
        },
      },
    },
  });

  const total = await db
    .select({ count: count() })
    .from(Hotels)
    .where(whereClause);

  return { hotels: hotels as unknown as THotel[], total: total[0]?.count || 0 };
};

export const updateHotelAmenities = async (
  hotelId: number,
  amenityIds: number[]
) => {
  if (!db) throw new Error("Database connection not available");
  
  // Get existing hotel amenities
  const existing = await db
    .select()
    .from(HotelAmenities)
    .where(eq(HotelAmenities.hotel_id, hotelId));

  const existingAmenityIds = existing
    .filter((amenity) => amenity.amenity_id !== null)
    .map((amenity) => amenity.amenity_id as number);

  // Find amenities to create (new amenity IDs not in existing)
  const amenitiesToCreate = amenityIds.filter(
    (amenityId) => !existingAmenityIds.includes(amenityId)
  );

  // Find amenities to delete (existing amenity IDs not in new list)
  const amenitiesToDelete = existingAmenityIds.filter(
    (existingAmenityId) => !amenityIds.includes(existingAmenityId)
  );

  const operations = [];

  // Delete amenities that are no longer needed
  if (amenitiesToDelete.length > 0) {
    const deleteOperation = db
      .delete(HotelAmenities)
      .where(
        and(
          eq(HotelAmenities.hotel_id, hotelId),
          inArray(HotelAmenities.amenity_id, amenitiesToDelete)
        )
      );
    operations.push(deleteOperation);
  }

  // Create new amenities
  if (amenitiesToCreate.length > 0) {
    const newAmenities = amenitiesToCreate.map((amenityId) => ({
      hotel_id: hotelId,
      amenity_id: amenityId,
      order: amenityIds.indexOf(amenityId),
    }));

    const createOperation = db.insert(HotelAmenities).values(newAmenities);
    operations.push(createOperation);
  }

  // Update order for existing amenities that remain
  const amenitiesToUpdate = existing.filter(
    (amenity) =>
      amenity.amenity_id !== null && amenityIds.includes(amenity.amenity_id)
  );

  for (const amenity of amenitiesToUpdate) {
    if (amenity.amenity_id !== null) {
      const newOrder = amenityIds.indexOf(amenity.amenity_id);
      if (amenity.order !== newOrder) {
        const updateOperation = db
          .update(HotelAmenities)
          .set({ order: newOrder })
          .where(eq(HotelAmenities.id, amenity.id));
        operations.push(updateOperation);
      }
    }
  }

  // Execute all operations
  if (operations.length > 0) {
    await Promise.all(operations);
  }

  // Return updated amenities
  return await db
    .select()
    .from(HotelAmenities)
    .where(eq(HotelAmenities.hotel_id, hotelId))
    .orderBy(HotelAmenities.order);
};

export const updateHotelSafetyFeatures = async (
  hotelId: number,
  safetyFeatureIds: number[]
) => {
  // Get existing hotel safety features
  const existing = await db
    .select()
    .from(HotelSaftyFeatures)
    .where(eq(HotelSaftyFeatures.hotel_id, hotelId));

  const existingSafetyFeatureIds = existing
    .filter((feature) => feature.safty_feature_id !== null)
    .map((feature) => feature.safty_feature_id as number);

  // Find safety features to create (new feature IDs not in existing)
  const featuresToCreate = safetyFeatureIds.filter(
    (featureId) => !existingSafetyFeatureIds.includes(featureId)
  );

  // Find safety features to delete (existing feature IDs not in new list)
  const featuresToDelete = existingSafetyFeatureIds.filter(
    (existingFeatureId) => !safetyFeatureIds.includes(existingFeatureId)
  );

  const operations = [];

  // Delete safety features that are no longer needed
  if (featuresToDelete.length > 0) {
    const deleteOperation = db
      .delete(HotelSaftyFeatures)
      .where(
        and(
          eq(HotelSaftyFeatures.hotel_id, hotelId),
          inArray(HotelSaftyFeatures.safty_feature_id, featuresToDelete)
        )
      );
    operations.push(deleteOperation);
  }

  // Create new safety features
  if (featuresToCreate.length > 0) {
    const newFeatures = featuresToCreate.map((featureId) => ({
      hotel_id: hotelId,
      safty_feature_id: featureId,
      order: safetyFeatureIds.indexOf(featureId),
    }));

    const createOperation = db.insert(HotelSaftyFeatures).values(newFeatures);
    operations.push(createOperation);
  }

  // Update order for existing safety features that remain
  const featuresToUpdate = existing.filter(
    (feature) =>
      feature.safty_feature_id !== null &&
      safetyFeatureIds.includes(feature.safty_feature_id)
  );

  for (const feature of featuresToUpdate) {
    if (feature.safty_feature_id !== null) {
      const newOrder = safetyFeatureIds.indexOf(feature.safty_feature_id);
      if (feature.order !== newOrder) {
        const updateOperation = db
          .update(HotelSaftyFeatures)
          .set({ order: newOrder })
          .where(eq(HotelSaftyFeatures.id, feature.id));
        operations.push(updateOperation);
      }
    }
  }

  // Execute all operations
  if (operations.length > 0) {
    await Promise.all(operations);
  }

  // Return updated safety features
  return await db
    .select()
    .from(HotelSaftyFeatures)
    .where(eq(HotelSaftyFeatures.hotel_id, hotelId))
    .orderBy(HotelSaftyFeatures.order);
};

export const updateHotelFaqs = async (hotelId: number, faqIds: number[]) => {
  // Get existing hotel FAQs
  const existing = await db
    .select()
    .from(HotelFaqs)
    .where(eq(HotelFaqs.hotel_id, hotelId));

  const existingFaqIds = existing
    .filter((faq) => faq.faq_id !== null)
    .map((faq) => faq.faq_id as number);

  // Find FAQs to create (new FAQ IDs not in existing)
  const faqsToCreate = faqIds.filter(
    (faqId) => !existingFaqIds.includes(faqId)
  );

  // Find FAQs to delete (existing FAQ IDs not in new list)
  const faqsToDelete = existingFaqIds.filter(
    (existingFaqId) => !faqIds.includes(existingFaqId)
  );

  const operations = [];

  // Delete FAQs that are no longer needed
  if (faqsToDelete.length > 0) {
    const deleteOperation = db
      .delete(HotelFaqs)
      .where(
        and(
          eq(HotelFaqs.hotel_id, hotelId),
          inArray(HotelFaqs.faq_id, faqsToDelete)
        )
      );
    operations.push(deleteOperation);
  }

  // Create new FAQs
  if (faqsToCreate.length > 0) {
    const newFaqs = faqsToCreate.map((faqId) => ({
      hotel_id: hotelId,
      faq_id: faqId,
      order: faqIds.indexOf(faqId),
    }));

    const createOperation = db.insert(HotelFaqs).values(newFaqs);
    operations.push(createOperation);
  }

  // Update order for existing FAQs that remain
  const faqsToUpdate = existing.filter(
    (faq) => faq.faq_id !== null && faqIds.includes(faq.faq_id)
  );

  for (const faq of faqsToUpdate) {
    if (faq.faq_id !== null) {
      const newOrder = faqIds.indexOf(faq.faq_id);
      if (faq.order !== newOrder) {
        const updateOperation = db
          .update(HotelFaqs)
          .set({ order: newOrder })
          .where(eq(HotelFaqs.id, faq.id));
        operations.push(updateOperation);
      }
    }
  }

  // Execute all operations
  if (operations.length > 0) {
    await Promise.all(operations);
  }

  // Return updated FAQs
  return await db
    .select()
    .from(HotelFaqs)
    .where(eq(HotelFaqs.hotel_id, hotelId))
    .orderBy(HotelFaqs.order);
};

export const getNearbyPlacesToHotel = async (
  hotelId: number,
  limit: number = 10
) => {
  const hGeom = sql`(SELECT ${Hotels.location} FROM ${Hotels} WHERE ${Hotels.id} = ${hotelId})`;

  const imagesAgg = sql<TPlaceImage[]>`
  COALESCE(
    json_agg(
      json_build_object(
        'image_id', ${PlaceImages.image_id},
        'id',       ${PlaceImages.id},
        'order',    ${PlaceImages.order},
        'image',    json_build_object(
          'id',            ${Images.id},
          'small_url',     ${Images.small_url},
          'medium_url',    ${Images.medium_url},
          'large_url',     ${Images.large_url},
          'original_url',  ${Images.original_url},
          'alt_text',      ${Images.alt_text}
        )
      )
      ORDER BY ${PlaceImages.order} ASC
    ) FILTER (WHERE ${PlaceImages.id} IS NOT NULL),
    '[]'
  )
`;

  const rows = await db
    .select({
      ...getTableColumns(Places),
      distance_in_meters: sql<number>`ST_Distance(${Places.location}::geography, ${hGeom}::geography)`,
      images: imagesAgg,
      // Coordinates for client-side maps
      lat: sql<number>`ST_X(${Places.location})`,
      lon: sql<number>`ST_Y(${Places.location})`,
    })

    .from(Places)
    .leftJoin(PlaceImages, eq(PlaceImages.place_id, Places.id))
    .leftJoin(Images, eq(Images.id, PlaceImages.image_id))
    .groupBy(Places.id) // one row per place
    .orderBy(sql`${Places.location} <-> ${hGeom}`) // KNN nearest
    .limit(limit);

  const response = [];

  for (const row of rows) {
    response.push({
      ...row,
      // image: row.image,
    });
  }

  return response;
};
