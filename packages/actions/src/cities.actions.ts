"use server";

import { eq } from "drizzle-orm";

import { db } from "@repo/db";

import { Cities } from "../../db/schema/city";

export async function getCitiesByStateId(stateId: string) {
  return db.query.Cities.findMany({
    where: eq(Cities.state_id, Number(stateId)),
  });
}

export async function getCities() {
  return db.query.Cities.findMany();
}
