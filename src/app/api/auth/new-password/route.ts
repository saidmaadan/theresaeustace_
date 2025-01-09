import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { NewPasswordSchema } from "@/schemas";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    console.log("Received body:", { ...body, password: "[REDACTED]" });

    const validatedFields = NewPasswordSchema.safeParse(body);

    if (!validatedFields.success) {
      console.error("Validation error:", validatedFields.error);
      return NextResponse.json(
        { error: "Invalid password!" },
        { status: 400 }
      );
    }

    const { password, token } = validatedFields.data;

    if (!token) {
      console.error("Missing token in request");
      return NextResponse.json(
        { error: "Missing token!" },
        { status: 400 }
      );
    }

    const existingToken = await prisma.passwordResetToken.findUnique({
      where: { token }
    });

    if (!existingToken) {
      console.error("Token not found:", token);
      return NextResponse.json(
        { error: "Invalid token!" },
        { status: 400 }
      );
    }

    if (new Date() > new Date(existingToken.expires)) {
      console.error("Token expired:", token);
      await prisma.passwordResetToken.delete({
        where: { id: existingToken.id }
      });
      return NextResponse.json(
        { error: "Token has expired!" },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { email: existingToken.email }
    });

    if (!user) {
      console.error("User not found for token:", token);
      return NextResponse.json(
        { error: "User not found!" },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await prisma.user.update({
      where: { id: user.id },
      data: { password: hashedPassword }
    });

    await prisma.passwordResetToken.delete({
      where: { id: existingToken.id }
    });

    return NextResponse.json(
      { success: true, message: "Password updated successfully!" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Password reset error:", error);
    return NextResponse.json(
      { error: "Something went wrong!" },
      { status: 500 }
    );
  }
}
