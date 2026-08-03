"use client"

import { useState, useEffect, useMemo } from "react"
import { JsonEditor } from "@/components/json-editor"
import { JsonOutput } from "@/components/json-output"
import { Button } from "@/components/ui/button"
import { ShareButton } from "@/components/ui/share-button"
import { tryParseJson } from "@/lib/utils"
import { useSharedInput } from "@/hooks/use-shared-input"
import { useDebouncedValue } from "@/hooks/use-debounced-value"
import { Code } from "lucide-react"
import { ToolHeader } from "@/components/tool-header"

// Infer a JSON Schema from a sample value. Pure — kept at module scope.
function generateJsonSchema(data: unknown): Record<string, unknown> {
  if (data === null) return { type: "null" }

  if (Array.isArray(data)) {
    if (data.length === 0) return { type: "array", items: {} }
    return { type: "array", items: generateJsonSchema(data[0]) }
  }

  if (typeof data === "object") {
    const properties: Record<string, unknown> = {}
    const required: string[] = []
    for (const key of Object.keys(data as Record<string, unknown>)) {
      properties[key] = generateJsonSchema((data as Record<string, unknown>)[key])
      required.push(key)
    }
    return { type: "object", properties, required }
  }

  return { type: typeof data }
}

export default function JsonSchemaGeneratorClientPage() {
  const { initialValue } = useSharedInput()
  const [json, setJson] = useState("")

  useEffect(() => {
    if (initialValue) setJson(initialValue)
  }, [initialValue])

  const debouncedJson = useDebouncedValue(json)
  const { output, parsed, error } = useMemo(() => {
    if (!debouncedJson.trim()) return { output: "", parsed: null as unknown, error: "" }
    const result = tryParseJson(debouncedJson)
    if (!result.ok) return { output: "", parsed: null as unknown, error: result.error }
    const schema = generateJsonSchema(result.value)
    return { output: JSON.stringify(schema, null, 2), parsed: schema as unknown, error: "" }
  }, [debouncedJson])

  const loadSampleData = () => {
    setJson(
      JSON.stringify(
        { id: 1, name: "Product Name", price: 19.99, inStock: true, tags: ["electronics", "gadget"], dimensions: { width: 10, height: 5, unit: "cm" } },
        null,
        2,
      ),
    )
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <ToolHeader
        icon={Code}
        title="JSON Schema Generator"
        description="Generate a JSON Schema from your JSON data, live as you type — for validation and documentation."
      />

      <div className="mb-4 flex flex-wrap gap-2">
        <Button variant="ghost" size="sm" onClick={loadSampleData}>Load sample</Button>
        <ShareButton value={json} />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <JsonEditor value={json} onChange={setJson} label="JSON data" error={error} />
        <JsonOutput
          value={output}
          parsed={parsed}
          label="Generated schema"
          emptyHint="Paste JSON on the left — the inferred schema appears here instantly."
        />
      </div>
    </div>
  )
}
