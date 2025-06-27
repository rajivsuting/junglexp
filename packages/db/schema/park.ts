import {
  index,
  integer,
  pgTable,
  serial,
  text,
  timestamp,
} from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";

import { Cities } from "./city";

export const NationalParks = pgTable(
  "national_parks",
  {
    id: serial("id").primaryKey(),
    uid: text("uid").notNull().default("gen_random_uuid()"),

    city_id: integer("city_id")
      .references(() => Cities.id)
      .notNull(),
    name: text("name").notNull(),
    slug: text("slug").unique().notNull(),

    image: text("image").notNull(),

    created_at: timestamp("created_at", { precision: 0 }).defaultNow(),
    updated_at: timestamp("updated_at", { precision: 0 })
      .defaultNow()
      .$onUpdate(() => new Date()),
  },
  (table) => [
    index("slug_idx").on(table.slug),
    index("name_idx").on(table.name),
  ]
);

/**
--------------------------------------- Valiation Schemas ---------------------------------------
*/
export const nationaParkInsertSchema = createInsertSchema(NationalParks, {
  name: (schema) => schema.name.min(1, "Destination name is required").max(255),
});

export const nationaParkSelectSchema = createSelectSchema(NationalParks);

/** 
--------------------------------------- Type Definations ---------------------------------------
*/
export type TNationalPark = typeof NationalParks.$inferSelect;
export type TNewNationalPark = typeof NationalParks.$inferInsert;

export type TNationalParkInsert = typeof nationaParkInsertSchema;
