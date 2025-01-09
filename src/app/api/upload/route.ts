import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { s3Client, BUCKET_NAME, generateUniqueFileName, validateFile } from "@/lib/aws";

// POST /api/upload - Handle file upload
export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Parse the multipart form data
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    // const folder = (formData.get("folder") as string) || "uploads"

    const category = formData.get("category") as "image" | "pdf" | "audio";
    const contentType = formData.get("contentType") as string;

    if (!file || !category || !contentType) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Validate file
    const validation = validateFile(
      contentType,
      file.size,
      category
    );

    if (!validation.isValid) {
      return NextResponse.json(
        { error: validation.error },
        { status: 400 }
      );
    }

    // Generate unique filename
    const fileName = generateUniqueFileName(file.name);
    const key = `${category}s/${fileName}`;

    // Upload to S3
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const command = new PutObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key,
      Body: buffer,
      ContentType: contentType,
    });

    await s3Client.send(command);

    // Return the public URL
    const fileUrl = `https://${BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;

    return NextResponse.json({ fileUrl });
  } catch (error) {
    console.error("[UPLOAD_POST]", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
