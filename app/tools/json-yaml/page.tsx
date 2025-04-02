import type { Metadata } from "next"
import JsonYamlClientPage from "./JsonYamlClientPage"
import { KEYWORDS } from "@/lib/constants"

export const metadata: Metadata = {
  title: "JSON to YAML Converter - Convert Between JSON and YAML",
  description:
    "Convert between JSON and YAML formats easily. Transform your data between these popular data serialization formats.",
  keywords: KEYWORDS,
}

export default function JsonYamlPage() {
  return <JsonYamlClientPage />
}

