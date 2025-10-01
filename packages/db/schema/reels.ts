import { index, integer, pgEnum, pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';

import { Activities } from './activities';

export const reelsStatusEnum = pgEnum("reels_status", ["active", "inactive"]);

export const Reels = pgTable(
  "reels",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    title: text("title").notNull(),
    description: text("description").notNull(),
    videoUrl: text("video_url").notNull(),
    redirectUrl: text("redirect_url").notNull(),
    status: reelsStatusEnum("status").notNull().default("active"),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
  },
  (table) => [index("reels_status_idx").on(table.status)]
);

export const createReelsSchema = createInsertSchema(Reels);
export const selectReelsSchema = createSelectSchema(Reels);

export type TReelBase = typeof Reels.$inferSelect;
export type TNewReel = typeof Reels.$inferInsert;
export type TReelStatus = (typeof reelsStatusEnum.enumValues)[number];
