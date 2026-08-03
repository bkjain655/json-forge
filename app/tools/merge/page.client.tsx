"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { JsonEditor } from "@/components/json-editor"
import { mergeJson, tryParseJson } from "@/lib/utils"
import { GitMerge, Plus, Trash } from "lucide-react"
import { ToolHeader } from "@/components/tool-header"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function JsonMergePageClient() {
  const [jsonInputs, setJsonInputs] = useState<string[]>(["", ""])
  const [errors, setErrors] = useState<string[]>(["", ""])
  const [result, setResult] = useState("")
  const [mergeError, setMergeError] = useState("")

  const handleAddInput = () => {
    setJsonInputs([...jsonInputs, ""])
    setErrors([...errors, ""])
  }

  const handleRemoveInput = (index: number) => {
    if (jsonInputs.length <= 2) return

    const newInputs = [...jsonInputs]
    newInputs.splice(index, 1)
    setJsonInputs(newInputs)

    const newErrors = [...errors]
    newErrors.splice(index, 1)
    setErrors(newErrors)
  }

  const handleInputChange = (value: string, index: number) => {
    const newInputs = [...jsonInputs]
    newInputs[index] = value
    setJsonInputs(newInputs)

    // Clear error when input changes
    if (errors[index]) {
      const newErrors = [...errors]
      newErrors[index] = ""
      setErrors(newErrors)
    }
  }

  const handleMerge = () => {
    setResult("")
    setMergeError("")

    // Validate all inputs
    let hasError = false
    const newErrors = jsonInputs.map((json) => {
      if (!json.trim()) {
        hasError = true
        return "JSON cannot be empty"
      }

      const parsed = tryParseJson(json)
      if (!parsed.ok) {
        hasError = true
        return parsed.error
      }

      return ""
    })

    setErrors(newErrors)

    if (hasError) return

    try {
      const merged = mergeJson(...jsonInputs)
      setResult(merged)
    } catch (error) {
      setMergeError("Error merging JSON objects")
    }
  }

  // Sample data for demonstration
  const loadSampleData = () => {
    setJsonInputs([
      JSON.stringify(
        {
          name: "John Doe",
          age: 30,
          contact: {
            email: "john@example.com",
          },
        },
        null,
        2,
      ),
      JSON.stringify(
        {
          address: {
            street: "123 Main St",
            city: "New York",
          },
          contact: {
            phone: "555-1234",
          },
        },
        null,
        2,
      ),
    ])
    setErrors(["", ""])
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <ToolHeader
        icon={GitMerge}
        title="JSON Merge"
        description="Deep-merge multiple JSON objects into one. Later objects override earlier ones on conflicts."
      />

      <div className="space-y-6 mb-8">
        {jsonInputs.map((json, index) => (
          <div key={index} className="flex gap-4">
            <JsonEditor
              value={json}
              onChange={(value) => handleInputChange(value, index)}
              label={`JSON Object ${index + 1}`}
              error={errors[index]}
              className="flex-1"
            />
            {index >= 2 && (
              <Button variant="outline" size="icon" onClick={() => handleRemoveInput(index)} className="mt-8">
                <Trash className="h-4 w-4" />
              </Button>
            )}
          </div>
        ))}
      </div>

      <div className="flex justify-center gap-4 mb-8">
        <Button onClick={handleAddInput}>
          <Plus className="h-4 w-4 mr-2" />
          Add JSON Object
        </Button>
        <Button onClick={handleMerge}>Merge JSON</Button>
        <Button variant="outline" onClick={loadSampleData}>
          Load Sample Data
        </Button>
      </div>

      {mergeError && (
        <Alert variant="destructive" className="mb-6">
          <AlertDescription>{mergeError}</AlertDescription>
        </Alert>
      )}

      {result && (
        <div role="status" aria-live="polite">
          <h2 className="text-2xl font-bold text-center mb-4">Merged Result</h2>
          <JsonEditor value={result} onChange={() => {}} readOnly heightPx={300} />
        </div>
      )}
    </div>
  )
}

