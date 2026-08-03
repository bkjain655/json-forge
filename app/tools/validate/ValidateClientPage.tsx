"use client"

import { useState, useEffect } from "react"
import { JsonEditor } from "@/components/json-editor"
import { Button } from "@/components/ui/button"
import { ShareButton } from "@/components/ui/share-button"
import { tryParseJson } from "@/lib/utils"
import { useSharedInput } from "@/hooks/use-shared-input"
import { FileCheck, CheckCircle, XCircle } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { ToolHeader } from "@/components/tool-header"

export default function ValidateClientPage() {
  const { initialValue } = useSharedInput()
  const [json, setJson] = useState("")

  // Hydrate from a shared permalink on first client render.
  useEffect(() => {
    if (initialValue) setJson(initialValue)
  }, [initialValue])
  const [validationResult, setValidationResult] = useState<{
    valid: boolean
    message: string
    formattedJson?: string
  } | null>(null)

  const handleValidate = () => {
    setValidationResult(null)

    if (!json.trim()) {
      setValidationResult({
        valid: false,
        message: "Please enter JSON to validate",
      })
      return
    }

    // Parse once - the parsed value is reused to produce the formatted output.
    const parsed = tryParseJson(json)
    if (!parsed.ok) {
      setValidationResult({ valid: false, message: parsed.error })
      return
    }

    setValidationResult({
      valid: true,
      message: "JSON is valid",
      formattedJson: JSON.stringify(parsed.value, null, 2),
    })
  }

  // Sample data for demonstration
  const loadSampleData = () => {
    setJson(
      JSON.stringify(
        {
          name: "John Doe",
          age: 30,
          isActive: true,
          address: {
            street: "123 Main St",
            city: "New York",
            zip: "10001",
          },
          phoneNumbers: [
            {
              type: "home",
              number: "212-555-1234",
            },
            {
              type: "work",
              number: "646-555-4567",
            },
          ],
        },
        null,
        2,
      ),
    )
  }

  // Load invalid JSON for demonstration
  const loadInvalidSample = () => {
    setJson(`{
  "name": "John Doe",
  "age": 30,
  "isActive": true,
  "address": {
    "street": "123 Main St",
    "city": "New York",
    "zip": "10001"
  },
  "phoneNumbers": [
    {
      "type": "home",
      "number": "212-555-1234"
    },
    {
      "type": "work",
      "number": "646-555-4567",
    }
  ]
}`)
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <ToolHeader
        icon={FileCheck}
        title="JSON Validator"
        description="Validate your JSON to ensure it has correct syntax and structure — errors are underlined on the exact line as you type."
      />

      <div className="mb-6">
        <JsonEditor value={json} onChange={setJson} label="Enter JSON to validate" />
      </div>

      <div className="flex flex-wrap justify-center gap-4 mb-8">
        <Button onClick={handleValidate}>Validate JSON</Button>
        <Button variant="outline" onClick={loadSampleData}>
          Load Valid Sample
        </Button>
        <Button variant="outline" onClick={loadInvalidSample}>
          Load Invalid Sample
        </Button>
        <ShareButton value={json} />
      </div>

      {validationResult && (
        <Alert role="status" aria-live="polite" className={validationResult.valid ? "bg-green-50 dark:bg-green-950/20" : "bg-red-50 dark:bg-red-950/20"}>
          <div className="flex items-center gap-2">
            {validationResult.valid ? (
              <CheckCircle className="h-5 w-5 text-green-500" />
            ) : (
              <XCircle className="h-5 w-5 text-red-500" />
            )}
            <AlertTitle
              className={
                validationResult.valid ? "text-green-700 dark:text-green-300" : "text-red-700 dark:text-red-300"
              }
            >
              {validationResult.valid ? "Valid JSON" : "Invalid JSON"}
            </AlertTitle>
          </div>
          <AlertDescription className="mt-2">{validationResult.message}</AlertDescription>
        </Alert>
      )}

      {validationResult?.valid && validationResult.formattedJson && (
        <div className="mt-8">
          <h2 className="text-2xl font-bold text-center mb-4">Formatted JSON</h2>
          <JsonEditor value={validationResult.formattedJson} onChange={() => {}} readOnly />
        </div>
      )}
    </div>
  )
}

