"use client"

import { useState } from "react"
import { JsonEditor } from "@/components/json-editor"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { isValidJson } from "@/lib/utils"
import { RotateCw } from "lucide-react";
import { json2xml } from "xml-js";

export default function JsonXmlClientPage() {
  const [json, setJson] = useState("")
  const [xml, setXml] = useState("")
  const [activeTab, setActiveTab] = useState("json-to-xml")
  const [error, setError] = useState("")

  const handleJsonToXml = () => {
    setError("")
    setXml("")

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
      // In a production app, you might want to use a library like js-xml
      const parsed = JSON.parse(json)
      const xmlResult = json2xml(parsed, { compact: true, spaces: 2 });
      setXml(xmlResult)
    } catch (err) {
      setError("Error converting JSON to XML")
    }
  }

  const handleXmlToJson = () => {
    setError("")
    setJson("")

    if (!xml.trim()) {
      setError("Please enter XML to convert")
      return
    }

    try {
      // Simple XML to JSON conversion
      // In a production app, you might want to use a library like js-xml
      const jsonResult = xml2Json(xml);
      setJson(JSON.stringify(jsonResult, null, 2))
    } catch (err) {
      setError("Error converting XML to JSON")
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
    setActiveTab("json-to-xml")
  }

  const loadXmlSample = () => {
    setXml(`<product><name>Product Name</name>
<price>19.99</price>
<inStock>true</inStock>
<tags>gadget</tags>
<tags>Electronics</tags>
<dimensions>
  <width>10</width>
  <height>5</height>
  <unit>cm</unit>
</dimensions><product>`)
    setActiveTab("xml-to-json")
  }

  const xml2Json = (xml: string) => {
    xml = `<?xml version="1.0" encoding="UTF-8"?>\n<root>` + xml + "</root>";
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xml, "text/xml");
    
    function convert(node: Node) {
        let obj = {};
        if (node.nodeType === 1) { // Element node
          if (node.childNodes.length === 1 && node.firstChild?.nodeType === 3) { // Text node
            return node.firstChild?.nodeValue?.trim();
          } else {
            for (let child of node.childNodes) {
              if (child.nodeType === 1) { // Element node
                const childName = child.nodeName;
                const childObj = convert(child);

                if ((obj as any)[childName]) {
                  if (!Array.isArray((obj as any)[childName])) {
                    (obj as any)[childName] = [(obj as any)[childName]];
                  }
                  (obj as any)[childName].push(childObj);
                } else {
                  (obj as any)[childName] = childObj;
                }
              }
            }
          }
        }
        return obj;
    }

    const root: Element = xmlDoc.getElementsByTagName("root")[0];
    let json = convert(root);
    return json;
}

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="text-center mb-8">
        <RotateCw className="h-12 w-12 mx-auto mb-4 text-primary" />
        <h1 className="text-3xl font-bold mb-2">JSON ↔ XML Converter</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Convert between JSON and XML formats. Transform your data between these popular data serialization formats.
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-8">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="json-to-xml">JSON to XML</TabsTrigger>
          <TabsTrigger value="xml-to-json">XML to JSON</TabsTrigger>
        </TabsList>

        <TabsContent value="json-to-xml" className="space-y-6">
          <JsonEditor
            value={json}
            onChange={setJson}
            label="JSON Input"
            error={activeTab === "json-to-xml" ? error : ""}
          />

          <div className="flex justify-center">
            <Button onClick={handleJsonToXml}>Convert to XML</Button>
          </div>

          {xml && <JsonEditor value={xml} onChange={() => {}} label="XML Output" readOnly />}

          <div className="flex justify-center">
            <Button variant="outline" onClick={loadJsonSample}>
              Load Sample JSON
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="xml-to-json" className="space-y-6">
          <JsonEditor
            value={xml}
            onChange={setXml}
            label="XML Input"
            error={activeTab === "xml-to-json" ? error : ""}
          />

          <div className="flex justify-center">
            <Button onClick={handleXmlToJson}>Convert to JSON</Button>
          </div>

          {json && <JsonEditor value={json} onChange={() => {}} label="JSON Output" readOnly />}

          <div className="flex justify-center">
            <Button variant="outline" onClick={loadXmlSample}>
              Load Sample XML
            </Button>
          </div>
        </TabsContent>
      </Tabs>

      <div className="mt-12 max-w-3xl mx-auto">
        <h2 className="text-2xl font-bold mb-4">About JSON and XML</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-xl font-semibold mb-2">JSON</h3>
            <p className="text-muted-foreground">
              JSON (JavaScript Object Notation) is a lightweight data-interchange format that is easy for humans to read
              and write and easy for machines to parse and generate.
            </p>
          </div>
          <div>
            <h3 className="text-xl font-semibold mb-2">XML</h3>
            <p className="text-muted-foreground">
              XML (XML Ain't Markup Language) is a human-friendly data serialization standard that can be used in
              conjunction with all programming languages and is often used for configuration files.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

