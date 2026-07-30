"use client"

import { useState } from "react"
import { JsonEditor } from "@/components/json-editor"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { RotateCw } from "lucide-react"
import { dump as yamlDump, load as yamlLoad } from "js-yaml"

export default function JsonYamlClientPage() {
  const [json, setJson] = useState("")
  const [yaml, setYaml] = useState("")
  const [activeTab, setActiveTab] = useState("json-to-yaml")
  const [error, setError] = useState("")

  const handleJsonToYaml = () => {
    setError("")
    setYaml("")

    if (!json.trim()) {
      setError("Please enter JSON to convert")
      return
    }

    let parsed: unknown
    try {
      parsed = JSON.parse(json)
    } catch {
      setError("Invalid JSON format")
      return
    }

    try {
      setYaml(yamlDump(parsed, { indent: 2, lineWidth: -1, noRefs: true }))
    } catch (err) {
      setError(err instanceof Error ? `Error converting JSON to YAML: ${err.message}` : "Error converting JSON to YAML")
    }
  }

  const handleYamlToJson = () => {
    setError("")
    setJson("")

    if (!yaml.trim()) {
      setError("Please enter YAML to convert")
      return
    }

    try {
      const parsed = yamlLoad(yaml)
      if (parsed === undefined) {
        setError("The YAML document is empty")
        return
      }
      setJson(JSON.stringify(parsed, null, 2))
    } catch (err) {
      setError(err instanceof Error ? `Error converting YAML to JSON: ${err.message}` : "Error converting YAML to JSON")
    }
  }

  // Sample data for demonstration
  const loadJsonSample = () => {
    setJson(
      JSON.stringify(
        {
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
    setActiveTab("json-to-yaml")
  }

  const loadYamlSample = () => {
    setYaml(`name: Product Name
price: 19.99
inStock: true
tags:
  - electronics
  - gadget
dimensions:
  width: 10
  height: 5
  unit: cm`)
    setActiveTab("yaml-to-json")
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="text-center mb-8">
        <RotateCw className="h-12 w-12 mx-auto mb-4 text-primary" />
        <h1 className="text-3xl font-bold mb-2">JSON ↔ YAML Converter</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Convert between JSON and YAML formats. Transform your data between these popular data serialization formats.
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-8">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="json-to-yaml">JSON to YAML</TabsTrigger>
          <TabsTrigger value="yaml-to-json">YAML to JSON</TabsTrigger>
        </TabsList>

        <TabsContent value="json-to-yaml" className="space-y-6">
          <JsonEditor
            value={json}
            onChange={setJson}
            label="JSON Input"
            error={activeTab === "json-to-yaml" ? error : ""}
          />

          <div className="flex justify-center">
            <Button onClick={handleJsonToYaml}>Convert to YAML</Button>
          </div>

          {yaml && <JsonEditor value={yaml} onChange={() => {}} label="YAML Output" readOnly />}

          <div className="flex justify-center">
            <Button variant="outline" onClick={loadJsonSample}>
              Load Sample JSON
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="yaml-to-json" className="space-y-6">
          <JsonEditor
            value={yaml}
            onChange={setYaml}
            label="YAML Input"
            error={activeTab === "yaml-to-json" ? error : ""}
          />

          <div className="flex justify-center">
            <Button onClick={handleYamlToJson}>Convert to JSON</Button>
          </div>

          {json && <JsonEditor value={json} onChange={() => {}} label="JSON Output" readOnly />}

          <div className="flex justify-center">
            <Button variant="outline" onClick={loadYamlSample}>
              Load Sample YAML
            </Button>
          </div>
        </TabsContent>
      </Tabs>

      <div className="mt-12 max-w-3xl mx-auto">
        <h2 className="text-2xl font-bold mb-4">About JSON and YAML</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-xl font-semibold mb-2">JSON</h3>
            <p className="text-muted-foreground">
              JSON (JavaScript Object Notation) is a lightweight data-interchange format that is easy for humans to read
              and write and easy for machines to parse and generate.
            </p>
          </div>
          <div>
            <h3 className="text-xl font-semibold mb-2">YAML</h3>
            <p className="text-muted-foreground">
              YAML (YAML Ain&apos;t Markup Language) is a human-friendly data serialization standard that can be used in
              conjunction with all programming languages and is often used for configuration files.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

