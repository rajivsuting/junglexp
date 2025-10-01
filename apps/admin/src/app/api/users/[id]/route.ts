import { NextRequest, NextResponse } from 'next/server';

import { auth } from '@repo/auth';
import { db, eq, Users } from '@repo/db/client';

// GET /api/users/[id] - Get user by ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Check authentication
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = params;

    // Users can only access their own data unless they're admin
    if (
      session.user.id !== id &&
      session.user.userRole !== "admin" &&
      session.user.userRole !== "super_admin"
    ) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Get user by ID
    const [user] = await db
      .select({
        id: Users.id,
        name: Users.name,
        email: Users.email,
        firstName: Users.firstName,
        lastName: Users.lastName,
        phone: Users.phone,
        userRole: Users.userRole,
        isActive: Users.isActive,
        emailVerified: Users.emailVerified,
        image: Users.image,
        createdAt: Users.createdAt,
        updatedAt: Users.updatedAt,
      })
      .from(Users)
      .where(eq(Users.id, id))
      .limit(1);

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ user });
  } catch (error) {
    console.error("Error fetching user:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// PUT /api/users/[id] - Update user
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Check authentication
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = params;
    const body = await request.json();

    // Users can only update their own data unless they're admin
    if (
      session.user.id !== id &&
      session.user.userRole !== "admin" &&
      session.user.userRole !== "super_admin"
    ) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Check if user exists
    const [existingUser] = await db
      .select()
      .from(Users)
      .where(eq(Users.id, id))
      .limit(1);

    if (!existingUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Prepare update data
    const updateData: any = {};

    if (body.name) updateData.name = body.name;
    if (body.firstName) updateData.firstName = body.firstName;
    if (body.lastName) updateData.lastName = body.lastName;
    if (body.phone) updateData.phone = body.phone;
    if (body.image) updateData.image = body.image;

    // Only admins can change role and active status
    if (
      session.user.userRole === "admin" ||
      session.user.userRole === "super_admin"
    ) {
      if (body.userRole) updateData.userRole = body.userRole;
      if (typeof body.isActive === "boolean")
        updateData.isActive = body.isActive;
    }

    // Update user
    const [updatedUser] = await db
      .update(Users)
      .set({
        ...updateData,
        updatedAt: new Date(),
      })
      .where(eq(Users.id, id))
      .returning({
        id: Users.id,
        name: Users.name,
        email: Users.email,
        firstName: Users.firstName,
        lastName: Users.lastName,
        phone: Users.phone,
        userRole: Users.userRole,
        isActive: Users.isActive,
        emailVerified: Users.emailVerified,
        image: Users.image,
        createdAt: Users.createdAt,
        updatedAt: Users.updatedAt,
      });

    return NextResponse.json({
      message: "User updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Error updating user:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// DELETE /api/users/[id] - Delete user (admin only)
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Check authentication
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Only admins can delete users
    if (
      session.user.userRole !== "admin" &&
      session.user.userRole !== "super_admin"
    ) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { id } = params;

    // Prevent self-deletion
    if (session.user.id === id) {
      return NextResponse.json(
        { error: "Cannot delete your own account" },
        { status: 400 }
      );
    }

    // Check if user exists
    const [existingUser] = await db
      .select()
      .from(Users)
      .where(eq(Users.id, id))
      .limit(1);

    if (!existingUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Delete user using better-auth (this will handle cleanup of related records)
    await auth.api.deleteUser({
      body: { userId: id },
    });

    return NextResponse.json({
      message: "User deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting user:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
