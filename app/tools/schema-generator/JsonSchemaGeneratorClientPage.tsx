"use client"

import { useState, useEffect } from "react"
import { JsonEditor } from "@/components/json-editor"
import { Button } from "@/components/ui/button"
import { ShareButton } from "@/components/ui/share-button"
import { tryParseJson } from "@/lib/utils"
import { useSharedInput } from "@/hooks/use-shared-input"
import { Code } from "lucide-react"
import { ToolHeader } from "@/components/tool-header"

export default function JsonSchemaGeneratorClientPage() {
  const { initialValue } = useSharedInput()
  const [json, setJson] = useState("")
  const [schema, setSchema] = useState("")
  const [error, setError] = useState("")

  // Hydrate from a shared permalink on first client render.
  useEffect(() => {
    if (initialValue) setJson(initialValue)
  }, [initialValue])

  const generateSchema = () => {
    setError("")
    setSchema("")

    if (!json.trim()) {
      setError("Please enter JSON to generate schema")
      return
    }

    const parsed = tryParseJson(json)
    if (!parsed.ok) {
      setError(parsed.error)
      return
    }

    try {
      const generatedSchema = generateJsonSchema(parsed.value)
      setSchema(JSON.stringify(generatedSchema, null, 2))
    } catch (err) {
      setError("Error generating schema")
    }
  }

  // Function to generate JSON schema from JSON data
  const generateJsonSchema = (data: any): any => {
    if (data === null) {
      return { type: "null" }
    }

    if (Array.isArray(data)) {
      if (data.length === 0) {
        return {
          type: "array",
          items: {},
        }
      }

      // For simplicity, we'll assume all items in the array are of the same type
      // In a more robust implementation, you might want to handle mixed arrays differently
      const itemSchema = generateJsonSchema(data[0])
      return {
        type: "array",
        items: itemSchema,
      }
    }

    if (typeof data === "object") {
      const properties: Record<string, any> = {}
      const required: string[] = []

      for (const key in data) {
        properties[key] = generateJsonSchema(data[key])
        required.push(key)
      }

      return {
        type: "object",
        properties,
        required,
      }
    }

    // Handle primitive types
    return { type: typeof data }
  }

  // Sample data for demonstration
  const loadSampleData = () => {
    setJson(
      JSON.stringify(
        {
          id: 1,
          name: "Product Name",
          price: 19.99,
          inStock: true,
          tags: ["electronics", "gadget"],
          dimensions: {
            width: 10,
            height: 5,
            unit: "cm",
          },
        },
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
        description="Generate a JSON Schema from your JSON data — for validation and documentation."
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div>
          <JsonEditor value={json} onChange={setJson} label="JSON Data" error={error} />
        </div>
        <div>
          <JsonEditor value={schema} onChange={() => {}} label="Generated Schema" readOnly />
        </div>
      </div>

      <div className="flex flex-wrap justify-center gap-4">
        <Button onClick={generateSchema}>Generate Schema</Button>
        <Button variant="outline" onClick={loadSampleData}>
          Load Sample Data
        </Button>
        <ShareButton value={json} />
      </div>

    </div>
  )
}

