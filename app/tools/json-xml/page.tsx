import type { Metadata } from "next"
import JsonXmlClientPage from "./JsonXmlClientPage"
import { JsonLd } from "@/components/json-ld"
import { ToolContent } from "@/components/tool-content"
import { toolStructuredData } from "@/lib/structured-data"
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
  return (
    <>
      {toolStructuredData({
        name: "JSON to XML Converter",
        shortName: "JSON to XML",
        description:
          "Convert between JSON and XML formats easily. Transform your data between these popular data serialization formats.",
        path: "/tools/json-xml",
      }).map((data, i) => (
        <JsonLd key={i} data={data} />
      ))}
      <JsonXmlClientPage />
      <ToolContent slug="json-xml" />
    </>
  )
}

