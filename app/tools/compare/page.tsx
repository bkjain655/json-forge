import type { Metadata } from "next"
import JsonCompareClientPage from "./JsonCompareClientPage"
import { KEYWORDS } from "@/lib/constants"

export const metadata: Metadata = {
  title: "JSON Compare - Compare JSON Objects",
  description:
    "Compare two JSON objects and highlight the differences between them. Identify added, removed, and modified properties.",
  keywords: KEYWORDS,
  alternates: {
    canonical: "/tools/compare",
  },
}

export default function JsonComparePage() {
  return <JsonCompareClientPage />
}

