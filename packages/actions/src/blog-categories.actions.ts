"use server";

import { db, eq, desc, sql } from "@repo/db";
import { BlogCategories, createBlogCategorySchema } from "@repo/db/schema/blog-categories";
import { generateSlug } from "@repo/db/utils/slug-generator";
import { z } from "zod";

export async function getBlogCategories() {
  if (!db) throw new Error("Database connection not available");

  const categories = await db.query.BlogCategories.findMany({
    orderBy: [desc(BlogCategories.created_at)],
  });

  return categories;
}

export async function createBlogCategory(data: z.infer<typeof createBlogCategorySchema>) {
  if (!db) throw new Error("Database connection not available");

  const validated = createBlogCategorySchema.parse(data);

  let slug = generateSlug(validated.name);

  // Check for slug uniqueness
  let counter = 0;
  let uniqueSlug = slug;
  while (true) {
    const existing = await db.query.BlogCategories.findFirst({
      where: eq(BlogCategories.slug, uniqueSlug),
    });
    if (!existing) break;
    counter++;
    uniqueSlug = `${slug}-${counter}`;
  }

  const [newCategory] = await db
    .insert(BlogCategories)
    .values({
      name: validated.name,
      slug: uniqueSlug,
    })
    .returning();

  return newCategory;
}

export async function deleteBlogCategory(id: number) {
  if (!db) throw new Error("Database connection not available");

  await db.delete(BlogCategories).where(eq(BlogCategories.id, id));
  return true;
}

