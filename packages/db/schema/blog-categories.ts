import { pgTable, serial, text, timestamp, index } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const BlogCategories = pgTable(
  "blog_categories",
  {
    id: serial("id").primaryKey(),
    name: text("name").notNull().unique(),
    slug: text("slug").notNull().unique(),
    created_at: timestamp("created_at").defaultNow().notNull(),
    updated_at: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => [
    index("blog_categories_slug_idx").on(table.slug),
    index("blog_categories_name_idx").on(table.name),
  ]
);

export const insertBlogCategorySchema = createInsertSchema(BlogCategories);
export const createBlogCategorySchema = z.object({
  name: z.string().min(1, "Name is required"),
});

export type TNewBlogCategory = typeof BlogCategories.$inferInsert;
export type TBlogCategory = typeof BlogCategories.$inferSelect;
