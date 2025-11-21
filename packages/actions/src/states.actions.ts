"use server";
import { db } from '@repo/db';

export async function getStates() {
  return db!.query.States.findMany();
}
