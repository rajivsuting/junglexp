// import { pgTable, serial, text, timestamp } from 'drizzle-orm/pg-core';

// export const ParkZones = pgTable("park_zones", {
//   id: serial("id").primaryKey(),
//   name: text("name").unique().notNull(),
//   image_url: text("image_url").notNull(),

//   created_at: timestamp("created_at", { precision: 0 }).defaultNow(),
//   updated_at: timestamp("updated_at", { precision: 0 })
//     .defaultNow()
//     .$onUpdate(() => new Date()),
// });
