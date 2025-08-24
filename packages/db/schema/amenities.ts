import { integer, pgTable, serial, text } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";

import { Hotels } from "./hotels";

export const Amenities = pgTable("amenities", {
  id: serial("id").primaryKey(),
  label: text("label").notNull(),
  icon: text("icon").notNull(),
  order: integer("order").notNull(),
});

/**
--------------------------------------- Validations ---------------------------------------
*/
export const insertAmenitiesSchema = createInsertSchema(Amenities);

/**
--------------------------------------- Types ---------------------------------------
*/
export type TNewAmenity = typeof Amenities.$inferInsert;
export type TAmenityBase = typeof Amenities.$inferSelect;

export type TInsertAmenity = typeof insertAmenitiesSchema;
