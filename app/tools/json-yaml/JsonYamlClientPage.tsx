"use client"

import { useState, useEffect } from "react"
import { JsonEditor } from "@/components/json-editor"
import { Button } from "@/components/ui/button"
import { ShareButton } from "@/components/ui/share-button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useSharedInput } from "@/hooks/use-shared-input"
import { RotateCw } from "lucide-react"
import { ToolHeader } from "@/components/tool-header"
import { dump as yamlDump, load as yamlLoad } from "js-yaml"

export default function JsonYamlClientPage() {
  const { initialValue } = useSharedInput()
  const [json, setJson] = useState("")
  const [yaml, setYaml] = useState("")
  const [activeTab, setActiveTab] = useState("json-to-yaml")
  const [error, setError] = useState("")

  // Hydrate the JSON input from a shared permalink on first client render.
  useEffect(() => {
    if (initialValue) {
      setJson(initialValue)
      setActiveTab("json-to-yaml")
    }
  }, [initialValue])

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
      <ToolHeader
        icon={RotateCw}
        title="JSON ↔ YAML Converter"
        description="Convert freely between JSON and YAML — two of the most common data serialization formats."
      />

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

          <div className="flex flex-wrap justify-center gap-4">
            <Button onClick={handleJsonToYaml}>Convert to YAML</Button>
            <ShareButton value={json} />
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
            lint={false}
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

    </div>
  )
}

