import type { Metadata } from "next"
import JsonYamlClientPage from "./JsonYamlClientPage"
import { JsonLd } from "@/components/json-ld"
import { ToolContent } from "@/components/tool-content"
import { toolStructuredData } from "@/lib/structured-data"
import { KEYWORDS } from "@/lib/constants"

export const metadata: Metadata = {
  title: "JSON to YAML Converter - Convert Between JSON and YAML",
  description:
    "Convert between JSON and YAML formats easily. Transform your data between these popular data serialization formats.",
  keywords: KEYWORDS,
  alternates: {
    canonical: "/tools/json-yaml",
  },
}

export default function JsonYamlPage() {
  return (
    <>
      {toolStructuredData({
        name: "JSON to YAML Converter",
        shortName: "JSON to YAML",
        description:
          "Convert between JSON and YAML formats easily. Transform your data between these popular data serialization formats.",
        path: "/tools/json-yaml",
      }).map((data, i) => (
        <JsonLd key={i} data={data} />
      ))}
      <JsonYamlClientPage />
      <ToolContent slug="json-yaml" />
    </>
  )
}

