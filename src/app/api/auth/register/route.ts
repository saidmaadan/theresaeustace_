import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { RegisterSchema } from "@/schemas";
import { Resend } from "resend";
import crypto from "crypto";

if (!process.env.RESEND_API_KEY) {
  console.error("RESEND_API_KEY is not configured!");
}

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  try {
    console.log("Starting registration process...");
    
    const contentType = request.headers.get("content-type");
    if (!contentType || !contentType.includes("application/json")) {
      console.error("Invalid content type:", contentType);
      return NextResponse.json(
        { error: "Content-Type must be application/json" },
        { status: 415 }
      );
    }

    const body = await request.json();
    console.log("Received registration data:", { ...body, password: "[REDACTED]" });
    
    const validatedFields = RegisterSchema.safeParse(body);

    if (!validatedFields.success) {
      console.error("Validation failed:", validatedFields.error);
      return NextResponse.json(
        {
          error: "Invalid fields",
          details: validatedFields.error.errors
        },
        { status: 400 }
      );
    }

    const { email, password, name } = validatedFields.data;
    console.log("Validated fields successfully");

    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      console.log("User already exists:", email);
      return NextResponse.json(
        { error: "Email already in use" },
        { status: 400 }
      );
    }

    console.log("Generating verification token...");
    const verificationToken = crypto.randomBytes(32).toString("hex");
    const hashedPassword = await bcrypt.hash(password, 10);

    console.log("Creating user in database...");
    let user;
    try {
      user = await prisma.user.create({
        data: {
          name,
          email,
          password: hashedPassword,
          verificationToken: {
            create: {
              token: verificationToken,
              expires: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
            }
          }
        }
      });

      console.log("User created successfully:", user.id);
    } catch (dbError) {
      console.error("Database error:", dbError);
      return NextResponse.json(
        { error: "Failed to create user account" },
        { status: 500 }
      );
    }

    const verificationUrl = `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/verify?token=${verificationToken}`;
    console.log("Verification URL generated:", verificationUrl);

    if (!process.env.RESEND_API_KEY) {
      console.error("RESEND_API_KEY is missing");
      await prisma.user.delete({ where: { id: user.id } });
      return NextResponse.json(
        { error: "Email service not configured" },
        { status: 500 }
      );
    }

    console.log("Sending verification email...");
    try {
      const emailResult = await resend.emails.send({
        from: "noreply@book.theresaeustace.com",
        to: email,
        subject: "Verify your email",
        html: `
          <h1>Welcome to our platform!</h1>
          <p>Please verify your email address by clicking the link below:</p>
          <a href="${verificationUrl}">Verify Email</a>
          <p>This link will expire in 24 hours.</p>
        `
      });

      console.log("Email sent successfully:", emailResult);

      // Resend returns { id } when successfully 
      if (emailResult.error) {
        throw new Error(emailResult.error.message || "Failed to send email");
      }

      return NextResponse.json(
        {
          success: true,
          message: "Verification email sent"
        },
        { status: 201 }
      );
    } catch (emailError) {
      console.error("Email service error:", emailError);
      
      // Delete the user since we couldn't send the verification email
      try {
        await prisma.user.delete({ where: { id: user.id } });
        console.log("Rolled back user creation due to email failure");
      } catch (rollbackError) {
        console.error("Failed to rollback user creation:", rollbackError);
      }

      return NextResponse.json(
        { error: "Failed to send verification email" },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Registration error:", error);
    
    return NextResponse.json(
      { error: error.message || "Registration failed" },
      { status: 500 }
    );
  }
}
