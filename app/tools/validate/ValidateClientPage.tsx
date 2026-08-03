"use client"

import { useState, useEffect, useMemo } from "react"
import { JsonEditor } from "@/components/json-editor"
import { JsonOutput } from "@/components/json-output"
import { Button } from "@/components/ui/button"
import { ShareButton } from "@/components/ui/share-button"
import { tryParseJson, cn } from "@/lib/utils"
import { useSharedInput } from "@/hooks/use-shared-input"
import { useDebouncedValue } from "@/hooks/use-debounced-value"
import { FileCheck, CheckCircle, XCircle } from "lucide-react"
import { ToolHeader } from "@/components/tool-header"

const VALID_SAMPLE = JSON.stringify(
  {
    name: "John Doe",
    age: 30,
    isActive: true,
    address: { street: "123 Main St", city: "New York", zip: "10001" },
    phoneNumbers: [
      { type: "home", number: "212-555-1234" },
      { type: "work", number: "646-555-4567" },
    ],
  },
  null,
  2,
)

// Trailing comma after the last phone number - intentionally invalid.
const INVALID_SAMPLE = `{
  "name": "John Doe",
  "phoneNumbers": [
    { "type": "home", "number": "212-555-1234" },
    { "type": "work", "number": "646-555-4567" },
  ]
}`

export default function ValidateClientPage() {
  const { initialValue } = useSharedInput()
  const [json, setJson] = useState("")

  useEffect(() => {
    if (initialValue) setJson(initialValue)
  }, [initialValue])

  const debouncedJson = useDebouncedValue(json)
  const { status, message, output, parsed } = useMemo(() => {
    if (!debouncedJson.trim()) return { status: "empty" as const, message: "", output: "", parsed: null as unknown }
    const result = tryParseJson(debouncedJson)
    if (!result.ok) return { status: "invalid" as const, message: result.error, output: "", parsed: null as unknown }
    return { status: "valid" as const, message: "JSON is valid.", output: JSON.stringify(result.value, null, 2), parsed: result.value as unknown }
  }, [debouncedJson])

  return (
    <div className="container mx-auto px-4 py-12">
      <ToolHeader
        icon={FileCheck}
        title="JSON Validator"
        description="Validate your JSON live as you type — the status updates instantly and errors are underlined on the exact line."
      />

      <div className="mb-4 flex flex-wrap gap-2">
        <Button variant="ghost" size="sm" onClick={() => setJson(VALID_SAMPLE)}>Load valid sample</Button>
        <Button variant="ghost" size="sm" onClick={() => setJson(INVALID_SAMPLE)}>Load invalid sample</Button>
        <ShareButton value={json} />
      </div>

      {/* Live status */}
      {status !== "empty" && (
        <div
          role="status"
          aria-live="polite"
          className={cn(
            "mb-4 flex items-center gap-2 rounded-md border px-3 py-2 text-sm",
            status === "valid"
              ? "border-green-600/30 bg-green-500/10 text-green-700 dark:text-green-300"
              : "border-destructive/30 bg-destructive/10 text-destructive",
          )}
        >
          {status === "valid" ? <CheckCircle className="h-4 w-4" /> : <XCircle className="h-4 w-4" />}
          <span className="font-medium">{status === "valid" ? "Valid JSON" : "Invalid JSON"}</span>
          <span className="text-muted-foreground">— {message}</span>
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <JsonEditor value={json} onChange={setJson} label="JSON to validate" />
        <JsonOutput
          value={output}
          parsed={parsed}
          label="Formatted output"
          emptyHint="Valid JSON is formatted here as you type."
        />
      </div>
    </div>
  )
}
