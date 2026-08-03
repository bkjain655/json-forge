import type { Metadata } from "next"
import JsonCompareClientPage from "./JsonCompareClientPage"
import { JsonLd } from "@/components/json-ld"
import { ToolContent } from "@/components/tool-content"
import { toolStructuredData } from "@/lib/structured-data"
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
  return (
    <>
      {toolStructuredData({
        name: "JSON Compare",
        shortName: "JSON Compare",
        description:
          "Compare two JSON objects and highlight the differences between them. Identify added, removed, and modified properties.",
        path: "/tools/compare",
      }).map((data, i) => (
        <JsonLd key={i} data={data} />
      ))}
      <JsonCompareClientPage />
      <ToolContent slug="compare" />
    </>
  )
}

