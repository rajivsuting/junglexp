import {
  doublePrecision,
  geometry,
  index,
  integer,
  pgTable,
  serial,
  text,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";

import { Images } from "./image";

export const Places = pgTable(
  "places",
  {
    id: serial("id").primaryKey(),
    name: text("name").notNull(),
    description: text("description").notNull(),
    slug: text("slug").notNull().unique(),
    location: geometry("location", {
      type: "point",
      mode: "xy",
      srid: 4326,
    }).notNull(),
  },
  (table) => [
    index("places_location_idx").on(table.location),
    index("places_name_idx").on(table.name),
    index("places_slug_idx").on(table.slug),
  ]
);

export const PlaceImages = pgTable("place_images", {
  id: serial("id").primaryKey(),
  place_id: integer("place_id").references(() => Places.id, {
    onDelete: "cascade",
  }),
  image_id: integer("image_id").references(() => Images.id, {
    onDelete: "cascade",
  }),
  order: integer("order").notNull().default(0),
});

/**
--------------------------------------- Validation Schemas ---------------------------------------
*/
export const placesInsertSchema = createInsertSchema(Places, {
  name: (schema) => schema.name.min(1, "Place name is required").max(255),
  description: (schema) =>
    schema.description.min(1, "Place description is required"),
  slug: (schema) => schema.slug.min(1, "Place slug is required").max(255),
});

export const placeImagesInsertSchema = createInsertSchema(PlaceImages);

/**
--------------------------------------- Types ---------------------------------------
*/
export type TNewPlace = typeof Places.$inferInsert;
export type TPlaceBase = typeof Places.$inferSelect;

export type TNewPlaceImage = typeof PlaceImages.$inferInsert;
export type TPlaceImageBase = typeof PlaceImages.$inferSelect;
