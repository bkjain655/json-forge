import type { Metadata } from "next"
import JsonMergePageClient from "./page.client"
import { KEYWORDS } from "@/lib/constants"

export const metadata: Metadata = {
  title: "JSON Merge - Merge Multiple JSON Objects",
  description: "Merge multiple JSON objects into a single JSON object. Combine data from different sources easily.",
  keywords: KEYWORDS,
}

export default function JsonMergePage() {
  return <JsonMergePageClient />
}

