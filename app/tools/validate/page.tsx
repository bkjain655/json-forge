import type { Metadata } from "next"
import ValidateClientPage from "./ValidateClientPage"
import { JsonLd } from "@/components/json-ld"
import { ToolContent } from "@/components/tool-content"
import { toolStructuredData } from "@/lib/structured-data"
import { KEYWORDS } from "@/lib/constants"

export const metadata: Metadata = {
  title: "JSON Validator - Validate JSON Syntax and Structure",
  description:
    "Validate your JSON data to ensure it has correct syntax and structure. Fix JSON errors with our online validator tool.",
  keywords: KEYWORDS,
  alternates: {
    canonical: "/tools/validate",
  },
}

export default function JsonValidatePage() {
  return (
    <>
      {toolStructuredData({
        name: "JSON Validator",
        shortName: "JSON Validator",
        description:
          "Validate your JSON data to ensure it has correct syntax and structure. Fix JSON errors with our online validator tool.",
        path: "/tools/validate",
      }).map((data, i) => (
        <JsonLd key={i} data={data} />
      ))}
      <ValidateClientPage />
      <ToolContent slug="validate" />
    </>
  )
}

