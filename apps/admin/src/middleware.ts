import { NextResponse } from "next/server";

import {
  clerkClient,
  clerkMiddleware,
  createRouteMatcher,
} from "@clerk/nextjs/server";

const isPublicRoute = createRouteMatcher(["/sign-in"]);
const isSuperAdminRoute = createRouteMatcher(["/users", "/users(.*)"]);

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};

export default clerkMiddleware(async (auth, req) => {
  // Restrict admin routes to users with specific permissions
  const { userId, sessionClaims, sessionId } = await auth();

  if (isPublicRoute(req)) {
    if (userId) {
      return NextResponse.redirect(new URL("/", req.url));
    }
    return NextResponse.next();
  }

  if (!userId) {
    return NextResponse.redirect(new URL("/sign-in", req.url));
  }

  const role = (sessionClaims.metadata as any)?.role;

  if (!role || !["admin", "super_admin"].includes(role)) {
    const client = await clerkClient();
    await client.sessions.revokeSession(sessionId);
    return NextResponse.redirect(new URL("/sign-in", req.url));
  }

  // Additional check for super-admin routes
  if (isSuperAdminRoute(req) && role !== "super_admin") {
    return NextResponse.redirect(new URL("/", req.url));
  }

  return NextResponse.next();
});
