// app/api/contact/route.ts
import { NextRequest, NextResponse } from "next/server"
import { Resend } from "resend"
import { z } from "zod"
import { pruneRateLimitBuckets, rateLimit } from "@/lib/rate-limit"

/** Strip CR/LF so user input can never inject extra mail headers. */
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

  // Read config at request time (not module scope) so Vercel's runtime env is
  // always used. Log exactly which var is missing to make setup issues obvious.
  const RESEND_API_KEY = process.env.RESEND_API_KEY
  const CONTACT_TO_EMAIL = process.env.CONTACT_TO_EMAIL
  const CONTACT_FROM_EMAIL = process.env.CONTACT_FROM_EMAIL

  if (!RESEND_API_KEY || !CONTACT_TO_EMAIL || !CONTACT_FROM_EMAIL) {
    const missing = [
      !RESEND_API_KEY && "RESEND_API_KEY",
      !CONTACT_TO_EMAIL && "CONTACT_TO_EMAIL",
      !CONTACT_FROM_EMAIL && "CONTACT_FROM_EMAIL",
    ].filter(Boolean)
    console.error(`Contact form is not configured — missing: ${missing.join(", ")}`)
    return NextResponse.json({ success: false, message: "Failed to send email" }, { status: 503 })
  }

  const resend = new Resend(RESEND_API_KEY)

  try {
    // `from` is a verified sender we control; the visitor's address is only ever
    // used as replyTo, so it can never be injected into a header.
    const { error } = await resend.emails.send({
      from: CONTACT_FROM_EMAIL,
      to: CONTACT_TO_EMAIL,
      replyTo: singleLine(email),
      subject: singleLine(`[JSON Forge] New message from ${name}`),
      text: `Name: ${singleLine(name)}
Email: ${singleLine(email)}
Contact Number: ${singleLine(contact)}
Message:
${message}`,
    })

    if (error) {
      console.error("Resend rejected the contact email:", error)
      return NextResponse.json({ success: false, message: "Failed to send email" }, { status: 502 })
    }

    return NextResponse.json({ success: true, message: "Email sent successfully" })
  } catch (error) {
    console.error("Email sending error:", error)
    return NextResponse.json({ success: false, message: "Failed to send email" }, { status: 500 })
  }
}
