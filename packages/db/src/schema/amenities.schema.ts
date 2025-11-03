import { pgTable, serial, text } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";

/**
 * Amenities table - Reusable amenities for rooms and facilities
 */
export const Amenities = pgTable("amenities", {
  id: serial("id").primaryKey(),
  label: text("label").notNull(),
  icon: text("icon").notNull(),
});

/**
 * --------------------------------------- Validation Schemas ---------------------------------------
 */
export const insertAmenitiesSchema = createInsertSchema(Amenities);

/**
 * --------------------------------------- Type Definitions ---------------------------------------
 */
export type TAmenityBase = typeof Amenities.$inferSelect;
export type TNewAmenity = typeof Amenities.$inferInsert;
export type TInsertAmenity = typeof insertAmenitiesSchema;

