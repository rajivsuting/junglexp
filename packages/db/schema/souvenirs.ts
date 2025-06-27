import { sql } from "drizzle-orm";
import {
  boolean,
  index,
  integer,
  pgTable,
  serial,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";

import { Images } from "./image";
import { NationalParks } from "./park";

/**
--------------------------------------- Souvenirs Table ---------------------------------------
*/
export const Souvenirs = pgTable(
  "souvenirs",
  {
    id: serial("id").primaryKey(),
    name: varchar("name", { length: 255 }).unique().notNull(),
    slug: text("slug").notNull().unique(),
    description: text("description").notNull(),
    price: integer("price").notNull(),
    park_id: integer("park_id").references(() => NationalParks.id),
    is_available: boolean("is_available").notNull().default(false),
    created_at: timestamp("created_at", { precision: 0 }).defaultNow(),
    updated_at: timestamp("updated_at", { precision: 0 })
      .defaultNow()
      .$onUpdate(() => new Date()),
  },
  (table) => [
    index("souvenirs_name_idx").on(table.name),
    index("souvenirs_id_idx").on(table.park_id),
    index("souvenirs_slug_idx").on(table.slug),
    index("souvenirs_is_available_idx").on(table.is_available),
    index("souvenirs_name_availability_idx").on(table.name, table.is_available),
  ]
);

export const SouvenirImages = pgTable("souvenir_images", {
  souvenir_id: integer("souvenir_id")
    .references(() => Souvenirs.id)
    .notNull(),
  image_id: integer("image_id")
    .references(() => Images.id)
    .notNull(),
});

/**
--------------------------------------- Valiation Schemas  ---------------------------------------
*/
export const souvenirInsertSchema = createInsertSchema(Souvenirs);
export const souvenirSelectSchema = createSelectSchema(Souvenirs);

/**
--------------------------------------- Typescript Definations  ---------------------------------------
*/
export type TNewSouvenirBase = typeof Souvenirs.$inferInsert;
export type TSouvenirBase = typeof Souvenirs.$inferSelect;
export type TSouvenirImageBase = typeof SouvenirImages.$inferSelect;
