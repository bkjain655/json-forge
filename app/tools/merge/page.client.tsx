"use client"

import { useState, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { JsonEditor } from "@/components/json-editor"
import { JsonOutput } from "@/components/json-output"
import { mergeJson, tryParseJson } from "@/lib/utils"
import { GitMerge, Plus, Trash } from "lucide-react"
import { ToolHeader } from "@/components/tool-header"
import { useDebouncedValue } from "@/hooks/use-debounced-value"

export default function JsonMergePageClient() {
  const [jsonInputs, setJsonInputs] = useState<string[]>(["", ""])

  const handleAddInput = () => setJsonInputs((prev) => [...prev, ""])

  const handleRemoveInput = (index: number) => {
    setJsonInputs((prev) => (prev.length <= 2 ? prev : prev.filter((_, i) => i !== index)))
  }

  const handleInputChange = (value: string, index: number) => {
    setJsonInputs((prev) => prev.map((v, i) => (i === index ? value : v)))
  }

  // Live: merge as the user types once every object is present and valid.
  const debouncedInputs = useDebouncedValue(jsonInputs)
  const { output, parsed, inputErrors } = useMemo(() => {
    const inputErrors = debouncedInputs.map((j) => {
      if (!j.trim()) return ""
      const r = tryParseJson(j)
      return r.ok ? "" : r.error
    })
    const allFilled = debouncedInputs.every((j) => j.trim())
    if (!allFilled || inputErrors.some(Boolean)) return { output: "", parsed: null as unknown, inputErrors }
    try {
      const merged = mergeJson(...debouncedInputs)
      return { output: merged, parsed: JSON.parse(merged) as unknown, inputErrors }
    } catch {
      return { output: "", parsed: null as unknown, inputErrors }
    }
  }, [debouncedInputs])

  const loadSampleData = () => {
    setJsonInputs([
      JSON.stringify({ name: "John Doe", age: 30, contact: { email: "john@example.com" } }, null, 2),
      JSON.stringify({ address: { street: "123 Main St", city: "New York" }, contact: { phone: "555-1234" } }, null, 2),
    ])
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <ToolHeader
        icon={GitMerge}
        title="JSON Merge"
        description="Deep-merge multiple JSON objects into one, live as you type. Later objects override earlier ones on conflicts."
      />

      <div className="mb-4 flex flex-wrap gap-2">
        <Button variant="outline" size="sm" onClick={handleAddInput}>
          <Plus className="mr-1.5 h-4 w-4" /> Add object
        </Button>
        <Button variant="ghost" size="sm" onClick={loadSampleData}>Load sample</Button>
      </div>

      <div className="mb-6 grid grid-cols-1 gap-4 lg:grid-cols-2">
        {jsonInputs.map((json, index) => (
          <div key={index} className="relative">
            <JsonEditor
              value={json}
              onChange={(value) => handleInputChange(value, index)}
              label={`JSON object ${index + 1}`}
              error={inputErrors[index]}
              heightPx={280}
            />
            {index >= 2 && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleRemoveInput(index)}
                className="absolute right-2 top-8 z-10"
                aria-label={`Remove object ${index + 1}`}
              >
                <Trash className="h-4 w-4" />
              </Button>
            )}
          </div>
        ))}
      </div>

      <JsonOutput
        value={output}
        parsed={parsed}
        label="Merged result"
        emptyHint="Fill in every object with valid JSON — the merged result appears here."
        heightPx={320}
      />
    </div>
  )
}
