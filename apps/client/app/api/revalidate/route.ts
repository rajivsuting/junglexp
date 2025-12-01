import { revalidatePath } from "next/cache";
import { type NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const secret = request.headers.get("x-revalidation-secret");

  if (secret !== process.env.REVALIDATION_SECRET) {
    return NextResponse.json({ message: "Invalid secret" }, { status: 401 });
  }

  const body = await request.json();
  const path = body.path;

  if (path) {
    revalidatePath(path);
    return NextResponse.json({ revalidated: true, now: Date.now() });
  }

  return NextResponse.json(
    {
      revalidated: false,
      now: Date.now(),
      message: "Missing path to revalidate",
    },
    { status: 400 }
  );
}
