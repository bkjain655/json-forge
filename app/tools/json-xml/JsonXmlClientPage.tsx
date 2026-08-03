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
import { json2xml } from "xml-js"

const JSON_SAMPLE = JSON.stringify(
  { name: "Product Name", price: 19.99, inStock: true, tags: ["electronics", "gadget"], dimensions: { width: 10, height: 5, unit: "cm" } },
  null,
  2,
)
const XML_SAMPLE = `<product>
  <name>Product Name</name>
  <price>19.99</price>
  <inStock>true</inStock>
  <dimensions>
    <width>10</width>
    <height>5</height>
    <unit>cm</unit>
  </dimensions>
</product>`

// Browser-only (DOMParser); only ever invoked client-side with non-empty input.
function xmlToJsonValue(xml: string): unknown {
  const wrapped = `<?xml version="1.0" encoding="UTF-8"?>\n<root>${xml}</root>`
  const xmlDoc = new DOMParser().parseFromString(wrapped, "text/xml")
  const parserError = xmlDoc.getElementsByTagName("parsererror")[0]
  if (parserError) {
    const detail = (parserError.textContent ?? "").replace(/\s+/g, " ").trim()
    throw new Error(detail || "The XML is not well-formed")
  }
  function convert(node: Node): unknown {
    const obj: Record<string, unknown> = {}
    if (node.nodeType === 1) {
      if (node.childNodes.length === 1 && node.firstChild?.nodeType === 3) {
        return node.firstChild?.nodeValue?.trim()
      }
      for (const child of Array.from(node.childNodes)) {
        if (child.nodeType === 1) {
          const name = child.nodeName
          const childObj = convert(child)
          if (obj[name] !== undefined) {
            if (!Array.isArray(obj[name])) obj[name] = [obj[name]]
            ;(obj[name] as unknown[]).push(childObj)
          } else {
            obj[name] = childObj
          }
        }
      }
    }
    return obj
  }
  return convert(xmlDoc.getElementsByTagName("root")[0])
}

export default function JsonXmlClientPage() {
  const { initialValue } = useSharedInput()
  const [activeTab, setActiveTab] = useState("json-to-xml")
  const [jsonInput, setJsonInput] = useState("")
  const [xmlInput, setXmlInput] = useState("")

  useEffect(() => {
    if (initialValue) {
      setJsonInput(initialValue)
      setActiveTab("json-to-xml")
    }
  }, [initialValue])

  const debJson = useDebouncedValue(jsonInput)
  const jsonToXml = useMemo(() => {
    if (!debJson.trim()) return { output: "", error: "" }
    let parsed: unknown
    try {
      parsed = JSON.parse(debJson)
    } catch {
      return { output: "", error: "Invalid JSON format" }
    }
    try {
      return { output: json2xml(JSON.stringify(parsed), { compact: true, spaces: 2 }), error: "" }
    } catch (e) {
      return { output: "", error: e instanceof Error ? `Error converting: ${e.message}` : "Error converting to XML" }
    }
  }, [debJson])

  const debXml = useDebouncedValue(xmlInput)
  const xmlToJson = useMemo(() => {
    if (!debXml.trim()) return { output: "", parsed: null as unknown, error: "" }
    try {
      const value = xmlToJsonValue(debXml)
      return { output: JSON.stringify(value, null, 2), parsed: value, error: "" }
    } catch (e) {
      return { output: "", parsed: null as unknown, error: e instanceof Error ? `Error converting: ${e.message}` : "Error converting to JSON" }
    }
  }, [debXml])

  return (
    <div className="container mx-auto px-4 py-12">
      <ToolHeader
        icon={RotateCw}
        title="JSON ↔ XML Converter"
        description="Convert freely between JSON and XML, live as you type. Everything runs in your browser."
      />

      <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-8">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="json-to-xml">JSON to XML</TabsTrigger>
          <TabsTrigger value="xml-to-json">XML to JSON</TabsTrigger>
        </TabsList>

        <TabsContent value="json-to-xml" className="mt-4 space-y-4">
          <div className="flex flex-wrap gap-2">
            <Button variant="ghost" size="sm" onClick={() => setJsonInput(JSON_SAMPLE)}>Load sample</Button>
            <ShareButton value={jsonInput} />
          </div>
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            <JsonEditor value={jsonInput} onChange={setJsonInput} label="JSON input" error={jsonToXml.error} />
            <JsonOutput value={jsonToXml.output} label="XML output" fileType="xml" emptyHint="Paste JSON on the left — XML appears here instantly." />
          </div>
        </TabsContent>

        <TabsContent value="xml-to-json" className="mt-4 space-y-4">
          <div className="flex flex-wrap gap-2">
            <Button variant="ghost" size="sm" onClick={() => setXmlInput(XML_SAMPLE)}>Load sample</Button>
          </div>
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            <JsonEditor value={xmlInput} onChange={setXmlInput} label="XML input" error={xmlToJson.error} lint={false} fileType="xml" placeholder="Paste your XML here..." />
            <JsonOutput value={xmlToJson.output} parsed={xmlToJson.parsed} label="JSON output" emptyHint="Paste XML on the left — JSON appears here instantly." />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
