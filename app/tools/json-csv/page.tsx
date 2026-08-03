import type { Metadata } from "next"
import { KEYWORDS } from "@/lib/constants"
import JsonCsvClientPage from "./JsonCsvClientPage"
import { JsonLd } from "@/components/json-ld"
import { ToolContent } from "@/components/tool-content"
import { toolStructuredData } from "@/lib/structured-data"

export const metadata: Metadata = {
  title: "JSON to CSV Converter - Convert Between JSON and CSV",
  description:
    "Convert between JSON and CSV formats easily. Transform your data between these popular data serialization formats.",
  keywords: KEYWORDS,
  alternates: {
    canonical: "/tools/json-csv",
  },
}

export default function JsonCSVPage() {
  return (
    <>
      {toolStructuredData({
        name: "JSON to CSV Converter",
        shortName: "JSON to CSV",
        description:
          "Convert between JSON and CSV formats easily. Transform your data between these popular data serialization formats.",
        path: "/tools/json-csv",
      }).map((data, i) => (
        <JsonLd key={i} data={data} />
      ))}
      <JsonCsvClientPage />
      <ToolContent slug="json-csv" />
    </>
  )
}

