import {
  boolean,
  index,
  integer,
  pgTable,
  serial,
  text,
  timestamp,
} from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";

import { Cities } from "./city";
import { Images } from "./image";

export const NationalParks = pgTable(
  "national_parks",
  {
    id: serial("id").primaryKey(),

    city_id: integer("city_id")
      .references(() => Cities.id)
      .notNull(),
    name: text("name").notNull(),
    slug: text("slug").unique().notNull(),

    description: text("description").notNull(),

    created_at: timestamp("created_at", { precision: 0 }).defaultNow(),
    updated_at: timestamp("updated_at", { precision: 0 })
      .defaultNow()
      .$onUpdate(() => new Date()),
  },
  (table) => [
    index("national_parks_slug_idx").on(table.slug),
    index("national_parks_name_idx").on(table.name),
  ]
);

export const ParkImages = pgTable("park_images", {
  id: serial("id").primaryKey(),
  park_id: integer("park_id")
    .references(() => NationalParks.id, { onDelete: "cascade" })
    .notNull(),
  image_id: integer("image_id")
    .references(() => Images.id)
    .notNull(),
  order: integer("order").notNull(),
  is_mobile: boolean("is_mobile").notNull().default(false),
});

/**
--------------------------------------- Valiation Schemas ---------------------------------------
*/
export const nationaParkInsertSchema = createInsertSchema(NationalParks, {
  name: (schema) => schema.name.min(1, "Destination name is required").max(255),
});

export const nationaParkSelectSchema = createSelectSchema(NationalParks);

export const parkImagesInsertSchema = createInsertSchema(ParkImages);
/** 
--------------------------------------- Type Definations ---------------------------------------
*/
export type TNationalParkBase = typeof NationalParks.$inferSelect;
export type TNewNationalPark = typeof NationalParks.$inferInsert;

export type TNationalParkInsert = typeof nationaParkInsertSchema;

export type TParkImageBase = typeof ParkImages.$inferSelect;
