"use client"

import { useState, useEffect } from "react"
import { JsonEditor } from "@/components/json-editor"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { isValidJson, compareJson } from "@/lib/utils"
import { GitCompare } from "lucide-react"

export default function JsonCompareClientPage() {
  const [json1, setJson1] = useState("")
  const [json2, setJson2] = useState("")
  const [error1, setError1] = useState("")
  const [error2, setError2] = useState("")
  const [result, setResult] = useState<{ added: any; removed: any; modified: any } | null>(null)

  const handleCompare = () => {
    setError1("")
    setError2("")
    setResult(null)

    if (!json1.trim()) {
      setError1("Please enter JSON in the first editor")
      return
    }

    if (!json2.trim()) {
      setError2("Please enter JSON in the second editor")
      return
    }

    if (!isValidJson(json1)) {
      setError1("Invalid JSON format")
      return
    }

    if (!isValidJson(json2)) {
      setError2("Invalid JSON format")
      return
    }

    try {
      const comparison = compareJson(json1, json2)
      setResult(comparison)
    } catch (error) {
      setError1("Error comparing JSON objects")
    }
  }

  // Sample data for demonstration
  const loadSampleData = () => {
    setJson1(
      JSON.stringify(
        {
          name: "John Doe",
          age: 30,
          address: {
            street: "123 Main St",
            city: "New York",
            zip: "10001",
          },
          hobbies: ["reading", "gaming"],
        },
        null,
        2,
      ),
    )

    setJson2(
      JSON.stringify(
        {
          name: "John Doe",
          age: 31,
          address: {
            street: "456 Park Ave",
            city: "New York",
            zip: "10001",
            country: "USA",
          },
          hobbies: ["reading", "traveling"],
          email: "john@example.com",
        },
        null,
        2,
      ),
    )
  }

  useEffect(() => {
    // Clear results when inputs change
    if (result) {
      setResult(null)
    }
  }, [json1, json2])

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="text-center mb-8">
        <GitCompare className="h-12 w-12 mx-auto mb-4 text-primary" />
        <h1 className="text-3xl font-bold mb-2">JSON Compare</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Compare two JSON objects and identify the differences between them. See what properties were added, removed,
          or modified.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <JsonEditor value={json1} onChange={setJson1} label="First JSON" error={error1} />
        <JsonEditor value={json2} onChange={setJson2} label="Second JSON" error={error2} />
      </div>

      <div className="flex justify-center gap-4 mb-8">
        <Button onClick={handleCompare}>Compare JSON</Button>
        <Button variant="outline" onClick={loadSampleData}>
          Load Sample Data
        </Button>
      </div>

      {result && (
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-center">Comparison Results</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="p-4">
              <h3 className="text-lg font-semibold mb-2 text-green-500">Added Properties</h3>
              <pre className="bg-muted p-4 rounded-md overflow-auto max-h-[300px] text-sm">
                {Object.keys(result.added).length > 0 ? JSON.stringify(result.added, null, 2) : "No properties added"}
              </pre>
            </Card>

            <Card className="p-4">
              <h3 className="text-lg font-semibold mb-2 text-red-500">Removed Properties</h3>
              <pre className="bg-muted p-4 rounded-md overflow-auto max-h-[300px] text-sm">
                {Object.keys(result.removed).length > 0
                  ? JSON.stringify(result.removed, null, 2)
                  : "No properties removed"}
              </pre>
            </Card>

            <Card className="p-4">
              <h3 className="text-lg font-semibold mb-2 text-blue-500">Modified Properties</h3>
              <pre className="bg-muted p-4 rounded-md overflow-auto max-h-[300px] text-sm">
                {Object.keys(result.modified).length > 0
                  ? JSON.stringify(result.modified, null, 2)
                  : "No properties modified"}
              </pre>
            </Card>
          </div>
        </div>
      )}
    </div>
  )
}

