import { NextResponse } from 'next/server';

import { getCurrentUserRole } from '@/lib/auth';

export async function GET() {
  try {
    const role = await getCurrentUserRole();

    return NextResponse.json({ role });
  } catch (error) {
    console.error("Error getting user role:", error);
    return NextResponse.json(
      { error: "Failed to get user role" },
      { status: 500 }
    );
  }
}
