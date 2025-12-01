import { pgTable, serial, text, timestamp, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const Configurations = pgTable("configurations", {
  id: serial("id").primaryKey(),
  key: text("key").unique().notNull(),
  value: text("value").notNull(),
  description: text("description"),
  created_at: timestamp("created_at").defaultNow().notNull(),
  updated_at: timestamp("updated_at").defaultNow().notNull(),
});

export const insertConfigurationSchema = createInsertSchema(Configurations);
export const createConfigurationSchema = z.object({
  key: z.string().min(1, "Key is required"),
  value: z.string().min(1, "Value is required"),
  description: z.string().optional(),
});

export type TConfiguration = typeof Configurations.$inferSelect;
export type TNewConfiguration = typeof Configurations.$inferInsert;

