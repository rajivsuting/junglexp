import { integer, pgTable, serial } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";

import { Amenities } from "./amenities";
import { Hotels } from "./hotels";

export const HotelAmenities = pgTable("hotel_amenities", {
  id: serial("id").primaryKey(),
  hotel_id: integer("hotel_id").references(() => Hotels.id),
  amenity_id: integer("amenity_id").references(() => Amenities.id),
  order: integer("order").notNull(),
});

/**
--------------------------------------- Validations ---------------------------------------
*/
export const insertHotelAmenitiesSchema = createInsertSchema(HotelAmenities);

/**
--------------------------------------- Types ---------------------------------------
*/
export type TNewHotelAmenities = typeof HotelAmenities.$inferInsert;
export type THotelAmenitiesBase = typeof HotelAmenities.$inferSelect;

export type TInsertHotelAmenities = typeof insertHotelAmenitiesSchema;
