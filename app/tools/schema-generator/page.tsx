import type { Metadata } from "next"
import JsonSchemaGeneratorClientPage from "./JsonSchemaGeneratorClientPage"
import { JsonLd } from "@/components/json-ld"
import { ToolContent } from "@/components/tool-content"
import { toolStructuredData } from "@/lib/structured-data"
import { KEYWORDS } from "@/lib/constants"

export const metadata: Metadata = {
  title: "JSON Schema Generator - Create JSON Schema from JSON Data",
  description: "Generate JSON Schema from your JSON data. Create schemas for validation and documentation purposes.",
  keywords: KEYWORDS,
  alternates: {
    canonical: "/tools/schema-generator",
  },
}

export default function JsonSchemaGeneratorPage() {
  return (
    <>
      {toolStructuredData({
        name: "JSON Schema Generator",
        shortName: "JSON Schema Generator",
        description:
          "Generate JSON Schema from your JSON data. Create schemas for validation and documentation purposes.",
        path: "/tools/schema-generator",
      }).map((data, i) => (
        <JsonLd key={i} data={data} />
      ))}
      <JsonSchemaGeneratorClientPage />
      <ToolContent slug="schema-generator" />
    </>
  )
}

