import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { auth } from "@/auth";

export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const path = req.nextUrl.searchParams.get("path");
    if (!path) {
      return NextResponse.json(
        { error: "Path is required" },
        { status: 400 }
      );
    }

    revalidatePath(path);
    return NextResponse.json({ revalidated: true, now: Date.now() });
  } catch (error) {
    console.error("[REVALIDATE]", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
