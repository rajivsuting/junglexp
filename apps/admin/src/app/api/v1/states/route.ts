import { NextResponse } from "next/server";

import { getStates } from "@repo/actions/states.actions";

export async function GET() {
  const states = await getStates();
  return NextResponse.json(states);
}
