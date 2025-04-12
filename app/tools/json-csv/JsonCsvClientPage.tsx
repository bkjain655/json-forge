"use client"

import { useState } from "react"
import { JsonEditor } from "@/components/json-editor"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { RotateCw } from "lucide-react";
import { Input } from "@/components/ui/input"

export default function JsonCsvClientPage() {
  const [json, setJson] = useState("")
  const [csv, setCsv] = useState("")
  const [activeTab, setActiveTab] = useState("json-to-csv")
  const [error, setError] = useState("")

  function jsonToCSV() {
    try {
      const objArray = JSON.parse(json);
      if (!Array.isArray(objArray)) throw new Error("JSON must be an array of objects");
  
      const headers = Object.keys(objArray[0]);
      const csvRows = [
        headers.join(","),
        ...objArray.map(row =>
          headers.map(field => JSON.stringify(row[field] ?? "")).join(",")
        ),
      ];
      setCsv(csvRows.join("\n"));
    } catch (error: any) {
      setError(`Error: ${error.message}`);
    }
  }
  
  function csvToJSON() {
    try {
      const [headerLine, ...lines] = csv.trim().split("\n");
      const headers = headerLine.split(",");
  
      const json = lines.map(line => {
        const values = line.split(",");
        return headers.reduce((acc, header, i) => {
          acc[header] = values[i]?.replace(/^"|"$/g, "");
          return acc;
        }, {} as Record<string, string>);
      });
  
      setJson(JSON.stringify(json, null, 2));
    } catch (error: any) {
      setError(`Error: ${error.message}`);
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

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, type: "csv" | "xml") => {
    const file = e.target.files?.[0];
    if (!file) return;
  
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const content = reader.result as string;
        setCsv(content);
        setJson("");
      } catch (err: any) {
        setCsv("");
      }
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
            onChange={setJson}
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
            <label className="font-medium text-gray-700">Upload CSV File</label>
            <Input type="file" accept=".csv" onChange={(e) => {
              handleFileUpload(e, "csv")
            }} />
          </div>

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

