import type { Metadata } from "next"
import ValidateClientPage from "./ValidateClientPage"
import { KEYWORDS } from "@/lib/constants"

export const metadata: Metadata = {
  title: "JSON Validator - Validate JSON Syntax and Structure",
  description:
    "Validate your JSON data to ensure it has correct syntax and structure. Fix JSON errors with our online validator tool.",
  keywords: KEYWORDS,
}

export default function JsonValidatePage() {
  return <ValidateClientPage />
}

