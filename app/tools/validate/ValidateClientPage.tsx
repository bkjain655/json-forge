"use client"

import { useState } from "react"
import { JsonEditor } from "@/components/json-editor"
import { Button } from "@/components/ui/button"
import { formatJson } from "@/lib/utils"
import { FileCheck, CheckCircle, XCircle } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export default function ValidateClientPage() {
  const [json, setJson] = useState("")
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

    try {
      // Try to parse the JSON
      JSON.parse(json)

      // Format the JSON for better readability
      const formatted = formatJson(json)

      setValidationResult({
        valid: true,
        message: "JSON is valid",
        formattedJson: formatted,
      })
    } catch (error) {
      if (error instanceof Error) {
        setValidationResult({
          valid: false,
          message: `Invalid JSON: ${error.message}`,
        })
      } else {
        setValidationResult({
          valid: false,
          message: "Invalid JSON format",
        })
      }
    }
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
      <div className="text-center mb-8">
        <FileCheck className="h-12 w-12 mx-auto mb-4 text-primary" />
        <h1 className="text-3xl font-bold mb-2">JSON Validator</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Validate your JSON data to ensure it has correct syntax and structure. Fix JSON errors with our online
          validator tool.
        </p>
      </div>

      <div className="mb-6">
        <JsonEditor value={json} onChange={setJson} label="Enter JSON to validate" />
      </div>

      <div className="flex justify-center gap-4 mb-8">
        <Button onClick={handleValidate}>Validate JSON</Button>
        <Button variant="outline" onClick={loadSampleData}>
          Load Valid Sample
        </Button>
        <Button variant="outline" onClick={loadInvalidSample}>
          Load Invalid Sample
        </Button>
      </div>

      {validationResult && (
        <Alert className={validationResult.valid ? "bg-green-50 dark:bg-green-950/20" : "bg-red-50 dark:bg-red-950/20"}>
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

