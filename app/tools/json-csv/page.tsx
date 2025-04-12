import type { Metadata } from "next"
import { KEYWORDS } from "@/lib/constants"
import JsonCsvClientPage from "./JsonCsvClientPage"

export const metadata: Metadata = {
  title: "JSON to CSV Converter - Convert Between JSON and CSV",
  description:
    "Convert between JSON and CSV formats easily. Transform your data between these popular data serialization formats.",
  keywords: KEYWORDS,
}

export default function JsonCSVPage() {
  return <JsonCsvClientPage />
}

