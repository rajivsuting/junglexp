import {
  boolean,
  doublePrecision,
  geometry,
  index,
  integer,
  pgTable,
  serial,
  text,
  timestamp,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

import { Amenities } from "./amenities";
import { Images } from "./image";
import { NationalParks } from "./park";
import { Policies } from "./policies";

export const Activities = pgTable(
  "activities",
  {
    id: serial("id").primaryKey(),
    name: text("name").notNull(),
    description: text("description").notNull(),
    slug: text("slug").notNull(),

    park_id: integer("park_id").references(() => NationalParks.id, {
      onDelete: "cascade",
    }),

    created_at: timestamp("created_at").defaultNow().notNull(),
    updated_at: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => [
    index("activities_name_idx").on(table.name),
    index("activities_slug_idx").on(table.slug),
    index("activities_park_id_idx").on(table.park_id),
  ]
);

export const ActivityImages = pgTable("activity_images", {
  id: serial("id").primaryKey(),
  activity_id: integer("activity_id").references(() => Activities.id, {
    onDelete: "cascade",
  }),
  image_id: integer("image_id").references(() => Images.id, {
    onDelete: "cascade",
  }),
  order: integer("order").notNull().default(0),
});

export const ActivityItinerary = pgTable("activity_itinerary", {
  id: serial("id").primaryKey(),
  activity_id: integer("activity_id").references(() => Activities.id, {
    onDelete: "cascade",
  }),
  title: text("title").notNull(),
  description: text("description").notNull(),
  order: integer("order").notNull().default(0),
});

export const ActivityAmenities = pgTable("activity_amenities", {
  id: serial("id").primaryKey(),
  activity_id: integer("activity_id").references(() => Activities.id, {
    onDelete: "cascade",
  }),
  amenity_id: integer("amenity_id").references(() => Amenities.id, {
    onDelete: "cascade",
  }),
  order: integer("order").notNull().default(0),
});

export const ActivityPolicies = pgTable("activity_policies", {
  id: serial("id").primaryKey(),
  activity_id: integer("activity_id").references(() => Activities.id, {
    onDelete: "cascade",
  }),
  policy_id: integer("policy_id").references(() => Policies.id, {
    onDelete: "cascade",
  }),
  order: integer("order").notNull().default(0),
});

export const ActivityPackages = pgTable("activity_packages", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  duration: doublePrecision("duration").notNull(),
  number: integer("number").notNull(),
  order: integer("order").notNull().default(0),
  active: boolean("active").notNull().default(true),
  activity_id: integer("activity_id").references(() => Activities.id, {
    onDelete: "cascade",
  }),
  price: doublePrecision("price").notNull(),
  price_1: doublePrecision("price_1").notNull(),
});

/**
--------------------------------------- Validations ---------------------------------------
*/
export const insertActivitySchema = createInsertSchema(Activities);
export const insertActivityImagesSchema = createInsertSchema(ActivityImages);

export const insertActivityItinerarySchema =
  createInsertSchema(ActivityItinerary);
export const insertActivityAmenitiesSchema =
  createInsertSchema(ActivityAmenities);
export const insertActivityPackagesSchema =
  createInsertSchema(ActivityPackages);

// Custom schema for activity package creation (excludes auto-generated fields)
export const createActivityPackageSchema = z.object({
  name: z
    .string()
    .min(1, "Package name is required")
    .max(255, "Package name must be less than 255 characters"),
  duration: z.number().int().positive("Duration must be a positive number"),
  number: z.number().int().positive("Number must be a positive number"),
  activity_id: z.number().int().positive("Activity ID is required"),
  price: z.number().positive("Price must be a positive number"),
  price_1: z.number().positive("Price 1 must be a positive number"),
  active: z.boolean().optional().default(true),
});

// Custom schema for activity creation (excludes slug as it will be auto-generated)
export const createActivitySchema = z.object({
  name: z
    .string()
    .min(1, "Activity name is required")
    .max(255, "Activity name must be less than 255 characters"),
  description: z.string().min(1, "Activity description is required"),
  park_id: z.number().int().positive().optional(),
});

/**
--------------------------------------- Types ---------------------------------------
*/

export type TNewActivity = typeof Activities.$inferInsert;
export type TActivityBase = typeof Activities.$inferSelect;

export type TInsertActivity = typeof insertActivitySchema;
export type TCreateActivity = z.infer<typeof createActivitySchema>;
export type TCreateActivityPackage = z.infer<
  typeof createActivityPackageSchema
>;

export type TInsertActivityImage = typeof insertActivityImagesSchema;
export type TNewActivityImage = typeof ActivityImages.$inferInsert;
export type TActivityImageBase = typeof ActivityImages.$inferSelect;

export type TInsertActivityItinerary = typeof insertActivityItinerarySchema;
export type TNewActivityItinerary = typeof ActivityItinerary.$inferInsert;
export type TActivityItineraryBase = typeof ActivityItinerary.$inferSelect;

export type TInsertActivityAmenity = typeof insertActivityAmenitiesSchema;
export type TNewActivityAmenity = typeof ActivityAmenities.$inferInsert;
export type TActivityAmenityBase = typeof ActivityAmenities.$inferSelect;

export type TInsertActivityPackage = typeof insertActivityPackagesSchema;
export type TNewActivityPackage = typeof ActivityPackages.$inferInsert;
export type TActivityPackageBase = typeof ActivityPackages.$inferSelect;

export type TNewActivityPolicy = typeof ActivityPolicies.$inferInsert;
export type TActivityPolicyBase = typeof ActivityPolicies.$inferSelect;
