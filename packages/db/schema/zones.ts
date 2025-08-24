import { integer, pgTable, serial, text } from 'drizzle-orm/pg-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';

import { NationalParks } from './park';

export const Zones = pgTable("zones", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  park_id: integer("park_id").references(() => NationalParks.id),
});

/**
--------------------------------------- Valiation Schemas ---------------------------------------
*/
export const zonesInsertSchema = createInsertSchema(Zones, {
  name: (schema) => schema.name.min(1, "Zone name is required").max(255),
  description: (schema) =>
    schema.description.min(1, "Zone description is required"),
});

export const zonesSelectSchema = createSelectSchema(Zones);

/** 
  --------------------------------------- Type Definations ---------------------------------------
  */
export type TZoneBase = typeof Zones.$inferSelect;
export type TNewZone = typeof Zones.$inferInsert;

export type TZonekInsert = typeof zonesInsertSchema;
