import {
  index,
  integer,
  numeric,
  pgEnum,
  pgTable,
  serial,
  text,
  timestamp,
} from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";

import { Amenities } from "./amenities.schema";
import { Faqs } from "./faqs.schema";
import { Images } from "./images.schema";
import { Policies } from "./policies.schema";
import { Resort } from "./resort.schema";

export const roomTypeStatusEnum = pgEnum("room_type_status", [
  "active",
  "inactive",
]);

export const bedTypeEnum = pgEnum("bed_type", [
  "single",
  "double",
  "queen",
  "king",
  "twin",
]);

export const RoomTypes = pgTable(
  "room_types",
  {
    id: serial("id").primaryKey(),
    resort_id: integer("resort_id")
      .references(() => Resort.id, { onDelete: "cascade" })
      .notNull(),

    name: text("name").notNull(),
    slug: text("slug").notNull().unique(),
    description: text("description").notNull(),

    size_sqft: integer("size_sqft").notNull(),
    max_occupancy: integer("max_occupancy").notNull().default(2),
    bed_type: bedTypeEnum("bed_type").notNull(),
    number_of_beds: integer("number_of_beds").notNull().default(1),

    base_price: numeric("base_price", { precision: 10, scale: 2 })
      .notNull()
      .default("0"),
    weekend_price: numeric("weekend_price", { precision: 10, scale: 2 }),
    peak_season_price: numeric("peak_season_price", {
      precision: 10,
      scale: 2,
    }),

    status: roomTypeStatusEnum("status").default("active"),
    is_featured: integer("is_featured").notNull().default(0),
    order: integer("order").notNull().default(0),

    created_at: timestamp("created_at", { precision: 0 }).defaultNow(),
    updated_at: timestamp("updated_at", { precision: 0 })
      .defaultNow()
      .$onUpdate(() => new Date()),
  },
  (table) => [
    index("room_types_slug_idx").on(table.slug),
    index("room_types_resort_id_idx").on(table.resort_id),
    index("room_types_status_idx").on(table.status),
    index("room_types_is_featured_idx").on(table.is_featured),
  ]
);

export const RoomTypeImages = pgTable("room_type_images", {
  id: serial("id").primaryKey(),
  room_type_id: integer("room_type_id")
    .references(() => RoomTypes.id, { onDelete: "cascade" })
    .notNull(),
  image_id: integer("image_id")
    .references(() => Images.id, { onDelete: "cascade" })
    .notNull(),
  order: integer("order").notNull().default(0),
});

export const RoomTypeAmenities = pgTable("room_type_amenities", {
  id: serial("id").primaryKey(),
  room_type_id: integer("room_type_id")
    .references(() => RoomTypes.id, { onDelete: "cascade" })
    .notNull(),
  amenity_id: integer("amenity_id")
    .references(() => Amenities.id, { onDelete: "cascade" })
    .notNull(),
  order: integer("order").notNull().default(0),
});

export const RoomTypePolicies = pgTable("room_type_policies", {
  id: serial("id").primaryKey(),
  room_type_id: integer("room_type_id")
    .references(() => RoomTypes.id, { onDelete: "cascade" })
    .notNull(),
  policy_id: integer("policy_id")
    .references(() => Policies.id, { onDelete: "cascade" })
    .notNull(),
  order: integer("order").notNull().default(0),
});

export const RoomTypeFaqs = pgTable("room_type_faqs", {
  id: serial("id").primaryKey(),
  room_type_id: integer("room_type_id")
    .references(() => RoomTypes.id, { onDelete: "cascade" })
    .notNull(),
  faq_id: integer("faq_id")
    .references(() => Faqs.id, { onDelete: "cascade" })
    .notNull(),
  order: integer("order").notNull().default(0),
});

/**
 * --------------------------------------- Validation Schemas ---------------------------------------
 */
export const insertRoomTypeSchema = createInsertSchema(RoomTypes, {
  name: (schema) => schema.name.min(1, "Room type name is required").max(255),
  max_occupancy: (schema) =>
    schema.max_occupancy.min(1, "Maximum occupancy must be at least 1"),
  size_sqft: (schema) =>
    schema.size_sqft.min(1, "Room size must be at least 1 sq ft"),
});

export const selectRoomTypeSchema = createSelectSchema(RoomTypes);

/**
 * --------------------------------------- Type Definitions ---------------------------------------
 */
export type TRoomTypeBase = typeof RoomTypes.$inferSelect;
export type TNewRoomType = typeof RoomTypes.$inferInsert;
export type TRoomTypeStatus = (typeof roomTypeStatusEnum.enumValues)[number];
export type TBedType = (typeof bedTypeEnum.enumValues)[number];

export type TRoomTypeImageBase = typeof RoomTypeImages.$inferSelect;
export type TNewRoomTypeImage = typeof RoomTypeImages.$inferInsert;

export type TRoomTypeAmenityBase = typeof RoomTypeAmenities.$inferSelect;
export type TNewRoomTypeAmenity = typeof RoomTypeAmenities.$inferInsert;

export type TRoomTypePolicyBase = typeof RoomTypePolicies.$inferSelect;
export type TNewRoomTypePolicy = typeof RoomTypePolicies.$inferInsert;

export type TRoomTypeFaqBase = typeof RoomTypeFaqs.$inferSelect;
export type TNewRoomTypeFaq = typeof RoomTypeFaqs.$inferInsert;

export const BED_TYPE_DESCRIPTIONS = {
  single: "Single bed (90cm x 190cm)",
  double: "Double bed (135cm x 190cm)",
  queen: "Queen bed (150cm x 200cm)",
  king: "King bed (180cm x 200cm)",
  twin: "Two single beds",
} as const;

