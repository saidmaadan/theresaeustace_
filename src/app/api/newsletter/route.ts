import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

// POST /api/newsletter - Subscribe to newsletter
export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();

    // Check if email already exists
    const existingSubscriber = await prisma.newsletter.findUnique({
      where: { email },
    });

    if (existingSubscriber) {
      if (existingSubscriber.isActive) {
        return NextResponse.json(
          { error: "Email already subscribed" },
          { status: 400 }
        );
      } else {
        // Reactivate subscription
        await prisma.newsletter.update({
          where: { email },
          data: { isActive: true },
        });
        
        return NextResponse.json({
          message: "Newsletter subscription reactivated",
        });
      }
    }

    // Create new subscription
    await prisma.newsletter.create({
      data: { email },
    });

    // Send welcome email
    await resend.emails.send({
      from: "Sophia Bent <newsletter@book.theresaeustace.com>",
      to: email,
      subject: "Welcome to Theresa Eustace's Newsletter!",
      html: `
        <h1>Welcome to My Newsletter!</h1>
        <p>Thank you for subscribing to my newsletter. You'll receive updates about:</p>
        <ul>
          <li>New book releases</li>
          <li>Blog posts</li>
          <li>Special offers</li>
          <li>Writing tips and insights</li>
        </ul>
        <p>Stay tuned for exciting updates!</p>
        <p>Best regards,<br>Sophia Bent</p>
      `,
    });

    return NextResponse.json({
      message: "Successfully subscribed to newsletter",
    });
  } catch (error) {
    console.error("[NEWSLETTER_POST]", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

// DELETE /api/newsletter - Unsubscribe from newsletter
export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const email = searchParams.get("email");

    if (!email) {
      return NextResponse.json(
        { error: "Email is required" },
        { status: 400 }
      );
    }

    const subscriber = await prisma.newsletter.findUnique({
      where: { email },
    });

    if (!subscriber || !subscriber.isActive) {
      return NextResponse.json(
        { error: "Email not found in subscription list" },
        { status: 404 }
      );
    }

    // Soft delete by setting isActive to false
    await prisma.newsletter.update({
      where: { email },
      data: { isActive: false },
    });

    return NextResponse.json({
      message: "Successfully unsubscribed from newsletter",
    });
  } catch (error) {
    console.error("[NEWSLETTER_DELETE]", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
