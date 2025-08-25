import { pgTable, serial, text } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";

export const Faqs = pgTable(
  "faqs",
  {
    id: serial("id").primaryKey(),

    question: text("question").notNull(),
    answer: text("answer").notNull(),
  },
  (t) => []
);

/**
--------------------------------------- Validations ---------------------------------------
*/
export const insertFaqsSchema = createInsertSchema(Faqs);

/**
--------------------------------------- Types ---------------------------------------
*/

export type TNewFaqs = typeof Faqs.$inferInsert;
export type TFaqsBase = typeof Faqs.$inferSelect;

export type TInsertFaqs = typeof insertFaqsSchema;
