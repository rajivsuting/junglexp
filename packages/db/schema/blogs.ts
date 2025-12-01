import {
  pgTable,
  serial,
  text,
  timestamp,
  integer,
  index,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { Images } from "./image";

export const Blogs = pgTable(
  "blogs",
  {
    id: serial("id").primaryKey(),
    title: text("title").notNull(),
    slug: text("slug").notNull().unique(),
    content: text("content").notNull(), // Rich text HTML
    thumbnail_image_id: integer("thumbnail_image_id")
      .references(() => Images.id)
      .notNull(),
    created_at: timestamp("created_at").defaultNow().notNull(),
    updated_at: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => [
    index("blogs_slug_idx").on(table.slug),
    index("blogs_title_idx").on(table.title),
  ]
);

export const insertBlogSchema = createInsertSchema(Blogs);
export const createBlogSchema = z.object({
  title: z.string().min(1, "Title is required"),
  content: z.string().min(1, "Content is required"),
  thumbnail_image_id: z.number().int().positive("Thumbnail is required"),
});

export type TNewBlog = typeof Blogs.$inferInsert;
export type TBlog = typeof Blogs.$inferSelect;
