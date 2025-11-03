import {
  index,
  integer,
  pgEnum,
  pgTable,
  serial,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";

import { Images } from "./images.schema";
import { Users } from "./auth.schema";

export const blogStatusEnum = pgEnum("blog_status", [
  "draft",
  "published",
  "archived",
]);

export const blogCategoryEnum = pgEnum("blog_category", [
  "travel",
  "wildlife",
  "luxury",
  "adventure",
  "wellness",
  "culinary",
  "events",
  "offers",
  "general",
]);

export const Blogs = pgTable(
  "blogs",
  {
    id: serial("id").primaryKey(),
    
    title: text("title").notNull(),
    slug: text("slug").notNull().unique(),
    excerpt: text("excerpt").notNull(),
    content: text("content").notNull(),
    
    author_id: text("author_id").references(() => Users.id, {
      onDelete: "set null",
    }),
    author_name: varchar("author_name", { length: 255 }),
    
    featured_image_id: integer("featured_image_id").references(
      () => Images.id,
      { onDelete: "set null" }
    ),
    
    category: blogCategoryEnum("category").notNull().default("general"),
    tags: text("tags"),
    
    meta_title: text("meta_title"),
    meta_description: text("meta_description"),
    meta_keywords: text("meta_keywords"),
    
    status: blogStatusEnum("status").notNull().default("draft"),
    published_at: timestamp("published_at"),
    
    view_count: integer("view_count").notNull().default(0),
    is_featured: integer("is_featured").notNull().default(0),
    
    created_at: timestamp("created_at", { precision: 0 }).defaultNow(),
    updated_at: timestamp("updated_at", { precision: 0 })
      .defaultNow()
      .$onUpdate(() => new Date()),
  },
  (table) => [
    index("blogs_slug_idx").on(table.slug),
    index("blogs_author_id_idx").on(table.author_id),
    index("blogs_category_idx").on(table.category),
    index("blogs_status_idx").on(table.status),
    index("blogs_published_at_idx").on(table.published_at),
    index("blogs_is_featured_idx").on(table.is_featured),
    index("blogs_status_published_idx").on(table.status, table.published_at),
  ]
);

export const BlogImages = pgTable("blog_images", {
  id: serial("id").primaryKey(),
  blog_id: integer("blog_id")
    .references(() => Blogs.id, { onDelete: "cascade" })
    .notNull(),
  image_id: integer("image_id")
    .references(() => Images.id, { onDelete: "cascade" })
    .notNull(),
  order: integer("order").notNull().default(0),
  caption: text("caption"),
});

/**
 * --------------------------------------- Validation Schemas ---------------------------------------
 */
export const insertBlogSchema = createInsertSchema(Blogs, {
  title: (schema) => schema.title.min(1, "Title is required").max(500),
  slug: (schema) =>
    schema.slug.min(1, "Slug is required").regex(/^[a-z0-9-]+$/, {
      message: "Slug must contain only lowercase letters, numbers, and hyphens",
    }),
  excerpt: (schema) =>
    schema.excerpt.min(1, "Excerpt is required").max(500),
  content: (schema) => schema.content.min(1, "Content is required"),
});

export const selectBlogSchema = createSelectSchema(Blogs);

/**
 * --------------------------------------- Type Definitions ---------------------------------------
 */
export type TBlogBase = typeof Blogs.$inferSelect;
export type TNewBlog = typeof Blogs.$inferInsert;
export type TBlogStatus = (typeof blogStatusEnum.enumValues)[number];
export type TBlogCategory = (typeof blogCategoryEnum.enumValues)[number];

export type TBlogImageBase = typeof BlogImages.$inferSelect;
export type TNewBlogImage = typeof BlogImages.$inferInsert;

