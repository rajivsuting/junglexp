import { pgTable, serial, text, timestamp } from 'drizzle-orm/pg-core';

export const States = pgTable("states", {
  id: serial("id").primaryKey(),
  name: text("name").unique().notNull(),
  state_code: text("state_code").unique().notNull(),
  created_at: timestamp("created_at", { precision: 0 }).defaultNow(),
  updated_at: timestamp("updated_at", { precision: 0 })
    .defaultNow()
    .$onUpdate(() => new Date()),
});

export type TState = typeof States.$inferSelect;
export type TNewState = typeof States.$inferInsert;
