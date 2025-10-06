"use server";
import { and, count, eq, ilike, inArray, or } from 'drizzle-orm';

import { db } from '@repo/db';
import {
    Activities, ActivityAmenities, ActivityImages, ActivityItinerary, ActivityPackages,
    ActivityPolicies
} from '@repo/db/schema/activities';
import { Images } from '@repo/db/schema/image';
import { NationalParks } from '@repo/db/schema/park';
import { Policies } from '@repo/db/schema/policies';
import { generateSlug } from '@repo/db/utils/slug-generator';

import type {
  TActivityBase,
  TNewActivity,
  TNewActivityAmenity,
  TNewActivityImage,
  TNewActivityItinerary,
  TNewActivityPackage,
  TCreateActivity,
  TCreateActivityPackage,
} from "@repo/db/schema/activities";
import type { TActivity } from "@repo/db/index";
export type TGetActivitiesFilters = {
  search?: string | undefined;
  page?: number;
  limit?: number;
  park_id?: number | number[] | undefined;
};

export type TGetActivitiesByParkSlugFilters = {
  search?: string | undefined;
  page?: number;
  limit?: number;
  park_slug?: string;
};

export const getActivities = async (filters: TGetActivitiesFilters) => {
  if (!db) return { activities: [], total: 0, totalPages: 0 };

  const where = and(
    filters.search ? ilike(Activities.name, `%${filters.search}%`) : undefined,
    filters.park_id
      ? Array.isArray(filters.park_id)
        ? inArray(Activities.park_id, filters.park_id)
        : eq(Activities.park_id, filters.park_id)
      : undefined
  );

  const totalResponse = await db
    .select({ count: count() })
    .from(Activities)
    .where(where);

  // Ensure page and limit are valid numbers and calculate safe offset
  const page = Math.max(1, filters.page || 1);
  const limit = Math.max(1, filters.limit || 10);
  const offset = (page - 1) * limit;

  const activities = await db.query.Activities.findMany({
    where,
    limit,
    offset,
    orderBy: Activities.name,
    with: {
      park: {
        with: {
          city: {
            with: { state: true },
          },
        },
      },
      images: {
        with: {
          image: true,
        },
        orderBy: ActivityImages.order,
      },
      policies: {
        with: {
          policy: true,
        },
      },
      itinerary: {
        orderBy: ActivityItinerary.order,
      },
      amenities: {
        with: {
          amenity: true,
        },
        orderBy: ActivityAmenities.order,
      },
      packages: {
        orderBy: ActivityPackages.order,
        limit: 1,
      },
    },
  });

  return {
    activities: activities as unknown as TActivity[],
    total: totalResponse[0]?.count ?? 0,
  };
};

export const getActivitiesByParkSlug = async (
  filters: TGetActivitiesByParkSlugFilters
) => {
  if (!db) return { activities: [], total: 0, totalPages: 0 };
  
  // First, find the park by slug if park_slug is provided
  let parkId: number | undefined;
  if (filters.park_slug) {
    const park = await db.query.NationalParks.findFirst({
      where: eq(NationalParks.slug, filters.park_slug),
      columns: { id: true },
    });

    if (!park) {
      // If park not found, return empty results
      return {
        activities: [],
        total: 0,
      };
    }

    parkId = park.id;
  }

  // Build where condition for activities
  const where = and(
    filters.search ? ilike(Activities.name, `%${filters.search}%`) : undefined,
    parkId ? eq(Activities.park_id, parkId) : undefined
  );

  const totalResponse = await db
    .select({ count: count() })
    .from(Activities)
    .where(where);

  // Ensure page and limit are valid numbers and calculate safe offset
  const page =
    filters.page !== undefined ? Math.max(1, filters.page) : undefined;
  const limit =
    filters.limit !== undefined ? Math.max(1, filters.limit) : undefined;

  const offset =
    page !== undefined && limit !== undefined ? (page - 1) * limit : undefined;

  const activities = await db.query.Activities.findMany({
    where,
    limit,
    offset,
    orderBy: Activities.name,
    with: {
      park: {
        with: {
          city: {
            with: { state: true },
          },
        },
      },
      images: {
        with: {
          image: true,
        },
        orderBy: ActivityImages.order,
      },
      policies: {
        with: {
          policy: true,
        },
      },
      itinerary: {
        orderBy: ActivityItinerary.order,
      },
      amenities: {
        with: {
          amenity: true,
        },
        orderBy: ActivityAmenities.order,
      },
      packages: {
        orderBy: ActivityPackages.order,
      },
    },
  });

  return {
    activities: activities as unknown as TActivity[],
    total: totalResponse[0]?.count ?? 0,
  };
};

export const getActivityById = async (id: number) => {
  if (!db) return null;
  
  const activity = await db.query.Activities.findFirst({
    where: eq(Activities.id, id),
    with: {
      park: {
        with: {
          city: {
            with: { state: true },
          },
        },
      },
      images: {
        with: {
          image: true,
        },
        orderBy: ActivityImages.order,
      },
      policies: {
        with: {
          policy: true,
        },
      },
      itinerary: {
        orderBy: ActivityItinerary.order,
      },
      amenities: {
        with: {
          amenity: true,
        },
        orderBy: ActivityAmenities.order,
      },
      packages: {
        orderBy: ActivityPackages.order,
      },
    },
  });

  return activity;
};

export const getActivityBySlug = async (slug: string) => {
  if (!db) return null;
  
  const activity = await db.query.Activities.findFirst({
    where: eq(Activities.slug, slug),
    with: {
      park: {
        with: {
          city: {
            with: { state: true },
          },
          zones: true,
        },
      },
      images: {
        with: {
          image: true,
        },
        orderBy: ActivityImages.order,
      },
      policies: {
        with: {
          policy: true,
        },
      },
      itinerary: {
        orderBy: ActivityItinerary.order,
      },
      amenities: {
        with: {
          amenity: true,
        },
        orderBy: ActivityAmenities.order,
      },
      packages: {
        orderBy: ActivityPackages.order,
      },
    },
  });

  return activity;
};

export const createActivity = async (data: TCreateActivity) => {
  if (!db) throw new Error("Database connection not available");
  
  // Generate slug from name
  const slug = generateSlug(data.name, {
    separator: "-",
    lowercase: true,
    removeStopWords: true,
    maxLength: 60,
  });

  // Convert to TNewActivity format with generated slug
  const activityData: TNewActivity = {
    ...data,
    slug,
  };

  const [activity] = await db!
    .insert(Activities)
    .values(activityData)
    .returning();
  return activity;
};

export const updateActivity = async (
  id: number,
  data: Partial<TNewActivity>
) => {
  if (!db) throw new Error("Database connection not available");
  
  const [activity] = await db
    .update(Activities)
    .set({ ...data, updated_at: new Date() })
    .where(eq(Activities.id, id))
    .returning();
  return activity;
};

export const deleteActivity = async (id: number): Promise<void> => {
  if (!db) throw new Error("Database connection not available");
  
  await db.delete(Activities).where(eq(Activities.id, id));
};

// Activity Images
export const createActivityImage = async (data: TNewActivityImage) => {
  if (!db) throw new Error("Database connection not available");
  
  const [image] = await db.insert(ActivityImages).values(data).returning();
  return image;
};

export const updateActivityImage = async (
  id: number,
  data: Partial<TNewActivityImage>
) => {
  if (!db) throw new Error("Database connection not available");
  
  const [image] = await db
    .update(ActivityImages)
    .set(data)
    .where(eq(ActivityImages.id, id))
    .returning();
  return image;
};

export const deleteActivityImage = async (id: number): Promise<void> => {
  if (!db) throw new Error("Database connection not available");
  
  await db.delete(ActivityImages).where(eq(ActivityImages.id, id));
};

export const updateActivityImages = async (
  activityId: number,
  imageUpdates: Array<{
    image_id: number;
    order: number;
    alt_text?: string;
  }>
) => {
  if (!db) throw new Error("Database connection not available");
  
  // Get existing activity images
  const existing = await db
    .select()
    .from(ActivityImages)
    .where(eq(ActivityImages.activity_id, activityId));

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
  if (imagesToDelete.length > 0 && db) {
    operations.push(
      db!
        .delete(ActivityImages)
        .where(
          and(
            eq(ActivityImages.activity_id, activityId),
            inArray(ActivityImages.image_id, imagesToDelete)
          )
        )
    );
  }

  // Create new images
  if (imagesToCreate.length > 0 && db) {
    const newImages = imagesToCreate.map((update) => ({
      activity_id: activityId,
      image_id: update.image_id,
      order: update.order,
    }));
    operations.push(db!.insert(ActivityImages).values(newImages));
  }

  // Update order for existing images
  const imagesToUpdate = existing.filter(
    (img) => img.image_id !== null && newImageIds.includes(img.image_id)
  );

  for (const img of imagesToUpdate) {
    if (img.image_id !== null && db) {
      const updateData = imageUpdates.find((u) => u.image_id === img.image_id);
      if (updateData && img.order !== updateData.order) {
        operations.push(
          db!
            .update(ActivityImages)
            .set({ order: updateData.order })
            .where(eq(ActivityImages.id, img.id))
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
  if (imageAltTextUpdates.length > 0 && db) {
    const altTextOperations = imageAltTextUpdates.map((update) =>
      db!
        .update(Images)
        .set({ alt_text: update.alt_text })
        .where(eq(Images.id, update.image_id))
    );
    await Promise.all(altTextOperations);
  }

  // Return updated activity images
  if (!db) return [];
  
  return await db
    .select()
    .from(ActivityImages)
    .where(eq(ActivityImages.activity_id, activityId))
    .orderBy(ActivityImages.order);
};

// Activity Itinerary
export const createActivityItinerary = async (data: TNewActivityItinerary) => {
  if (!db) throw new Error("Database connection not available");
  
  const [itinerary] = await db
    .insert(ActivityItinerary)
    .values(data)
    .returning();
  return itinerary;
};

export const updateActivityItinerary = async (
  id: number,
  data: Partial<TNewActivityItinerary>
) => {
  if (!db) throw new Error("Database connection not available");
  
  const [itinerary] = await db
    .update(ActivityItinerary)
    .set(data)
    .where(eq(ActivityItinerary.id, id))
    .returning();
  return itinerary;
};

export const updateActivityItineraries = async (
  activityId: number,
  itineraryItems: Array<{
    id?: number; // existing DB id if present
    title: string;
    description: string;
    order: number; // desired order in UI
  }>
) => {
  if (!db) throw new Error("Database connection not available");
  
  // Fetch existing itinerary items for this activity
  const existing = await db
    .select({
      id: ActivityItinerary.id,
      title: ActivityItinerary.title,
      description: ActivityItinerary.description,
      order: ActivityItinerary.order,
    })
    .from(ActivityItinerary)
    .where(eq(ActivityItinerary.activity_id, activityId));

  const existingIds = new Set(existing.map((e) => e.id));
  const incomingIds = new Set(
    itineraryItems.filter((i) => i.id !== undefined).map((i) => i.id as number)
  );

  const operations: Promise<unknown>[] = [];

  // 1) Delete items that exist in DB but not in incoming list
  const idsToDelete = [...existingIds].filter((id) => !incomingIds.has(id));
  if (idsToDelete.length > 0) {
    operations.push(
      db
        .delete(ActivityItinerary)
        .where(inArray(ActivityItinerary.id, idsToDelete))
    );
  }

  // 2) Create new items (those without id)
  const itemsToCreate = itineraryItems.filter((i) => i.id === undefined);
  if (itemsToCreate.length > 0) {
    operations.push(
      db.insert(ActivityItinerary).values(
        itemsToCreate.map((i) => ({
          activity_id: activityId,
          title: i.title,
          description: i.description,
          order: i.order,
        }))
      )
    );
  }

  // 3) Update changed items (title/description/order)
  const itemsToUpdate = itineraryItems.filter(
    (i) => i.id !== undefined
  ) as Array<{
    id: number;
    title: string;
    description: string;
    order: number;
  }>;
  for (const incoming of itemsToUpdate) {
    const current = existing.find((e) => e.id === incoming.id);
    if (!current) continue;

    const needsUpdate =
      current.title !== incoming.title ||
      current.description !== incoming.description ||
      current.order !== incoming.order;

    if (needsUpdate) {
      operations.push(
        db
          .update(ActivityItinerary)
          .set({
            title: incoming.title,
            description: incoming.description,
            order: incoming.order,
          })
          .where(eq(ActivityItinerary.id, incoming.id))
      );
    }
  }

  if (operations.length > 0) {
    await Promise.all(operations);
  }

  // Return updated itinerary, ordered
  return db
    .select()
    .from(ActivityItinerary)
    .where(eq(ActivityItinerary.activity_id, activityId))
    .orderBy(ActivityItinerary.order);
};

export const deleteActivityItinerary = async (id: number): Promise<void> => {
  if (!db) throw new Error("Database connection not available");
  
  await db.delete(ActivityItinerary).where(eq(ActivityItinerary.id, id));
};

// Activity Amenities
export const createActivityAmenity = async (data: TNewActivityAmenity) => {
  if (!db) throw new Error("Database connection not available");
  
  const [amenity] = await db.insert(ActivityAmenities).values(data).returning();
  return amenity;
};

export const updateActivityAmenity = async (
  id: number,
  data: Partial<TNewActivityAmenity>
) => {
  if (!db) throw new Error("Database connection not available");
  
  const [amenity] = await db
    .update(ActivityAmenities)
    .set(data)
    .where(eq(ActivityAmenities.id, id))
    .returning();
  return amenity;
};

export const deleteActivityAmenity = async (id: number): Promise<void> => {
  if (!db) throw new Error("Database connection not available");
  
  await db.delete(ActivityAmenities).where(eq(ActivityAmenities.id, id));
};

// Activity Packages
export const createActivityPackage = async (data: TCreateActivityPackage) => {
  if (!db) throw new Error("Database connection not available");
  
  // Get the next order number for this activity
  const existingPackages = await db
    .select({ order: ActivityPackages.order })
    .from(ActivityPackages)
    .where(eq(ActivityPackages.activity_id, data.activity_id))
    .orderBy(ActivityPackages.order);

  const nextOrder =
    existingPackages.length > 0
      ? Math.max(...existingPackages.map((p) => p.order)) + 1
      : 0;

  // Convert to TNewActivityPackage format with generated order
  const packageData: TNewActivityPackage = {
    ...data,
    order: nextOrder,
  };

  const [package_] = await db
    .insert(ActivityPackages)
    .values(packageData)
    .returning();
  return package_;
};

export const updateActivityPackage = async (
  id: number,
  data: Partial<TNewActivityPackage>
) => {
  if (!db) throw new Error("Database connection not available");
  
  const [package_] = await db
    .update(ActivityPackages)
    .set(data)
    .where(eq(ActivityPackages.id, id))
    .returning();
  return package_;
};

export const deleteActivityPackage = async (id: number): Promise<void> => {
  if (!db) throw new Error("Database connection not available");
  
  await db.delete(ActivityPackages).where(eq(ActivityPackages.id, id));
};

export const updateActivityPackages = async (
  activityId: number,
  packageItems: Array<{
    id?: number; // existing DB id if present
    name: string;
    duration: number;
    number: number;
    price: number;
    price_1: number;
    active: boolean;
    order: number; // desired order in UI
  }>
) => {
  if (!db) throw new Error("Database connection not available");
  
  // Fetch existing package items for this activity
  const existing = await db
    .select({
      id: ActivityPackages.id,
      name: ActivityPackages.name,
      duration: ActivityPackages.duration,
      number: ActivityPackages.number,
      price: ActivityPackages.price,
      price_1: ActivityPackages.price_1,
      active: ActivityPackages.active,
      order: ActivityPackages.order,
    })
    .from(ActivityPackages)
    .where(eq(ActivityPackages.activity_id, activityId));

  const existingIds = new Set(existing.map((e) => e.id));
  const incomingIds = new Set(
    packageItems.filter((i) => i.id !== undefined).map((i) => i.id as number)
  );

  const operations: Promise<unknown>[] = [];

  // 1) Delete items that exist in DB but not in incoming list
  const idsToDelete = [...existingIds].filter((id) => !incomingIds.has(id));
  if (idsToDelete.length > 0) {
    operations.push(
      db
        .delete(ActivityPackages)
        .where(inArray(ActivityPackages.id, idsToDelete))
    );
  }

  // 2) Create new items (those without id)
  const itemsToCreate = packageItems.filter((i) => i.id === undefined);
  if (itemsToCreate.length > 0) {
    operations.push(
      db.insert(ActivityPackages).values(
        itemsToCreate.map((i) => ({
          activity_id: activityId,
          name: i.name,
          duration: i.duration,
          number: i.number,
          price: i.price,
          price_1: i.price_1,
          active: i.active,
          order: i.order,
        }))
      )
    );
  }

  // 3) Update changed items (all fields including order)
  const itemsToUpdate = packageItems.filter(
    (i) => i.id !== undefined
  ) as Array<{
    id: number;
    name: string;
    duration: number;
    number: number;
    price: number;
    price_1: number;
    active: boolean;
    order: number;
  }>;
  for (const incoming of itemsToUpdate) {
    const current = existing.find((e) => e.id === incoming.id);
    if (!current) continue;

    const needsUpdate =
      current.name !== incoming.name ||
      current.duration !== incoming.duration ||
      current.number !== incoming.number ||
      current.price !== incoming.price ||
      current.price_1 !== incoming.price_1 ||
      current.active !== incoming.active ||
      current.order !== incoming.order;

    if (needsUpdate) {
      operations.push(
        db
          .update(ActivityPackages)
          .set({
            name: incoming.name,
            duration: incoming.duration,
            number: incoming.number,
            price: incoming.price,
            price_1: incoming.price_1,
            active: incoming.active,
            order: incoming.order,
          })
          .where(eq(ActivityPackages.id, incoming.id))
      );
    }
  }

  if (operations.length > 0) {
    await Promise.all(operations);
  }

  // Return updated packages, ordered
  return db
    .select()
    .from(ActivityPackages)
    .where(eq(ActivityPackages.activity_id, activityId))
    .orderBy(ActivityPackages.order);
};

export const updateActivityAmenities = async (
  activityId: number,
  amenityIds: number[]
) => {
  if (!db) throw new Error("Database connection not available");
  
  // Get existing activity amenities
  const existing = await db
    .select()
    .from(ActivityAmenities)
    .where(eq(ActivityAmenities.activity_id, activityId));

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
      .delete(ActivityAmenities)
      .where(
        and(
          eq(ActivityAmenities.activity_id, activityId),
          inArray(ActivityAmenities.amenity_id, amenitiesToDelete)
        )
      );
    operations.push(deleteOperation);
  }

  // Create new amenities
  if (amenitiesToCreate.length > 0) {
    const newAmenities = amenitiesToCreate.map((amenityId) => ({
      activity_id: activityId,
      amenity_id: amenityId,
      order: amenityIds.indexOf(amenityId),
    }));

    const createOperation = db.insert(ActivityAmenities).values(newAmenities);
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

      if (newOrder !== amenity.order) {
        const updateOperation = db
          .update(ActivityAmenities)
          .set({ order: newOrder })
          .where(eq(ActivityAmenities.id, amenity.id));
        operations.push(updateOperation);
      }
    }
  }

  // Execute all operations
  if (operations.length > 0) {
    await Promise.all(operations);
  }

  // Return updated amenities
  return db
    .select()
    .from(ActivityAmenities)
    .where(eq(ActivityAmenities.activity_id, activityId))
    .orderBy(ActivityAmenities.order);
};

export const updateActivityPolicies = async (
  activityId: number,
  kind: "include" | "exclude",
  policyIds: number[]
) => {
  if (!db) throw new Error("Database connection not available");
  
  // Get existing hotel policies with the specified kind using database join
  const existing = await db
    .select({
      id: ActivityPolicies.id,
      activity_id: ActivityPolicies.activity_id,
      policy_id: ActivityPolicies.policy_id,
      order: ActivityPolicies.order,
    })
    .from(ActivityPolicies)
    .innerJoin(Policies, eq(ActivityPolicies.policy_id, Policies.id))
    .where(
      and(eq(ActivityPolicies.activity_id, activityId), eq(Policies.kind, kind))
    );

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
      .delete(ActivityPolicies)
      .where(
        and(
          eq(ActivityPolicies.activity_id, activityId),
          inArray(ActivityPolicies.policy_id, policiesToDelete)
        )
      );
    operations.push(deleteOperation);
  }

  // Create new policies
  if (policiesToCreate.length > 0) {
    const newPolicies = policiesToCreate.map((policyId) => ({
      activity_id: activityId,
      policy_id: policyId,
      order: policyIds.indexOf(policyId),
    }));

    const createOperation = db.insert(ActivityPolicies).values(newPolicies);
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
          .update(ActivityPolicies)
          .set({ order: newOrder })
          .where(eq(ActivityPolicies.id, policy.id));
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
      id: ActivityPolicies.id,
      activity_id: ActivityPolicies.activity_id,
      policy_id: ActivityPolicies.policy_id,
      order: ActivityPolicies.order,
      policy: {
        id: Policies.id,
        kind: Policies.kind,
        label: Policies.label,
      },
    })
    .from(ActivityPolicies)
    .innerJoin(Policies, eq(ActivityPolicies.policy_id, Policies.id))
    .where(
      and(eq(ActivityPolicies.activity_id, activityId), eq(Policies.kind, kind))
    )
    .orderBy(ActivityPolicies.order);
};

export const getPackagesByActivityId = async (activityId: string) => {
  if (!db) return [];
  
  return await db.query.ActivityPackages.findMany({
    where: and(
      eq(ActivityPackages.activity_id, Number(activityId)),
      eq(ActivityPackages.active, true)
    ),
  });
};
