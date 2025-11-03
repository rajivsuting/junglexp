import { pgTable, serial, text } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";

export const Faqs = pgTable("faqs", {
  id: serial("id").primaryKey(),
  question: text("question").notNull(),
  answer: text("answer").notNull(),
});

/**
 * --------------------------------------- Validation Schemas ---------------------------------------
 */
export const insertFaqsSchema = createInsertSchema(Faqs);

/**
 * --------------------------------------- Type Definitions ---------------------------------------
 */
export type TFaqBase = typeof Faqs.$inferSelect;
export type TNewFaq = typeof Faqs.$inferInsert;
export type TInsertFaq = typeof insertFaqsSchema;

