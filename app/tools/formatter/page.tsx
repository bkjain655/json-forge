import type { Metadata } from "next"
import JsonFormatterClientPage from "./client-page"
import { JsonLd } from "@/components/json-ld"
import { ToolContent } from "@/components/tool-content"
import { toolStructuredData } from "@/lib/structured-data"
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
  return (
    <>
      {toolStructuredData({
        name: "JSON Formatter",
        shortName: "JSON Formatter",
        description:
          "Format and beautify your JSON data with customizable indentation. Make your JSON readable and well-structured.",
        path: "/tools/formatter",
      }).map((data, i) => (
        <JsonLd key={i} data={data} />
      ))}
      <JsonFormatterClientPage />
      <ToolContent slug="formatter" />
    </>
  )
}

