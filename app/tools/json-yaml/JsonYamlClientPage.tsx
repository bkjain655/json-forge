"use client"

import { useState, useEffect, useMemo } from "react"
import { JsonEditor } from "@/components/json-editor"
import { JsonOutput } from "@/components/json-output"
import { Button } from "@/components/ui/button"
import { ShareButton } from "@/components/ui/share-button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useSharedInput } from "@/hooks/use-shared-input"
import { useDebouncedValue } from "@/hooks/use-debounced-value"
import { RotateCw } from "lucide-react"
import { ToolHeader } from "@/components/tool-header"
import { dump as yamlDump, load as yamlLoad } from "js-yaml"

const JSON_SAMPLE = JSON.stringify(
  { name: "Product Name", price: 19.99, inStock: true, tags: ["electronics", "gadget"], dimensions: { width: 10, height: 5, unit: "cm" } },
  null,
  2,
)
const YAML_SAMPLE = `name: Product Name
price: 19.99
inStock: true
tags:
  - electronics
  - gadget
dimensions:
  width: 10
  height: 5
  unit: cm`

export default function JsonYamlClientPage() {
  const { initialValue } = useSharedInput()
  const [activeTab, setActiveTab] = useState("json-to-yaml")
  const [jsonInput, setJsonInput] = useState("")
  const [yamlInput, setYamlInput] = useState("")

  useEffect(() => {
    if (initialValue) {
      setJsonInput(initialValue)
      setActiveTab("json-to-yaml")
    }
  }, [initialValue])

  const debJson = useDebouncedValue(jsonInput)
  const jsonToYaml = useMemo(() => {
    if (!debJson.trim()) return { output: "", error: "" }
    let parsed: unknown
    try {
      parsed = JSON.parse(debJson)
    } catch {
      return { output: "", error: "Invalid JSON format" }
    }
    try {
      return { output: yamlDump(parsed, { indent: 2, lineWidth: -1, noRefs: true }), error: "" }
    } catch (e) {
      return { output: "", error: e instanceof Error ? `Error converting: ${e.message}` : "Error converting to YAML" }
    }
  }, [debJson])

  const debYaml = useDebouncedValue(yamlInput)
  const yamlToJson = useMemo(() => {
    if (!debYaml.trim()) return { output: "", parsed: null as unknown, error: "" }
    try {
      const parsed = yamlLoad(debYaml)
      if (parsed === undefined) return { output: "", parsed: null as unknown, error: "The YAML document is empty" }
      return { output: JSON.stringify(parsed, null, 2), parsed: parsed as unknown, error: "" }
    } catch (e) {
      return { output: "", parsed: null as unknown, error: e instanceof Error ? `Error converting: ${e.message}` : "Error converting to JSON" }
    }
  }, [debYaml])

  return (
    <div className="container mx-auto px-4 py-12">
      <ToolHeader
        icon={RotateCw}
        title="JSON ↔ YAML Converter"
        description="Convert freely between JSON and YAML, live as you type. Everything runs in your browser."
      />

      <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="json-to-yaml">JSON to YAML</TabsTrigger>
          <TabsTrigger value="yaml-to-json">YAML to JSON</TabsTrigger>
        </TabsList>

        <TabsContent value="json-to-yaml" className="mt-4 space-y-4">
          <div className="flex flex-wrap gap-2">
            <Button variant="ghost" size="sm" onClick={() => setJsonInput(JSON_SAMPLE)}>Load sample</Button>
            <ShareButton value={jsonInput} />
          </div>
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            <JsonEditor value={jsonInput} onChange={setJsonInput} label="JSON input" error={jsonToYaml.error} />
            <JsonOutput value={jsonToYaml.output} label="YAML output" fileType="yaml" emptyHint="Paste JSON on the left — YAML appears here instantly." />
          </div>
        </TabsContent>

        <TabsContent value="yaml-to-json" className="mt-4 space-y-4">
          <div className="flex flex-wrap gap-2">
            <Button variant="ghost" size="sm" onClick={() => setYamlInput(YAML_SAMPLE)}>Load sample</Button>
          </div>
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            <JsonEditor value={yamlInput} onChange={setYamlInput} label="YAML input" error={yamlToJson.error} lint={false} fileType="yaml" placeholder="Paste your YAML here..." />
            <JsonOutput value={yamlToJson.output} parsed={yamlToJson.parsed} label="JSON output" emptyHint="Paste YAML on the left — JSON appears here instantly." />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
