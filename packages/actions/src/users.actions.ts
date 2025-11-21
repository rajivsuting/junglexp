"use server";

import { and, count, eq, ilike } from 'drizzle-orm';

import { clerkClient, currentUser } from '@clerk/nextjs/server';
import { db, schema } from '@repo/db';
import { userRoles } from '@repo/db/schema/user';

import type { TUser } from "@repo/db";
export type TGetUsersFilters = {
  search?: string;
  page?: number;
  limit?: number;
  role?: (typeof userRoles.enumValues)[number];
};

// Role check helper
async function requireSuperAdmin() {
  const user = await currentUser();

  const userRole = user?.publicMetadata.role;
  if (userRole !== userRoles.enumValues[2]) {
    // 2 = Super Admin
    throw new Error("Access denied. Super admin role required.");
  }
}

// Check if user can modify target user
async function canModifyUser(targetUserId: string) {
  const currentUserData = await currentUser();
  if (!currentUserData) {
    throw new Error("Not authenticated");
  }

  // Get target user from database
  const targetUser = await db
    .select({ user_role: schema.Users.user_role })
    .from(schema.Users)
    .where(eq(schema.Users.user_id, targetUserId))
    .limit(1);

  if (!targetUser[0]) {
    throw new Error("Target user not found");
  }

  const currentUserRole = currentUserData.publicMetadata.role as string;
  const targetUserRole = targetUser[0].user_role;
  const isSameUser = currentUserData.id === targetUserId;

  // Cannot modify yourself
  if (isSameUser) {
    throw new Error("Cannot modify your own account");
  }

  // Non-super-admin cannot modify super-admin users
  if (targetUserRole === "super_admin" && currentUserRole !== "super_admin") {
    throw new Error("Cannot modify super admin users");
  }

  return true;
}

export const getUsers = async (filters: TGetUsersFilters = {}) => {
  await requireSuperAdmin();

  const { search, page = 1, limit = 10, role } = filters;

  let where = undefined;

  // Build where conditions
  const conditions = [];

  if (search) {
    conditions.push(
      ilike(schema.Users.first_name, `%${search}%`),
      ilike(schema.Users.last_name, `%${search}%`),
      ilike(schema.Users.email, `%${search}%`)
    );
  }

  if (role !== undefined) {
    conditions.push(eq(schema.Users.user_role, role));
  }

  if (conditions.length > 0) {
    where = search
      ? and(
          role !== undefined ? eq(schema.Users.user_role, role) : undefined,
          // OR condition for search across name and email
          ...conditions.slice(0, search ? 3 : undefined)
        )
      : and(...conditions);
  }

  const totalResponse = await db
    .select({ count: count() })
    .from(schema.Users)
    .where(where);

  const users = await db
    .select()
    .from(schema.Users)
    .where(where)
    .limit(limit)
    .offset((page - 1) * limit)
    .orderBy(schema.Users.created_at);

  // Convert BigInt id to number for easier frontend handling
  const usersWithNumberId = users.map((user) => ({
    ...user,
    id: Number(user.id),
  }));

  return {
    users: usersWithNumberId as unknown as TUser[],
    total: totalResponse[0]?.count ?? 0,
  };
};

export const getUserById = async (id: string) => {
  await requireSuperAdmin();

  const user = await db
    .select()
    .from(schema.Users)
    .where(eq(schema.Users.user_id, id))
    .limit(1);

  // Convert BigInt id to number for easier frontend handling
  const userResult = user[0];
  if (userResult) {
    return {
      ...userResult,
      id: Number(userResult.id),
    };
  }

  return null;
};

export const createUser = async (data: {
  email: string;
  firstName: string;
  lastName: string;
  role?: (typeof userRoles.enumValues)[number];
}) => {
  await requireSuperAdmin();

  try {
    // Create user in Clerk
    const client = await clerkClient();
    const clerkUser = await client.users.createUser({
      emailAddress: [data.email],
      firstName: data.firstName,
      lastName: data.lastName,
      publicMetadata: {
        role: data.role || "user",
      },
      // Send invitation email
      skipPasswordRequirement: true,
      skipPasswordChecks: true,
    });

    // The webhook will handle creating the user in our database
    // But we can also create it here to ensure consistency
    const dbUser = await db
      .insert(schema.Users)
      .values({
        user_id: clerkUser.id,
        email: data.email,
        first_name: data.firstName,
        last_name: data.lastName,
        user_role: data.role || "user",
      })
      .returning();

    return {
      success: true,
      user: {
        ...dbUser[0],
        id: Number(dbUser[0]!.id),
      },
    };
  } catch (error) {
    console.error("Error creating user:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to create user",
    };
  }
};

export const updateUser = async (
  userId: string,
  data: {
    firstName?: string;
    lastName?: string;
    role?: (typeof userRoles.enumValues)[number];
  }
) => {
  await requireSuperAdmin();
  await canModifyUser(userId);

  try {
    // Update user in Clerk
    const updateData: any = {};
    if (data.firstName) updateData.firstName = data.firstName;
    if (data.lastName) updateData.lastName = data.lastName;

    if (data.role !== undefined) {
      updateData.publicMetadata = {
        role: data.role,
      };
    }

    const client = await clerkClient();
    const clerkUser = await client.users.updateUser(userId, updateData);

    // Update user in our database
    const dbUpdateData: any = {};
    if (data.firstName) dbUpdateData.first_name = data.firstName;
    if (data.lastName) dbUpdateData.last_name = data.lastName;
    if (data.role !== undefined) dbUpdateData.role = data.role;

    const dbUser = await db
      .update(schema.Users)
      .set(dbUpdateData)
      .where(eq(schema.Users.user_id, userId))
      .returning();

    return {
      success: true,
    };
  } catch (error) {
    console.error("Error updating user:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to update user",
    };
  }
};

export const deleteUser = async (userId: string) => {
  await requireSuperAdmin();
  await canModifyUser(userId);

  try {
    const client = await clerkClient();
    // Delete user from Clerk
    await client.users.deleteUser(userId);

    // Delete user from our database (webhook should handle this too)
    await db!.delete(schema.Users).where(eq(schema.Users.user_id, userId));

    return {
      success: true,
    };
  } catch (error) {
    console.error("Error deleting user:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to delete user",
    };
  }
};
