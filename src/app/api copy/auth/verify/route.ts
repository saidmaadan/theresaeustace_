import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  try {
    console.log("Starting email verification process...");
    const { searchParams } = new URL(req.url);
    const token = searchParams.get("token");

    if (!token) {
      console.error("No token provided");
      return NextResponse.json(
        { error: "Missing verification token" },
        { status: 400 }
      );
    }

    console.log("Looking up verification token...");
    const verificationToken = await prisma.verificationToken.findUnique({
      where: { token },
      include: { user: true }
    });

    if (!verificationToken) {
      console.error("Token not found:", token);
      return NextResponse.json(
        { error: "Invalid verification token" },
        { status: 400 }
      );
    }

    if (new Date() > verificationToken.expires) {
      console.error("Token expired:", token);
      await prisma.verificationToken.delete({
        where: { id: verificationToken.id }
      });
      return NextResponse.json(
        { error: "Verification token has expired" },
        { status: 400 }
      );
    }

    console.log("Updating user verification status...");
    await prisma.user.update({
      where: { id: verificationToken.user.id },
      data: { emailVerified: new Date() }
    });

    console.log("Deleting used verification token...");
    await prisma.verificationToken.delete({
      where: { id: verificationToken.id }
    });

    console.log("Email verification successful");
    
    // Redirect to login page with success message
    const loginUrl = new URL("/login", process.env.NEXT_PUBLIC_APP_URL);
    loginUrl.searchParams.set("verified", "true");
    
    return NextResponse.redirect(loginUrl);
  } catch (error) {
    console.error("Verification error:", error);
    return NextResponse.json(
      { error: "Failed to verify email" },
      { status: 500 }
    );
  }
}
