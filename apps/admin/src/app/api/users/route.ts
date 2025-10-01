import { NextRequest, NextResponse } from 'next/server';

import { auth } from '@repo/auth';
import { and, db, eq, like, or, Users } from '@repo/db/client';

// GET /api/users - List users with pagination and search
export async function GET(request: NextRequest) {
  try {
    // Check authentication and admin permissions
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if user is admin
    if (
      session.user.userRole !== "admin" &&
      session.user.userRole !== "super_admin"
    ) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const search = searchParams.get("search") || "";
    const role = searchParams.get("role") || "";
    const status = searchParams.get("status") || "";

    const offset = (page - 1) * limit;

    // Build where conditions
    const conditions = [];

    if (search) {
      conditions.push(
        or(
          like(Users.name, `%${search}%`),
          like(Users.email, `%${search}%`),
          like(Users.firstName, `%${search}%`),
          like(Users.lastName, `%${search}%`)
        )
      );
    }

    if (role) {
      conditions.push(eq(Users.userRole, role as any));
    }

    if (status === "active") {
      conditions.push(eq(Users.isActive, true));
    } else if (status === "inactive") {
      conditions.push(eq(Users.isActive, false));
    }

    // Get users with pagination
    const users = await db
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
      .where(conditions.length > 0 ? and(...conditions) : undefined)
      .limit(limit)
      .offset(offset)
      .orderBy(Users.createdAt);

    // Get total count
    const [{ count }] = await db
      .select({ count: Users.id })
      .from(Users)
      .where(conditions.length > 0 ? and(...conditions) : undefined);

    return NextResponse.json({
      users,
      pagination: {
        page,
        limit,
        total: count,
        totalPages: Math.ceil(count / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST /api/users - Create a new user (admin only)
export async function POST(request: NextRequest) {
  try {
    // Check authentication and admin permissions
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if user is admin
    if (
      session.user.userRole !== "admin" &&
      session.user.userRole !== "super_admin"
    ) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await request.json();
    const { email, name, firstName, lastName, phone, userRole, password } =
      body;

    // Validate required fields
    if (!email || !name || !password) {
      return NextResponse.json(
        { error: "Email, name, and password are required" },
        { status: 400 }
      );
    }

    // Create user using better-auth
    const result = await auth.api.signUpEmail({
      body: {
        email,
        password,
        name,
        firstName,
        lastName,
        phone,
        userRole: userRole || "user",
      },
    });

    if (!result) {
      return NextResponse.json(
        { error: "Failed to create user" },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { message: "User created successfully", user: result },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating user:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
