import { NextResponse } from "next/server";

import { getNationalParks } from "@repo/actions/parks.actions";

export async function GET() {
  const nationalParks = await getNationalParks();
  return NextResponse.json(nationalParks);
}
