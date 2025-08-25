"use server";
import { and, count, eq, ilike, inArray } from "drizzle-orm";

import { db } from "@repo/db/index";
import {
  HotelImages,
  HotelPolicies,
  Hotels,
  hotelTypeEnum,
  insertHotelSchema,
} from "@repo/db/schema/hotels";
import { Images } from "@repo/db/schema/image";
import { NationalParks } from "@repo/db/schema/park";
import { Policies } from "@repo/db/schema/policies";
import { Zones } from "@repo/db/schema/zones";

import type { THotelType, TNewHotel } from "@repo/db/schema/hotels";
import type { TImage } from "@repo/db/schema/image";
import type { THotel } from "@repo/db/schema/types";

export const getHotelsByParkSlug = async (slug: string) => {
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
  const parsedHotel = insertHotelSchema.parse({
    ...hotel,
  });

  const [newHotel] = await db.insert(Hotels).values(parsedHotel).returning();

  if (!newHotel) {
    return new Error("Failed to create hotel");
  }

  return newHotel;
};

export const updateHotel = async (
  hotelId: number,
  hotel: Partial<TNewHotel>
) => {
  const [updatedHotel] = await db
    .update(Hotels)
    .set(hotel)
    .where(eq(Hotels.id, hotelId))
    .returning();

  return updatedHotel;
};

export const getHotelById = async (hotelId: number) => {
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
        with: {
          amenity: true,
        },
      },
    },
  });
  return hotel as any;
};

// Hotel Images Management Actions
export const createHotelImages = async (
  hotelId: number,
  imageIds: number[]
) => {
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
  return await db.query.HotelImages.findMany({
    where: eq(HotelImages.hotel_id, hotelId),
    with: {
      image: true,
    },
  });
};

export const updateHotelPolicies = async (
  hotelId: number,
  kind: "include" | "exclude",
  policyIds: number[]
) => {
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
      console.log("newOrder", policy.id, newOrder, policy.order);

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
  return await db
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
    .where(and(...whereConditions));

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

  // Combine hotels with their images
  return hotelsInPark.map((hotel) => ({
    ...hotel.hotel,
    park: hotel.park,
    zone: hotel.zone,
    images: hotel.hotel.id ? imagesByHotelId[hotel.hotel.id] || [] : [],
  }));
};

export const getHotels = async (filters: {
  page?: number;
  limit?: number;
  search?: string;
}) => {
  const { page = 1, limit = 10, search } = filters;

  const hotels = await db.query.Hotels.findMany({
    where: and(search ? ilike(Hotels.name, `%${search}%`) : undefined),
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
    .where(and(ilike(Hotels.name, `%${search}%`)));

  return { hotels: hotels as unknown as THotel[], total: total[0]?.count || 0 };
};
