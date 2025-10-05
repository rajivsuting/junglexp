import { NextResponse } from 'next/server';

// Ensure this API route is not statically analyzed during build
export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET() {
  try {
    // Dynamic import to prevent build-time execution
    const { getCurrentUserRole } = await import("@/lib/auth");
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
