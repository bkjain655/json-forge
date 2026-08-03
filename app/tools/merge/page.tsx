import type { Metadata } from "next"
import JsonMergePageClient from "./page.client"
import { JsonLd } from "@/components/json-ld"
import { ToolContent } from "@/components/tool-content"
import { toolStructuredData } from "@/lib/structured-data"
import { KEYWORDS } from "@/lib/constants"

export const metadata: Metadata = {
  title: "JSON Merge - Merge Multiple JSON Objects",
  description: "Merge multiple JSON objects into a single JSON object. Combine data from different sources easily.",
  keywords: KEYWORDS,
  alternates: {
    canonical: "/tools/merge",
  },
}

export default function JsonMergePage() {
  return (
    <>
      {toolStructuredData({
        name: "JSON Merge",
        shortName: "JSON Merge",
        description:
          "Merge multiple JSON objects into a single JSON object. Combine data from different sources easily.",
        path: "/tools/merge",
      }).map((data, i) => (
        <JsonLd key={i} data={data} />
      ))}
      <JsonMergePageClient />
      <ToolContent slug="merge" />
    </>
  )
}

