import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { generatePresignedDownloadUrl } from "@/lib/aws";

// GET /api/files/[key] -- Get a presigned URL for file access
export async function GET(req: NextRequest, props: { params: Promise<{ key: string }> }) {
  const params = await props.params;
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Decode the key from URL-safe format
    const decodedKey = decodeURIComponent(params.key);

    // Generate a presigned URL that expires in 1 hour
    const url = await generatePresignedDownloadUrl(decodedKey, 3600);

    return NextResponse.json({ url });
  } catch (error) {
    console.error("[FILE_GET]", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
