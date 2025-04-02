"use client"

import { useState } from "react"
import { JsonEditor } from "@/components/json-editor"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { isValidJson } from "@/lib/utils"
import { RotateCw } from "lucide-react"

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

    if (!isValidJson(json)) {
      setError("Invalid JSON format")
      return
    }

    try {
      // We'll use a simple implementation here
      // In a production app, you might want to use a library like js-yaml
      const parsed = JSON.parse(json)
      const yamlResult = jsonToYaml(parsed)
      setYaml(yamlResult)
    } catch (err) {
      setError("Error converting JSON to YAML")
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
      // Simple YAML to JSON conversion
      // In a production app, you might want to use a library like js-yaml
      const jsonResult = yamlToJson(yaml)
      setJson(JSON.stringify(JSON.parse(jsonResult), null, 2))
    } catch (err) {
      setError("Error converting YAML to JSON")
    }
  }

  // Very basic JSON to YAML converter
  // For a production app, use a proper library
  const jsonToYaml = (obj: any, indent = 0): string => {
    if (obj === null) return "null\n"

    const spaces = " ".repeat(indent)
    let result = ""

    if (Array.isArray(obj)) {
      if (obj.length === 0) return "[]\n"

      for (const item of obj) {
        result += `${spaces}- `

        if (typeof item === "object" && item !== null) {
          if (Array.isArray(item)) {
            result += "\n" + jsonToYaml(item, indent + 2)
          } else {
            result += "\n"
            for (const [key, value] of Object.entries(item)) {
              result += `${spaces}  ${key}: `
              if (typeof value === "object" && value !== null) {
                result += "\n" + jsonToYaml(value, indent + 4).replace(/^/gm, spaces + "  ")
              } else {
                result += formatYamlValue(value) + "\n"
              }
            }
          }
        } else {
          result += formatYamlValue(item) + "\n"
        }
      }
    } else if (typeof obj === "object") {
      for (const [key, value] of Object.entries(obj)) {
        result += `${spaces}${key}: `

        if (typeof value === "object" && value !== null) {
          result += "\n" + jsonToYaml(value, indent + 2)
        } else {
          result += formatYamlValue(value) + "\n"
        }
      }
    } else {
      result += formatYamlValue(obj) + "\n"
    }

    return result
  }

  const formatYamlValue = (value: any): string => {
    if (typeof value === "string") {
      // Check if string needs quotes
      if (value.match(/[:#{}[\],&*?|<>=!%@`]/)) {
        return `"${value.replace(/"/g, '\\"')}"`
      }
      return value
    }
    return String(value)
  }

  // Very basic YAML to JSON converter
  // For a production app, use a proper library
  const yamlToJson = (yamlStr: string): string => {
    // This is a very simplified implementation
    // In a real app, use a proper YAML parser

    // Remove comments
    yamlStr = yamlStr.replace(/#.*$/gm, "")

    // Handle basic YAML to JSON conversion
    const jsonObj: any = {}
    let currentIndent = 0
    let currentPath: string[] = []

    const lines = yamlStr.split("\n")

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trimRight()
      if (!line.trim()) continue

      const indent = line.search(/\S/)
      const keyMatch = line.match(/^(\s*)([^:]+):\s*(.*)$/)

      if (keyMatch) {
        const [, , key, value] = keyMatch

        if (indent < currentIndent) {
          // Going back up in the hierarchy
          const levelsUp = (currentIndent - indent) / 2
          currentPath = currentPath.slice(0, -levelsUp)
        }

        currentIndent = indent

        if (value.trim()) {
          // Key with inline value
          setNestedValue(jsonObj, [...currentPath, key.trim()], parseYamlValue(value.trim()))
        } else {
          // Key with nested value
          currentPath.push(key.trim())
        }
      } else if (line.trim().startsWith("-")) {
        // Array item
        const value = line.trim().substring(1).trim()
        const arrayPath = [...currentPath]
        const arrayKey = arrayPath.pop() || ""

        let array = getNestedValue(jsonObj, arrayPath)[arrayKey]
        if (!Array.isArray(array)) {
          array = []
          setNestedValue(jsonObj, arrayPath, arrayKey)
        }

        array.push(parseYamlValue(value))
      }
    }

    return JSON.stringify(jsonObj)
  }

  const parseYamlValue = (value: string): any => {
    if (value === "null") return null
    if (value === "true") return true
    if (value === "false") return false
    if (value.match(/^-?\d+$/)) return Number.parseInt(value, 10)
    if (value.match(/^-?\d+\.\d+$/)) return Number.parseFloat(value)

    // Handle quoted strings
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
      return value.substring(1, value.length - 1)
    }

    return value
  }

  const setNestedValue = (obj: any, path: string[], value: any): void => {
    const lastKey = path.pop()

    let current = obj
    for (const key of path) {
      if (!current[key]) current[key] = {}
      current = current[key]
    }

    if (lastKey) current[lastKey] = value
  }

  const getNestedValue = (obj: any, path: string[]): any => {
    let current = obj
    for (const key of path) {
      if (!current[key]) current[key] = {}
      current = current[key]
    }
    return current
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
              YAML (YAML Ain't Markup Language) is a human-friendly data serialization standard that can be used in
              conjunction with all programming languages and is often used for configuration files.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

