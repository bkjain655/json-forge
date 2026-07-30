// app/api/contact/route.ts
import { NextRequest, NextResponse } from "next/server"
import nodemailer from "nodemailer"
import { z } from "zod"
import { pruneRateLimitBuckets, rateLimit } from "@/lib/rate-limit"

const { EMAIL_USER, EMAIL_PASS } = process.env

/** Strip CR/LF so user input can never inject extra SMTP/MIME headers. */
const singleLine = (value: string) => value.replace(/[\r\n]+/g, " ").trim()

const contactSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(100),
  email: z.string().trim().email("A valid email is required").max(254),
  contact: z.string().trim().min(1, "Contact number is required").max(30),
  message: z.string().trim().min(1, "Message is required").max(5000),
  // Honeypot: hidden in the UI, so only bots ever fill it in.
  website: z.string().max(0).optional(),
})

function getClientIp(req: NextRequest): string {
  const forwarded = req.headers.get("x-forwarded-for")
  if (forwarded) return forwarded.split(",")[0].trim()
  return req.headers.get("x-real-ip") ?? "unknown"
}

export async function POST(req: NextRequest) {
  pruneRateLimitBuckets()

  // 5 submissions per IP per 10 minutes.
  const limit = rateLimit(`contact:${getClientIp(req)}`, 5, 10 * 60 * 1000)
  if (!limit.success) {
    return NextResponse.json(
      { success: false, message: "Too many requests. Please try again later." },
      { status: 429, headers: { "Retry-After": String(limit.retryAfter) } },
    )
  }

  let body: unknown
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ success: false, message: "Invalid request body" }, { status: 400 })
  }

  const parsed = contactSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json(
      { success: false, message: parsed.error.issues[0]?.message ?? "Invalid form data" },
      { status: 400 },
    )
  }

  const { name, email, contact, message, website } = parsed.data

  // Honeypot tripped - pretend everything is fine so bots get no signal.
  if (website) {
    return NextResponse.json({ success: true, message: "Email sent successfully" })
  }

  if (!EMAIL_USER || !EMAIL_PASS) {
    console.error("Contact form is not configured: missing EMAIL_USER/EMAIL_PASS")
    return NextResponse.json({ success: false, message: "Failed to send email" }, { status: 500 })
  }

  const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
      user: EMAIL_USER, // Your Gmail
      pass: EMAIL_PASS, // Your App Password
    },
  })

  const mailOptions = {
    // `from` must be the authenticated mailbox; the visitor's address goes in replyTo.
    from: EMAIL_USER,
    to: EMAIL_USER, // Send email to yourself
    replyTo: singleLine(email),
    subject: singleLine(`New message from ${name}`),
    text: `Name: ${singleLine(name)}
Email: ${singleLine(email)}
Contact Number: ${singleLine(contact)}
Message:
${message}`,
  }

  try {
    await transporter.sendMail(mailOptions)
    return NextResponse.json({ success: true, message: "Email sent successfully" })
  } catch (error) {
    console.error("Email sending error:", error)
    return NextResponse.json({ success: false, message: "Failed to send email" }, { status: 500 })
  }
}
