import { NextResponse } from "next/server";
import { Resend } from "resend";
import { v4 as uuidv4 } from "uuid";
import { prisma } from "@/lib/prisma";
import { ResetSchema } from "@/schemas";

const resend = new Resend(process.env.RESEND_API_KEY);

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const validatedFields = ResetSchema.safeParse(body);

    if (!validatedFields.success) {
      return NextResponse.json(
        { error: "Invalid email!" },
        { status: 400 }
      );
    }

    const { email } = validatedFields.data;

    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (!existingUser) {
      return NextResponse.json(
        { error: "Email not found!" },
        { status: 400 }
      );
    }

    const token = uuidv4();
    const expires = new Date(new Date().getTime() + 3600 * 1000); // 1 hour

    await prisma.passwordResetToken.create({
      data: {
        email,
        token,
        expires
      }
    });

    await resend.emails.send({
      from: "password-reset@book.theresaeustace.com",
      to: email,
      subject: "Reset your password",
      html: `Click <a href="${process.env.NEXT_PUBLIC_APP_URL}/new-password?token=${token}">here</a> to reset your password.`
    });

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Something went wrong!" },
      { status: 500 }
    );
  }
}
