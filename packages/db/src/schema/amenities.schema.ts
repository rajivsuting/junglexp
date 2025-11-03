import { pgTable, serial, text } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";

export const Amenities = pgTable("amenities", {
  id: serial("id").primaryKey(),
  label: text("label").notNull(),
  icon: text("icon").notNull(),
});

export const insertAmenitiesSchema = createInsertSchema(Amenities);

export type TAmenityBase = typeof Amenities.$inferSelect;
export type TNewAmenity = typeof Amenities.$inferInsert;
export type TInsertAmenity = typeof insertAmenitiesSchema;

