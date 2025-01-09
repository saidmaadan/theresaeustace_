import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { resend } from "@/lib/resend";
import NewsletterEmail from "@/emails/newsletter";

export async function POST(req: Request) {
  try {
    const session = await auth();

    if (!session || session.user.role !== "ADMIN") {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { subject, previewText, content, sendToInactive } = await req.json();

    // Get all active subscribers (and optionally inactive ones)
    const subscribers = await prisma.newsletter.findMany({
      where: sendToInactive ? undefined : { isActive: true },
      select: { email: true },
    });

    if (subscribers.length === 0) {
      return new NextResponse(
        JSON.stringify({ error: "No subscribers found" }),
        { status: 404 }
      );
    }

    // Send emails in batches of 100 to avoid rate limits
    const batchSize = 100;
    const batches = Math.ceil(subscribers.length / batchSize);

    for (let i = 0; i < batches; i++) {
      const start = i * batchSize;
      const end = start + batchSize;
      const batch = subscribers.slice(start, end);

      // Send emails in parallel within each batch
      await Promise.all(
        batch.map((subscriber) =>
          resend.emails.send({
            from: "Theresa Eustace <newsletter@book.theresaeustace.com>",
            to: subscriber.email,
            subject,
            react: NewsletterEmail({
              previewText,
              content,
            }),
          })
        )
      );
    }

    return NextResponse.json({ count: subscribers.length });
  } catch (error) {
    console.error("[NEWSLETTER_SEND]", error);
    return new NextResponse(
      JSON.stringify({
        error: "Failed to send newsletter",
      }),
      { status: 500 }
    );
  }
}
