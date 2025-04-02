import type { Metadata } from "next"
import Description from "@/components/ui/description"
import { KEYWORDS } from "@/lib/constants"

export const metadata: Metadata = {
  title: "JSON Forge - About",
  description:
    "Learn more about JSON Forge - a collection of free online utilities for developers to work with JSON data.",
  keywords: KEYWORDS
}

export default function JsonToolsAboutPage() {
  return <Description />
}

