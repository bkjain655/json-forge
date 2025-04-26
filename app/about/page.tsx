import type { Metadata } from "next"
import Description from "@/components/ui/description"
import { KEYWORDS } from "@/lib/constants"

export const metadata: Metadata = {
  title: "About Us | JSON Forge",
  description:
    "Learn more about JSON Forge - a collection of free online utilities for developers to work with JSON data.",
  keywords: KEYWORDS,
  openGraph: {
    title: "About Us | JSON Forge",
    description: "Explore JSON Forge, a developer-friendly online platform to handle JSON and YAML data smartly.",
    url: "https://jsonforge.com/about",
    siteName: "JSON Forge",
    type: "website",
  }
}

export default function JsonToolsAboutPage() {
  return <Description />
}

