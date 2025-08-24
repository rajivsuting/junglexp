// import {
//     boolean, integer, jsonb, pgTable, serial, text, timestamp, varchar
// } from 'drizzle-orm/pg-core';

// import { Images } from './image';
// import { NationalParks } from './park';

// export const Tours = pgTable("tours", {
//   id: serial("id").primaryKey(),
//   title: text("title").notNull(),
//   slug: text("slug").notNull().unique().notNull(),
//   description: text("description").notNull(),
//   park_id: integer("park_id")
//     .references(() => NationalParks.id)
//     .notNull(),
//   pricing_id: integer("pricing_id")
//     .references(() => TourPricing.id)
//     .notNull(),

//   created_at: timestamp("created_at", { precision: 0 }).notNull().defaultNow(),
//   updated_at: timestamp("updated_at", { precision: 0 })
//     .notNull()
//     .defaultNow()
//     .$onUpdate(() => new Date()),
// });

// export const TourPricing = pgTable("tour_pricing", {
//   id: serial("id").primaryKey(),
//   tour_id: integer("tour_id").notNull(),
//   adult_price: integer("adult_price").notNull(),
//   child_price: integer("child_price"),
//   infant_price: integer("infant_price"),
//   currency: varchar("currency", { length: 6 }).notNull().default("INR"),
//   tax_included: boolean("tax_included").notNull().default(false),

//   created_at: timestamp("created_at", { precision: 0 }).notNull().defaultNow(),
//   updated_at: timestamp("updated_at", { precision: 0 })
//     .notNull()
//     .defaultNow()
//     .$onUpdate(() => new Date()),
// });

// export const TourImages = pgTable("tour_images", {
//   tour_id: integer("tour_id")
//     .references(() => Tours.id)
//     .notNull(),
//   image_id: integer("image_id")
//     .references(() => Images.id)
//     .notNull(),
// });

// export const HotelAmenities = pgTable("hotel_amenities_s", {
//   id: serial("id").primaryKey(),
//   a,
//   amenity_id: integer("amenity_id"),
// });

// // export const TourHotels = pgTable("tour_hotels", {
// //   id: serial("id").primaryKey(),
// //   tour_id: integer("tour_id")
// //     .references(() => Tours.id)
// //     .notNull(),
// //   hotel_name: text("hotel_name").notNull(),
// //   hotel_type: text("hotel_type").notNull(),

// //   hotel_address: text("hotel_address").notNull(),

// //   created_at: timestamp("created_at", { precision: 0 }).notNull().defaultNow(),
// // });

// /**
// --------------------------------------- Typescrip Definations ---------------------------------------
// */

// export type TTourBase = typeof Tours.$inferSelect;
// export type TNewTourBase = typeof Tours.$inferInsert;

// export type TTourImageBase = typeof TourImages.$inferSelect;
// export type TNewTourImageBase = typeof TourImages.$inferInsert;

// export type TTourPricingBase = typeof TourPricing.$inferSelect;
// export type TNewTourPricingBase = typeof TourPricing.$inferInsert;

// export type TTourHotelBase = typeof TourHotels.$inferSelect;
// export type TNewTourHotelBase = typeof TourHotels.$inferInsert;
