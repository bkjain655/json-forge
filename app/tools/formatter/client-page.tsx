"use client"

import { useState } from "react"
import { JsonEditor } from "@/components/json-editor"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { isValidJson, formatJson, minifyJson } from "@/lib/utils"
import { FileJson } from "lucide-react"

export default function JsonFormatterClientPage() {
  const [json, setJson] = useState("")
  const [formattedJson, setFormattedJson] = useState("")
  const [indentation, setIndentation] = useState(2)
  const [error, setError] = useState("")

  const handleFormat = () => {
    setError("")
    setFormattedJson("")

    if (!json.trim()) {
      setError("Please enter JSON to format")
      return
    }

    if (!isValidJson(json)) {
      setError("Invalid JSON format")
      return
    }

    try {
      const formatted = formatJson(json, indentation)
      setFormattedJson(formatted)
    } catch (err) {
      setError("Error formatting JSON")
    }
  }

  const handleMinify = () => {
    setError("")
    setFormattedJson("")

    if (!json.trim()) {
      setError("Please enter JSON to minify")
      return
    }

    if (!isValidJson(json)) {
      setError("Invalid JSON format")
      return
    }

    try {
      const minified = minifyJson(json)
      setFormattedJson(minified)
    } catch (err) {
      setError("Error minifying JSON")
    }
  }

  // Sample data for demonstration
  const loadSampleData = () => {
    setJson(
      '{"name":"John Doe","age":30,"isActive":true,"address":{"street":"123 Main St","city":"New York","zip":"10001"},"phoneNumbers":[{"type":"home","number":"212-555-1234"},{"type":"work","number":"646-555-4567"}]}',
    )
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="text-center mb-8">
        <FileJson className="h-12 w-12 mx-auto mb-4 text-primary" />
        <h1 className="text-3xl font-bold mb-2">JSON Formatter</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Format and beautify your JSON data with customizable indentation. Make your JSON readable and well-structured.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div>
          <JsonEditor value={json} onChange={setJson} label="JSON Input" error={error} />
        </div>
        <div>
          <JsonEditor value={formattedJson} onChange={() => {}} label="Formatted JSON" readOnly />
        </div>
      </div>

      <div className="flex flex-col md:flex-row justify-center items-center gap-8 mb-8">
        <div className="flex items-center gap-4 w-full max-w-xs">
          <span className="text-sm font-medium">Indentation:</span>
          <Slider
            value={[indentation]}
            min={1}
            max={8}
            step={1}
            onValueChange={(value) => setIndentation(value[0])}
            className="w-32"
          />
          <span className="text-sm font-medium">{indentation}</span>
        </div>
        <div className="flex gap-4">
          <Button onClick={handleFormat}>Format JSON</Button>
          <Button variant="outline" onClick={handleMinify}>
            Minify JSON
          </Button>
          <Button variant="outline" onClick={loadSampleData}>
            Load Sample Data
          </Button>
        </div>
      </div>

      <div className="mt-12 max-w-3xl mx-auto">
        <h2 className="text-2xl font-bold mb-4">JSON Formatting Tips</h2>
        <ul className="list-disc pl-6 space-y-2">
          <li>
            <strong>Beautify JSON</strong> - Format your JSON with proper indentation to make it more readable for
            humans.
          </li>
          <li>
            <strong>Minify JSON</strong> - Remove all whitespace to reduce file size for production or transmission.
          </li>
          <li>
            <strong>Validate Structure</strong> - Ensure your JSON is valid before using it in your applications.
          </li>
          <li>
            <strong>Consistent Indentation</strong> - Use consistent indentation (2 or 4 spaces are common) for better
            readability.
          </li>
        </ul>
      </div>
    </div>
  )
}

