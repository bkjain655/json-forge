"use client"

import { useState } from "react"
import { JsonEditor } from "@/components/json-editor"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { RotateCw } from "lucide-react";
import { Input } from "@/components/ui/input"
import { MAX_INPUT_SIZE_LABEL, isOverSizeLimit } from "@/lib/utils"

export default function JsonCsvClientPage() {
  const [json, setJson] = useState("")
  const [csv, setCsv] = useState("")
  const [activeTab, setActiveTab] = useState("json-to-csv")
  const [error, setError] = useState("")

  // Clear stale errors as soon as the user provides new input.
  const handleJsonChange = (value: string) => {
    setError("")
    setJson(value)
  }

  const handleCsvChange = (value: string) => {
    setError("")
    setCsv(value)
  }

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
        // Swallow the \n of a \r\n pair.
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

  function jsonToCSV() {
    setError("")
    setCsv("")

    if (!json.trim()) {
      setError("Please enter JSON to convert")
      return
    }

    try {
      const objArray = JSON.parse(json)
      if (!Array.isArray(objArray)) throw new Error("JSON must be an array of objects")
      if (objArray.length === 0) throw new Error("JSON array is empty - nothing to convert")

      // Union of keys across every row, so rows with extra fields are not dropped.
      const headers: string[] = []
      for (const row of objArray) {
        if (row === null || typeof row !== "object" || Array.isArray(row)) {
          throw new Error("Every item in the JSON array must be an object")
        }
        for (const key of Object.keys(row)) {
          if (!headers.includes(key)) headers.push(key)
        }
      }

      const csvRows = [
        headers.map(escapeCsvValue).join(","),
        ...objArray.map((row) => headers.map((field) => escapeCsvValue(row[field])).join(",")),
      ]
      setCsv(csvRows.join("\n"))
    } catch (err) {
      setError(`Error: ${err instanceof Error ? err.message : "Could not convert JSON to CSV"}`)
    }
  }

  function csvToJSON() {
    setError("")
    setJson("")

    if (!csv.trim()) {
      setError("Please provide CSV to convert")
      return
    }

    try {
      const rows = parseCsv(csv)
      if (rows.length === 0) throw new Error("CSV is empty")

      const [headers, ...dataRows] = rows
      const parsed = dataRows.map((values) =>
        headers.reduce((acc, header, i) => {
          acc[header] = values[i] ?? ""
          return acc
        }, {} as Record<string, string>),
      )

      setJson(JSON.stringify(parsed, null, 2))
    } catch (err) {
      setError(`Error: ${err instanceof Error ? err.message : "Could not convert CSV to JSON"}`)
    }
  }

  // Sample data for demonstration
  const loadJsonSample = () => {
    setJson(
      JSON.stringify([{
          name: "Product Name",
          price: 19.99,
          inStock: true,
          tags: ["electronics", "gadget"],
          dimensions: {
            width: 10,
            height: 5,
            unit: "cm",
          },
        }],
        null,
        2,
      ),
    )
    setActiveTab("json-to-csv")
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setError("");

    if (isOverSizeLimit(file.size)) {
      setError(`File is too large. The maximum supported size is ${MAX_INPUT_SIZE_LABEL}.`);
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setCsv(reader.result as string);
      setJson("");
    };
    reader.onerror = () => {
      setError("Error reading the file.");
    }
    reader.readAsText(file);
  };
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="text-center mb-8">
        <RotateCw className="h-12 w-12 mx-auto mb-4 text-primary" />
        <h1 className="text-3xl font-bold mb-2">JSON ↔ CSV Converter</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Convert between JSON and CSV formats. Transform your data between these popular data serialization formats.
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-8">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="json-to-csv">JSON to CSV</TabsTrigger>
          <TabsTrigger value="csv-to-json">CSV to JSON</TabsTrigger>
        </TabsList>

        <TabsContent value="json-to-csv" className="space-y-6">
          <JsonEditor
            value={json}
            onChange={handleJsonChange}
            label="JSON Input"
            error={activeTab === "json-to-csv" ? error : ""}
          />

          <div className="flex justify-center">
            <Button onClick={jsonToCSV}>Convert to CSV</Button>
          </div>

          {csv && <JsonEditor fileType={'csv'} value={csv} onChange={() => {}} label="CSV Output" readOnly />}

          <div className="flex justify-center">
            <Button variant="outline" onClick={loadJsonSample}>
              Load Sample JSON
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="csv-to-json" className="space-y-6">
          <div className="flex flex-col gap-2">
            <label htmlFor="csv-file" className="font-medium">Upload CSV File</label>
            <Input id="csv-file" type="file" accept=".csv" onChange={handleFileUpload} />
          </div>

          <JsonEditor
            fileType={'csv'}
            value={csv}
            onChange={handleCsvChange}
            label="CSV Input"
            placeholder="Paste your CSV here..."
            error={activeTab === "csv-to-json" ? error : ""}
          />

          <div className="flex justify-center">
            <Button onClick={csvToJSON}>Convert to JSON</Button>
          </div>

          {json && <JsonEditor value={json} onChange={() => {}} label="JSON Output" readOnly />}

        </TabsContent>
      </Tabs>

      <div className="mt-12 max-w-3xl mx-auto">
        <h2 className="text-2xl font-bold mb-4">About JSON and CSV</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-xl font-semibold mb-2">JSON</h3>
            <p className="text-muted-foreground">
              JSON (JavaScript Object Notation) is a lightweight data-interchange format that is easy for humans to read
              and write and easy for machines to parse and generate.
            </p>
          </div>
          <div>
            <h3 className="text-xl font-semibold mb-2">CSV</h3>
            <p className="text-muted-foreground">
              CSV is a human-friendly data serialization standard that can be used in
              conjunction with all programming languages and is often used for configuration files.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

