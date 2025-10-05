import { NextResponse } from 'next/server';

export const runtime = "nodejs";

export async function GET() {
  const { getNationalParks } = await import("@repo/actions/parks.actions");
  const nationalParks = await getNationalParks();
  return NextResponse.json(nationalParks);
}
