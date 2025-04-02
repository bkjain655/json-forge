import type { Metadata } from "next"
import JsonSchemaGeneratorClientPage from "./JsonSchemaGeneratorClientPage"
import { KEYWORDS } from "@/lib/constants"

export const metadata: Metadata = {
  title: "JSON Schema Generator - Create JSON Schema from JSON Data",
  description: "Generate JSON Schema from your JSON data. Create schemas for validation and documentation purposes.",
  keywords: KEYWORDS,
}

export default function JsonSchemaGeneratorPage() {
  return <JsonSchemaGeneratorClientPage />
}

