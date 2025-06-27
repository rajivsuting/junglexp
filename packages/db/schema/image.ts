import { pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";

export const Images = pgTable("images", {
  id: serial("id").primaryKey(),
  small_url: text("small_url").notNull(),
  medium_url: text("medium_url").notNull(),
  large_url: text("large_url").notNull(),
  original_url: text("original_url").notNull(),
  created_at: timestamp("created_at", { precision: 0 }).defaultNow(),
  updated_at: timestamp("updated_at", { precision: 0 })
    .defaultNow()
    .$onUpdate(() => new Date()),
});

/**
--------------------------------------- Typescript Definations ---------------------------------------
*/
export type TImage = typeof Images.$inferSelect;
export type TNewImage = typeof Images.$inferInsert;
