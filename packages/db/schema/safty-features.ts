import { integer, pgTable, serial, text } from 'drizzle-orm/pg-core';
import { createInsertSchema } from 'drizzle-zod';

import { Hotels } from './hotels';

export const SaftyFeatures = pgTable("safty_features", {
  id: serial("id").primaryKey(),
  label: text("label").notNull(),
  icon: text("icon").notNull(),
  order: integer("order").notNull(),
});

/**
--------------------------------------- Validations ---------------------------------------
*/
export const insertSaftyFeaturesSchema = createInsertSchema(SaftyFeatures);

/**
--------------------------------------- Types ---------------------------------------
*/
export type TNewSaftyFeature = typeof SaftyFeatures.$inferInsert;
export type TSaftyFeatureBase = typeof SaftyFeatures.$inferSelect;

export type TInsertSaftyFeature = typeof insertSaftyFeaturesSchema;
