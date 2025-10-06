"use server";
import { db } from '@repo/db/index';
import { Faqs, insertFaqsSchema } from '@repo/db/schema/faqs';

import type { TNewFaqs } from "@repo/db/schema/faqs";

export const getAllFaqs = async () => {
  if (!db) return [];
  
  return await db.query.Faqs.findMany();
};

export const createFaq = async (data: TNewFaqs) => {
  if (!db) throw new Error("Database connection not available");
  
  const parsed = insertFaqsSchema.parse(data);
  const [result] = await db.insert(Faqs).values(parsed).returning();

  if (!result) {
    throw new Error("Failed to create FAQ");
  }

  return result;
};

export const createFaqs = async (data: TNewFaqs[]) => {
  if (!db) throw new Error("Database connection not available");
  
  if (data.length === 0) return [];

  const parsedFaqs = data.map((faq) => insertFaqsSchema.parse(faq));

  const results = await db.insert(Faqs).values(parsedFaqs).returning();

  if (!results || results.length === 0) {
    throw new Error("Failed to create FAQs");
  }

  return results;
};
