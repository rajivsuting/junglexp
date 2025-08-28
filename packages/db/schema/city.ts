import {
  index,
  integer,
  pgTable,
  serial,
  text,
  timestamp,
} from "drizzle-orm/pg-core";

import { States } from "./state";

export const Cities = pgTable(
  "cities",
  {
    id: serial("id").primaryKey(),
    state_id: integer("state_id").references(() => States.id),
    name: text("name").notNull(),
    latitude: text("latitude"),
    longitude: text("longitude"),
    created_at: timestamp("created_at", { precision: 0 }).defaultNow(),
    updated_at: timestamp("updated_at", { precision: 0 })
      .defaultNow()
      .$onUpdate(() => new Date()),
  },
  (table) => [index("cities_state_id_idx").on(table.state_id)]
);

// typescript
export type TCity = typeof Cities.$inferSelect;
export type TNewCity = typeof Cities.$inferInsert;
