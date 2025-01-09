import { Resend } from "resend"
import { ContactEmail } from "@/components/emails/contact-email"
import { NextResponse } from "next/server"

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { name, email, subject, message } = body

    const data = await resend.emails.send({
      from: "Contact Form <contact@book.theresaeustace.com>",
      to: process.env.ADMIN_EMAIL!,
      subject: `Contact Form: ${subject}`,
      react: ContactEmail({
        name,
        email,
        subject,
        message,
      }),
    })

    return NextResponse.json(data)
  } catch (error) {
    return NextResponse.json({ error: "Failed to send email" }, { status: 500 })
  }
}
