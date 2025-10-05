import { NextResponse } from 'next/server';

export async function GET() {
  const { getStates } = await import("@repo/actions/states.actions");
  const states = await getStates();
  return NextResponse.json(states);
}
