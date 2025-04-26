// app/api/contact/route.ts
import { NextRequest, NextResponse } from "next/server"
import nodemailer from "nodemailer"
const { EMAIL_USER, EMAIL_PASS } = process.env
export async function POST(req: NextRequest) {
  const { name, email, contact, message } = await req.json()

  const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
      user: EMAIL_USER, // Your Gmail
      pass: EMAIL_PASS, // Your App Password
    },
  })

  const mailOptions = {
    from: email,
    to: EMAIL_USER, // Send email to yourself
    subject: `New message from ${name}`,
    text: `
Name: ${name}
Email: ${email}
Contact Number: ${contact}
Message: ${message}
    `,
  }

  try {
    await transporter.sendMail(mailOptions)
    return NextResponse.json({ success: true, message: "Email sent successfully" })
  } catch (error) {
    console.error("Email sending error:", error)
    return NextResponse.json({ success: false, message: "Failed to send email" }, { status: 500 })
  }
}