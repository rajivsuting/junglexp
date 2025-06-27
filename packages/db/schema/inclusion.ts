import {
  boolean,
  integer,
  pgTable,
  serial,
  text,
  timestamp,
} from "drizzle-orm/pg-core";

import { Tours } from "./tour";

export const Inclusions = pgTable("inclusions", {
  id: serial("id").primaryKey(),
  tour_id: integer("tour_id")
    .references(() => Tours.id)
    .notNull(),
  is_included: boolean("is_included").notNull().default(false),
  name: text("name").notNull(),
  created_at: timestamp("created_at", { precision: 0 }).defaultNow(),
});

/**
--------------------------------------- Typescript Definations ---------------------------------------
*/
export const TInclusionBase = typeof Inclusions.$inferSelect;
export const TNewInclusionBase = typeof Inclusions.$inferInsert;
