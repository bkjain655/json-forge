"use client"

import { useState, useEffect, useMemo } from "react"
import { JsonEditor } from "@/components/json-editor"
import { JsonOutput } from "@/components/json-output"
import { Button } from "@/components/ui/button"
import { ShareButton } from "@/components/ui/share-button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { RotateCw } from "lucide-react"
import { ToolHeader } from "@/components/tool-header"
import { Input } from "@/components/ui/input"
import { MAX_INPUT_SIZE_LABEL, isOverSizeLimit } from "@/lib/utils"
import { useSharedInput } from "@/hooks/use-shared-input"
import { useDebouncedValue } from "@/hooks/use-debounced-value"

const JSON_SAMPLE = JSON.stringify(
  [
    { name: "Keyboard", price: 49.99, inStock: true },
    { name: "Mouse", price: 19.99, inStock: false },
  ],
  null,
  2,
)

/** RFC 4180: wrap in quotes when the value contains a comma, quote or newline. */
function escapeCsvValue(value: unknown): string {
  if (value === null || value === undefined) return ""
  const raw = typeof value === "object" ? JSON.stringify(value) : String(value)
  return /[",\r\n]/.test(raw) ? `"${raw.replace(/"/g, '""')}"` : raw
}

/** RFC 4180 parser: understands quoted fields, escaped quotes and embedded newlines. */
function parseCsv(input: string): string[][] {
  const rows: string[][] = []
  let row: string[] = []
  let field = ""
  let inQuotes = false

  for (let i = 0; i < input.length; i++) {
    const char = input[i]
    if (inQuotes) {
      if (char === '"') {
        if (input[i + 1] === '"') {
          field += '"'
          i++
        } else {
          inQuotes = false
        }
      } else {
        field += char
      }
      continue
    }
    if (char === '"') {
      inQuotes = true
    } else if (char === ",") {
      row.push(field)
      field = ""
    } else if (char === "\n" || char === "\r") {
      if (char === "\r" && input[i + 1] === "\n") i++
      row.push(field)
      rows.push(row)
      row = []
      field = ""
    } else {
      field += char
    }
  }
  if (inQuotes) throw new Error("Unterminated quoted field in CSV")
  if (field !== "" || row.length > 0) {
    row.push(field)
    rows.push(row)
  }
  return rows.filter((r) => r.some((cell) => cell !== ""))
}

export default function JsonCsvClientPage() {
  const { initialValue } = useSharedInput()
  const [activeTab, setActiveTab] = useState("json-to-csv")
  const [jsonInput, setJsonInput] = useState("")
  const [csvInput, setCsvInput] = useState("")
  const [uploadError, setUploadError] = useState("")

  useEffect(() => {
    if (initialValue) {
      setJsonInput(initialValue)
      setActiveTab("json-to-csv")
    }
  }, [initialValue])

  const debJson = useDebouncedValue(jsonInput)
  const jsonToCsv = useMemo(() => {
    if (!debJson.trim()) return { output: "", error: "" }
    let arr: unknown
    try {
      arr = JSON.parse(debJson)
    } catch {
      return { output: "", error: "Invalid JSON format" }
    }
    try {
      if (!Array.isArray(arr)) throw new Error("JSON must be an array of objects")
      if (arr.length === 0) throw new Error("JSON array is empty - nothing to convert")
      const headers: string[] = []
      for (const item of arr) {
        if (item === null || typeof item !== "object" || Array.isArray(item)) {
          throw new Error("Every item in the JSON array must be an object")
        }
        for (const key of Object.keys(item)) if (!headers.includes(key)) headers.push(key)
      }
      const rows = [
        headers.map(escapeCsvValue).join(","),
        ...arr.map((item) => headers.map((f) => escapeCsvValue((item as Record<string, unknown>)[f])).join(",")),
      ]
      return { output: rows.join("\n"), error: "" }
    } catch (e) {
      return { output: "", error: e instanceof Error ? e.message : "Could not convert JSON to CSV" }
    }
  }, [debJson])

  const debCsv = useDebouncedValue(csvInput)
  const csvToJson = useMemo(() => {
    if (!debCsv.trim()) return { output: "", parsed: null as unknown, error: "" }
    try {
      const rows = parseCsv(debCsv)
      if (rows.length === 0) throw new Error("CSV is empty")
      const [headers, ...dataRows] = rows
      const parsed = dataRows.map((values) =>
        headers.reduce((acc, header, i) => {
          acc[header] = values[i] ?? ""
          return acc
        }, {} as Record<string, string>),
      )
      return { output: JSON.stringify(parsed, null, 2), parsed: parsed as unknown, error: "" }
    } catch (e) {
      return { output: "", parsed: null as unknown, error: e instanceof Error ? e.message : "Could not convert CSV to JSON" }
    }
  }, [debCsv])

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploadError("")
    if (isOverSizeLimit(file.size)) {
      setUploadError(`File is too large. The maximum supported size is ${MAX_INPUT_SIZE_LABEL}.`)
      return
    }
    const reader = new FileReader()
    reader.onload = () => setCsvInput(reader.result as string)
    reader.onerror = () => setUploadError("Error reading the file.")
    reader.readAsText(file)
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <ToolHeader
        icon={RotateCw}
        title="JSON ↔ CSV Converter"
        description="Convert freely between JSON and CSV, live as you type. Arrays of objects become spreadsheet rows and back."
      />

      <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-8">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="json-to-csv">JSON to CSV</TabsTrigger>
          <TabsTrigger value="csv-to-json">CSV to JSON</TabsTrigger>
        </TabsList>

        <TabsContent value="json-to-csv" className="mt-4 space-y-4">
          <div className="flex flex-wrap gap-2">
            <Button variant="ghost" size="sm" onClick={() => setJsonInput(JSON_SAMPLE)}>Load sample</Button>
            <ShareButton value={jsonInput} />
          </div>
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            <JsonEditor value={jsonInput} onChange={setJsonInput} label="JSON input (array of objects)" error={jsonToCsv.error} />
            <JsonOutput value={jsonToCsv.output} label="CSV output" fileType="csv" emptyHint="Paste a JSON array on the left — CSV appears here instantly." />
          </div>
        </TabsContent>

        <TabsContent value="csv-to-json" className="mt-4 space-y-4">
          <div className="flex flex-col gap-2">
            <label htmlFor="csv-file" className="text-sm font-medium">Upload a CSV file (optional)</label>
            <Input id="csv-file" type="file" accept=".csv" onChange={handleFileUpload} className="max-w-sm" />
            {uploadError && <p className="text-sm text-destructive">{uploadError}</p>}
          </div>
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            <JsonEditor value={csvInput} onChange={setCsvInput} label="CSV input" error={csvToJson.error} lint={false} fileType="csv" placeholder="Paste your CSV here..." />
            <JsonOutput value={csvToJson.output} parsed={csvToJson.parsed} label="JSON output" emptyHint="Paste or upload CSV on the left — JSON appears here instantly." />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
