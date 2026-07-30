import type { Metadata } from "next"
import { SITE_URL } from "@/lib/constants"
import ContactUs from "@/components/ui/contactus"

export const metadata: Metadata = {
    title: "Contact Us - JSON Forge | Get in Touch",
    description: "Have questions, feedback, or suggestions? Contact JSON Forge. We're here to help with all your JSON tool needs!",
    keywords: [
      "Contact JSON Forge",
      "JSON Forge support",
      "Connect with JSON Forge",
      "JSON tool feedback",
      "JSON Forge queries",
      "JSON tools contact",
      "Reach JSON Forge",
      "JSON Forge email",
      "Support JSON Forge"
    ],
    alternates: {
        canonical: "/contact-us",
    },
    openGraph: {
        title: "Contact Us - JSON Forge | Get in Touch",
        description: "Have questions, feedback, or suggestions? Contact JSON Forge. We're here to help with all your JSON tool needs!",
        url: `${SITE_URL}/contact-us`,
        siteName: "JSON Forge",
        type: "website",
    },
}

export default function ContactUsPage() {
  return <ContactUs />
}

