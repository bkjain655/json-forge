"use client"

import { useState } from "react"
import JsonEditor from "@/components/json-editor"
import { Button } from "@/components/ui/button"
import { isValidJson } from "@/lib/utils"
import { Code } from "lucide-react"

export default function JsonSchemaGeneratorClientPage() {
  const [json, setJson] = useState("")
  const [schema, setSchema] = useState("")
  const [error, setError] = useState("")

  const generateSchema = () => {
    setError("")
    setSchema("")

    if (!json.trim()) {
      setError("Please enter JSON to generate schema")
      return
    }

    if (!isValidJson(json)) {
      setError("Invalid JSON format")
      return
    }

    try {
      const parsed = JSON.parse(json)
      const generatedSchema = generateJsonSchema(parsed)
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
      <div className="text-center mb-8">
        <Code className="h-12 w-12 mx-auto mb-4 text-primary" />
        <h1 className="text-3xl font-bold mb-2">JSON Schema Generator</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Generate JSON Schema from your JSON data. Create schemas for validation and documentation purposes.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div>
          <JsonEditor value={json} onChange={setJson} label="JSON Data" error={error} />
        </div>
        <div>
          <JsonEditor value={schema} onChange={() => {}} label="Generated Schema" readOnly />
        </div>
      </div>

      <div className="flex justify-center gap-4">
        <Button onClick={generateSchema}>Generate Schema</Button>
        <Button variant="outline" onClick={loadSampleData}>
          Load Sample Data
        </Button>
      </div>

      <div className="mt-12 max-w-3xl mx-auto">
        <h2 className="text-2xl font-bold mb-4">About JSON Schema</h2>
        <p className="mb-4">
          JSON Schema is a vocabulary that allows you to annotate and validate JSON documents. It describes your
          existing data format with clear, human- and machine-readable documentation.
        </p>
        <p className="mb-4">The generated schema follows the JSON Schema specification and can be used for:</p>
        <ul className="list-disc pl-6 mb-4 space-y-2">
          <li>Validating data against a schema</li>
          <li>Documenting the structure of your JSON data</li>
          <li>Generating code, forms, or documentation</li>
          <li>Testing and ensuring data quality</li>
        </ul>
        <p>
          Note: This is a basic schema generator. For more complex schemas with additional validation rules, you may
          need to modify the generated schema manually.
        </p>
      </div>
    </div>
  )
}

