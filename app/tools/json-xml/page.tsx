import type { Metadata } from "next"
import JsonXmlClientPage from "./JsonXmlClientPage"
import { KEYWORDS } from "@/lib/constants"

export const metadata: Metadata = {
  title: "JSON to XML Converter - Convert Between JSON and XML",
  description:
    "Convert between JSON and XML formats easily. Transform your data between these popular data serialization formats.",
  keywords: KEYWORDS,
  alternates: {
    canonical: "/tools/json-xml",
  },
}

export default function JsonXmlPage() {
  return <JsonXmlClientPage />
}

