import { eq } from 'drizzle-orm';
import { cache } from 'react';

import { currentUser } from '@clerk/nextjs/server';
import { db, schema } from '@repo/db';

export const ROLES = {
  USER: "user",
  ADMIN: "admin",
  SUPER_ADMIN: "super_admin",
} as const;

export type UserRole = (typeof ROLES)[keyof typeof ROLES];

export const ROLE_LABELS = {
  [ROLES.USER]: "User",
  [ROLES.ADMIN]: "Admin",
  [ROLES.SUPER_ADMIN]: "Super Admin",
} as const;

/**
 * Get current user from Clerk (cached)
 */
export const getCurrentUser = cache(async () => {
  return await currentUser();
});

/**
 * Get current user's role from the database
 */
export const getCurrentUserRole = cache(async (): Promise<UserRole | null> => {
  try {
    const clerkUser = await getCurrentUser();

    if (!clerkUser?.id) {
      return null;
    }

    const dbUser = await db
      .select({ role: schema.Users.user_role })
      .from(schema.Users)
      .where(eq(schema.Users.user_id, clerkUser.id))
      .limit(1);

    return dbUser[0]?.role ?? null;
  } catch (error) {
    console.error("Error getting user role:", error);
    return null;
  }
});

/**
 * Check if current user has the required role or higher
 */
export const hasRole = async (requiredRole: UserRole): Promise<boolean> => {
  const userRole = await getCurrentUserRole();
  if (userRole === null) {
    return false;
  }

  return userRole >= requiredRole;
};

/**
 * Check if current user is super admin
 */
export const isSuperAdmin = async (): Promise<boolean> => {
  return await hasRole(ROLES.SUPER_ADMIN);
};

/**
 * Check if current user is admin or higher
 */
export const isAdmin = async (): Promise<boolean> => {
  return await hasRole(ROLES.ADMIN);
};

/**
 * Require super admin role or throw error
 */
export const requireSuperAdmin = async (): Promise<void> => {
  const hasAccess = await isSuperAdmin();

  if (!hasAccess) {
    throw new Error("Access denied. Super admin role required.");
  }
};

/**
 * Require admin role or higher or throw error
 */
export const requireAdmin = async (): Promise<void> => {
  const hasAccess = await isAdmin();

  if (!hasAccess) {
    throw new Error("Access denied. Admin role required.");
  }
};
