import {
  S3Client,
  // PutObjectCommand,
  // DeleteObjectCommand,
  // GetObjectCommand,
} from "@aws-sdk/client-s3";
import crypto from "crypto";

// Initialize S3 client
export const s3Client = new S3Client({
  region: process.env.AWS_REGION!,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

export const BUCKET_NAME = process.env.AWS_BUCKET_NAME!;

// Allowed file types
const ALLOWED_FILE_TYPES = {
  image: ["image/jpeg", "image/png", "image/webp", "image/jpg"],
  pdf: ["application/pdf"],
  audio: ["audio/mpeg", "audio/wav", "audio/mp3", "audio/mpeg3"],
};

// Maximum file sizes (in bytes)
const MAX_FILE_SIZES = {
  image: 5 * 1024 * 1024, // 5MB
  pdf: 50 * 1024 * 1024, // 50MB
  audio: 100 * 1024 * 1024, // 100MB
};

// Generate a unique filename
export function generateUniqueFileName(originalName: string): string {
  const timestamp = Date.now();
  const randomString = crypto.randomBytes(16).toString("hex");
  const extension = originalName.split(".").pop();
  return `${timestamp}-${randomString}.${extension}`;
}

// Validate file type and size
export function validateFile(
  fileType: string,
  fileSize: number,
  category: "image" | "pdf" | "audio"
): { isValid: boolean; error?: string } {
  if (!ALLOWED_FILE_TYPES[category].includes(fileType)) {
    return {
      isValid: false,
      error: `Invalid file type. Allowed types: ${ALLOWED_FILE_TYPES[
        category
      ].join(", ")}`,
    };
  }

  if (fileSize > MAX_FILE_SIZES[category]) {
    return {
      isValid: false,
      error: `File too large. Maximum size: ${MAX_FILE_SIZES[category] / (1024 * 1024)}MB`,
    };
  }

  return { isValid: true };
}

export const generatePresignedDownloadUrl = () => {
  // Your implementation here
};

// Get the public URL of a file
export function getPublicUrl(key: string): string {
  return `https://${BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;
}
