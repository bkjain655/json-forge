import type { Metadata } from "next"
import JsonFormatterClientPage from "./client-page"
import { KEYWORDS } from "@/lib/constants"

export const metadata: Metadata = {
  title: "JSON Formatter - Format and Beautify JSON",
  description:
    "Format and beautify your JSON data with customizable indentation. Make your JSON readable and well-structured.",
  keywords: KEYWORDS,
  alternates: {
    canonical: "/tools/formatter",
  },
}

export default function JsonFormatterPage() {
  return <JsonFormatterClientPage />
}

