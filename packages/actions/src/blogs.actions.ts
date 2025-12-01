"use server";

import { db, eq, desc, sql, and, ne } from "@repo/db";
import { Blogs, createBlogSchema } from "@repo/db/schema/blogs";
import { generateSlug } from "@repo/db/utils/slug-generator";
import { z } from "zod";

export async function getBlogs({
  page,
  limit,
  search = "",
}: {
  page?: number;
  limit?: number;
  search?: string;
}) {
  if (!db) throw new Error("Database connection not available");

  const offset = limit ? (page - 1) * limit : undefined;

  const conditions = search
    ? sql`lower(${Blogs.title}) LIKE ${`%${search.toLowerCase()}%`}`
    : undefined;

  const data = await db.query.Blogs.findMany({
    where: conditions,
    limit,
    offset,
    orderBy: [desc(Blogs.created_at)],
    with: {
      thumbnail: true,
      category: true,
    },
  });

  const totalResult = await db
    .select({ count: sql<number>`count(*)` })
    .from(Blogs)
    .where(conditions);
  const total = Number(totalResult[0]?.count || 0);

  return {
    data,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  };
}

export async function getRelatedBlogs({
  categoryId,
  excludeBlogId,
  limit = 3,
}: {
  categoryId: number;
  excludeBlogId?: number;
  limit?: number;
}) {
  if (!db) throw new Error("Database connection not available");

  const conditions = and(
    eq(Blogs.category_id, categoryId),
    excludeBlogId ? ne(Blogs.id, excludeBlogId) : undefined
  );

  const data = await db.query.Blogs.findMany({
    where: conditions,
    limit,
    orderBy: [desc(Blogs.created_at)],
    with: {
      thumbnail: true,
      category: true,
    },
  });

  return data;
}

export async function getBlogBySlug(slug: string) {
  if (!db) throw new Error("Database connection not available");

  const blog = await db.query.Blogs.findFirst({
    where: eq(Blogs.slug, slug),
    with: {
      thumbnail: true,
      category: true,
    },
  });

  return blog;
}

export async function getBlogById(id: number) {
  if (!db) throw new Error("Database connection not available");

  const blog = await db.query.Blogs.findFirst({
    where: eq(Blogs.id, id),
    with: {
      thumbnail: true,
      category: true,
    },
  });

  return blog;
}

export async function createBlog(data: z.infer<typeof createBlogSchema>) {
  if (!db) throw new Error("Database connection not available");

  const validated = createBlogSchema.parse(data);

  let slug = generateSlug(validated.title);

  // Check for slug uniqueness
  let counter = 0;
  let uniqueSlug = slug;
  while (true) {
    const existing = await db.query.Blogs.findFirst({
      where: eq(Blogs.slug, uniqueSlug),
    });
    if (!existing) break;
    counter++;
    uniqueSlug = `${slug}-${counter}`;
  }

  const [newBlog] = await db
    .insert(Blogs)
    .values({
      title: validated.title,
      category_id: validated.category_id,
      content: validated.content,
      thumbnail_image_id: validated.thumbnail_image_id,
      slug: uniqueSlug,
    })
    .returning();

  return newBlog;
}

export async function updateBlog(
  id: number,
  data: Partial<z.infer<typeof createBlogSchema>>
) {
  if (!db) throw new Error("Database connection not available");

  const [updated] = await db
    .update(Blogs)
    .set({
      ...data,
      updated_at: new Date(),
    })
    .where(eq(Blogs.id, id))
    .returning();

  return updated;
}

export async function deleteBlog(id: number) {
  if (!db) throw new Error("Database connection not available");

  await db.delete(Blogs).where(eq(Blogs.id, id));
  return true;
}

export async function getAllBlogsSlugs() {
  return db.select({ slug: Blogs.slug }).from(Blogs);
}
