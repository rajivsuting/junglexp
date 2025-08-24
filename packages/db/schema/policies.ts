import {
  index,
  integer,
  pgEnum,
  pgTable,
  serial,
  text,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";

import { Hotels } from "./hotels";

export const kindEnum = pgEnum("policy_kind", ["include", "exclude"]);

export const Policies = pgTable(
  "policies",
  {
    id: serial("id").primaryKey(),

    kind: kindEnum("kind").notNull(),
    label: text("label").notNull(),
  },
  (t) => [
    index("hotel_policies_kind_idx").on(t.kind),
    index("hotel_policies_label_idx").on(t.label),
  ]
);

/**
--------------------------------------- Validations ---------------------------------------
*/
export const insertPoliciesSchema = createInsertSchema(Policies);

/**
--------------------------------------- Types ---------------------------------------
*/

export type TNewPolicy = typeof Policies.$inferInsert;
export type TPolicyBase = typeof Policies.$inferSelect;

export type TInsertPolicy = typeof insertPoliciesSchema;
