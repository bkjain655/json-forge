import type { Metadata } from "next"
import { KEYWORDS } from "@/lib/constants"
import ContactUs from "@/components/ui/contactus"

// At the top of your app/contact-us/page.tsx
export const metadata = {
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
    openGraph: {
        title: "Contact Us - JSON Forge | Get in Touch",
        description: "Have questions, feedback, or suggestions? Contact JSON Forge. We're here to help with all your JSON tool needs!",
        url: "https://jsonforge.com/contact-us",
        siteName: "JSON Forge",
        type: "website",
    },
}

export default function ContactUsPage() {
  return <ContactUs />
}

