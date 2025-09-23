import { index, integer, pgTable, serial, text } from 'drizzle-orm/pg-core';
import { createInsertSchema } from 'drizzle-zod';

import { Images } from './image';
import { NationalParks } from './park';

export const Naturalist = pgTable(
  "naturalist",
  {
    id: serial("id").primaryKey(),
    name: text("name").notNull(),
    image_id: integer("image_id").references(() => Images.id),
    description: text("description").notNull(),
    park_id: integer("park_id").references(() => NationalParks.id),
  },
  (table) => [
    index("naturalist_park_id_index").on(table.park_id),
    index("naturalist_name_index").on(table.name),
    index("naturalist_park_id_name_index").on(table.park_id, table.name),
  ]
);

export const insertNaturalistSchema = createInsertSchema(Naturalist);

export type TNaturalistBase = typeof Naturalist.$inferSelect;
export type TNewNaturalist = typeof Naturalist.$inferInsert;
