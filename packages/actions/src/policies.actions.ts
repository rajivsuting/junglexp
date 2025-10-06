"use server";
import { eq } from "drizzle-orm";

import { db } from "@repo/db";
import { insertPoliciesSchema, Policies } from "@repo/db/schema/policies";

import type { TNewPolicy } from "@repo/db/schema/policies";

export const getAllPolicies = async () => {
  return await db!.query.Policies.findMany();
};

export const getPoliciesByKind = async (kind: "include" | "exclude") => {
  return await db!.query.Policies.findMany({
    where: eq(Policies.kind, kind),
  });
};

export const createPolicy = async (data: TNewPolicy) => {
  const parsed = insertPoliciesSchema.parse(data);
  const [result] = await db!.insert(Policies).values(parsed).returning();

  if (!result) {
    throw new Error("Failed to create policy");
  }

  return result;
};

export const createPolicies = async (data: TNewPolicy[]) => {
  if (data.length === 0) return [];

  const parsedPolicies = data.map((policy, index) =>
    insertPoliciesSchema.parse({
      ...policy,
      order: Date.now() + index, // Simple ordering based on creation time
    })
  );

  const results = await db!.insert(Policies).values(parsedPolicies).returning();

  if (!results || results.length === 0) {
    throw new Error("Failed to create policies");
  }

  return results;
};
