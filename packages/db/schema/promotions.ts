import { boolean, integer, pgTable, serial, text, timestamp } from 'drizzle-orm/pg-core';
import { createInsertSchema } from 'drizzle-zod';

export const Promotions = pgTable("promotions", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  link: text("link").notNull(),
  order: integer("order"),
  isActive: boolean("is_active").default(true),

  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const promotionInsertSchema = createInsertSchema(Promotions);

export type TPromotionBase = typeof Promotions.$inferSelect;
export type TNewPromotion = typeof Promotions.$inferInsert;

export type TPromosionInsert = typeof promotionInsertSchema;
