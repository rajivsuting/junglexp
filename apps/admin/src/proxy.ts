import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isPublicRoute = createRouteMatcher([
  "/sign-in(.*)",
  "/sign-up(.*)",
  "/api/webhooks/clerk",
]);

const isSuperAdminRoute = createRouteMatcher(["/users", "/users(.*)"]);

export default clerkMiddleware(async (auth, req) => {
  if (isPublicRoute(req)) {
    return; // Skip auth check for public routes
  }

  const { userId, redirectToSignIn, sessionClaims } = await auth();

  if (!userId) {
    return redirectToSignIn();
  }

  // Super admin routes require "super_admin" role
  if (isSuperAdminRoute(req)) {
    const role = (sessionClaims.metadata as any)?.role;
    const hasSuperAdminRole = role === "super_admin";

    if (!hasSuperAdminRole) {
      return redirectToSignIn({ returnBackUrl: "/unauthorized" });
    }
  }

  // Admin routes require "admin" role
  const role = (sessionClaims.metadata as any)?.role;
  const hasAdminRole = role === "admin" || role === "super_admin";

  if (!hasAdminRole) {
    return redirectToSignIn({ returnBackUrl: "/unauthorized" });
  }
});

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
