import { NextResponse } from 'next/server';

import type { TCity } from "@repo/db/schema/city";

export const runtime = "nodejs";

export async function GET(request: Request) {
  const { getCitiesByStateId, getCities } = await import(
    "@repo/actions/cities.actions"
  );
  const { searchParams } = new URL(request.url);

  const stateId = searchParams.get("state");

  let cities: TCity[] = [];
  if (stateId) {
    cities = await getCitiesByStateId(stateId);
  } else {
    cities = await getCities();
  }

  return NextResponse.json(cities);
}
