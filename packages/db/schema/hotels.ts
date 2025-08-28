import { sql } from "drizzle-orm";
import {
  doublePrecision,
  geometry,
  index,
  integer,
  pgEnum,
  pgTable,
  serial,
  text,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";

import { Faqs } from "./faqs";
import { Images } from "./image";
import { Policies } from "./policies";
import { SaftyFeatures } from "./safty-features";
import { Zones } from "./zones";

// Define a Postgres enum named "park_status" with allowed values
export const hotelTypeEnum = pgEnum("hotel_type", ["resort", "forest", "home"]);

export const Hotels = pgTable(
  "hotels",
  {
    id: serial("id").primaryKey(),
    name: text("name").notNull(),
    description: text("description").notNull(),
    slug: text("slug").notNull(),

    zone_id: integer("zone_id").references(() => Zones.id, {
      onDelete: "cascade",
    }),
    hotel_type: hotelTypeEnum("hotel_type").notNull(),
    rating: integer("rating").default(0),
    location: geometry("location", {
      type: "point",
      mode: "xy",
      srid: 4326,
    }).notNull(),
  },
  (table) => [
    index("hotels_location_idx").on(table.location),
    index("hotels_name_idx").on(table.name),
    index("hotels_slug_idx").on(table.slug),
    index("hotels_zone_id_idx").on(table.zone_id),
    index("hotels_hotel_type_idx").on(table.hotel_type),
    index("hotels_rating_idx").on(table.rating),
    index("hotels_hotel_type_rating_idx").on(table.hotel_type, table.rating),
    index("hotels_hotel_type_zone_id_idx").on(table.hotel_type, table.zone_id),
  ]
);

export const HotelImages = pgTable("hotel_images", {
  id: serial("id").primaryKey(),
  hotel_id: integer("hotel_id").references(() => Hotels.id, {
    onDelete: "cascade",
  }),
  image_id: integer("image_id").references(() => Images.id, {
    onDelete: "cascade",
  }),
  order: integer("order").notNull().default(0),
});

export const HotelPolicies = pgTable("hotel_policies", {
  id: serial("id").primaryKey(),
  policy_id: integer("policy_id").references(() => Policies.id, {
    onDelete: "cascade",
  }),
  hotel_id: integer("hotel_id").references(() => Hotels.id, {
    onDelete: "cascade",
  }),
  order: integer("order").notNull().default(0),
});

export const HotelSaftyFeatures = pgTable("hotel_safty_features", {
  id: serial("id").primaryKey(),
  safty_feature_id: integer("safty_feature_id").references(
    () => SaftyFeatures.id,
    {
      onDelete: "cascade",
    }
  ),
  hotel_id: integer("hotel_id").references(() => Hotels.id, {
    onDelete: "cascade",
  }),
  order: integer("order").notNull(),
});

export const HotelFaqs = pgTable("hotel_faqs", {
  id: serial("id").primaryKey(),
  faq_id: integer("faq_id").references(() => Faqs.id, {
    onDelete: "cascade",
  }),
  hotel_id: integer("hotel_id").references(() => Hotels.id, {
    onDelete: "cascade",
  }),
  order: integer("order").notNull(),
});

/**
--------------------------------------- validations ---------------------------------------
*/
export const insertHotelSchema = createInsertSchema(Hotels);
export const insertHotelImagesSchema = createInsertSchema(HotelImages);

/**
--------------------------------------- Types ---------------------------------------
*/

export type TNewHotel = typeof Hotels.$inferInsert;
export type THotelBase = typeof Hotels.$inferSelect;

export type TInsertHotel = typeof insertHotelSchema;

export type TInsertHotelImage = typeof insertHotelImagesSchema;
export type TNewHotelImage = typeof HotelImages.$inferInsert;
export type THotelImageBase = typeof HotelImages.$inferSelect;

export type THotelPolicyBase = typeof HotelPolicies.$inferSelect;
export type TNewHotelPolicy = typeof HotelPolicies.$inferInsert;

export type THotelSaftyFeatureBase = typeof HotelSaftyFeatures.$inferSelect;
export type TNewHotelSaftyFeature = typeof HotelSaftyFeatures.$inferInsert;

export type THotelType = (typeof hotelTypeEnum.enumValues)[number];

export type THotelFaqBase = typeof HotelFaqs.$inferSelect;
export type TNewHotelFaq = typeof HotelFaqs.$inferInsert;
