import { eq } from "drizzle-orm";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { Webhook } from "svix";

import type { TNewUser } from "@repo/db";
import type { UserJSON, WebhookEvent } from "@clerk/nextjs/server";

export const runtime = "nodejs";

async function validateRequest(request: Request, secret: string) {
  const payloadString = await request.text();
  const headerPayload = await headers();

  const svixHeaders = {
    "svix-id": headerPayload.get("svix-id")!,
    "svix-timestamp": headerPayload.get("svix-timestamp")!,
    "svix-signature": headerPayload.get("svix-signature")!,
  };

  const wh = new Webhook(secret);

  try {
    return wh.verify(payloadString, svixHeaders) as WebhookEvent;
  } catch (e) {
    console.error("incoming webhook failed verification");
    return;
  }
}

export async function POST(req: Request): Promise<NextResponse> {
  if (!process.env.CLERK_WEBHOOK_SECRET) {
    throw new Error("CLERK_WEBHOOK_SECRET environment variable is missing");
  }

  const payload = await validateRequest(req, process.env.CLERK_WEBHOOK_SECRET);

  if (!payload) {
    return NextResponse.json(
      { error: "webhook verification failed or payload was malformed" },
      { status: 400 }
    );
  }

  const { type, data } = payload;

  console.log("payload", payload);

  if (type === "user.created") {
    return createUser(data);
  }

  if (type === "user.updated") {
    return updateUser(data);
  }

  if (type === "user.deleted") {
    return deleteUser(data.id);
  }

  return NextResponse.json(
    {
      error: `uncreognised payload type: ${type}`,
    },
    {
      status: 400,
    }
  );
}

async function createUser(data: UserJSON) {
  const { db, schema } = await import("@repo/db");
  // Extract role from public metadata, default to 0 (regular user)
  const role = (data.public_metadata as any)?.role ?? "user";

  await db.insert(schema.Users).values({
    user_id: data.id,
    email: data.email_addresses[0]!.email_address,
    first_name: data.first_name ?? "",
    last_name: data.last_name ?? "",
    user_role: role as "user" | "admin" | "super_admin",
  });

  return NextResponse.json(
    {
      message: "user created",
    },
    { status: 200 }
  );
}

async function updateUser(data: UserJSON) {
  const { db, schema } = await import("@repo/db");
  // Extract role from public metadata
  const role = (data.public_metadata as any)?.role;

  const updateData: Partial<TNewUser> = {
    first_name: data.first_name ?? "",
    last_name: data.last_name ?? "",
  };

  // Only update role if it's provided in metadata
  if (role !== undefined) {
    updateData.user_role = role;
  }

  console.log("updateData", updateData);

  try {
    const updated = await db
      .update(schema.Users)
      .set(updateData)
      .where(eq(schema.Users.user_id, data.id))
      .returning();

    console.log("updated", updated);
  } catch (error) {
    console.error("Error updating user:", error);
  }

  return NextResponse.json(
    {
      message: "user updated",
    },
    { status: 200 }
  );
}

async function deleteUser(id?: string) {
  const { db, schema } = await import("@repo/db");
  if (id) {
    await db.delete(schema.Users).where(eq(schema.Users.user_id, id));

    return NextResponse.json(
      {
        message: "user deleted",
      },
      { status: 200 }
    );
  } else {
    return NextResponse.json(
      {
        message: "ok",
      },
      { status: 200 }
    );
  }
}
