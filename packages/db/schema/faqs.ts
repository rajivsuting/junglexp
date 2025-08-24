import { index, integer, pgEnum, pgTable, serial, text, uniqueIndex } from 'drizzle-orm/pg-core';
import { createInsertSchema } from 'drizzle-zod';

import { Hotels } from './hotels';
import { NationalParks } from './park';

export const faqSubjectEnum = pgEnum("faq_subject", [
  "hotel",
  "destination",
  "park",
  "site",
]);

export const Faqs = pgTable(
  "faqs",
  {
    id: serial("id").primaryKey(),

    question: text("question").notNull(),
    answer: text("answer").notNull(),

    subject: faqSubjectEnum("subject").notNull(),

    order: integer("order").notNull(),

    hotelId: integer("hotel_id").references(() => Hotels.id, {
      onDelete: "cascade",
    }),

    parkId: integer("park_id").references(() => NationalParks.id, {
      onDelete: "cascade",
    }),
  },
  (t) => [
    uniqueIndex("faqs_unique_hotel").on(t.hotelId, t.question),
    uniqueIndex("faqs_unique_park").on(t.parkId, t.question),

    index("faqs_hotel_idx").on(t.hotelId, t.order),
    index("faqs_park_idx").on(t.parkId, t.order),
  ]
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
