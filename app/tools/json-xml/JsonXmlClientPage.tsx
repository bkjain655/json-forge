"use client"

import { useState, useEffect } from "react"
import { JsonEditor } from "@/components/json-editor"
import { Button } from "@/components/ui/button"
import { ShareButton } from "@/components/ui/share-button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { tryParseJson } from "@/lib/utils"
import { useSharedInput } from "@/hooks/use-shared-input"
import { RotateCw } from "lucide-react";
import { ToolHeader } from "@/components/tool-header"
import { json2xml } from "xml-js";

export default function JsonXmlClientPage() {
  const { initialValue } = useSharedInput()
  const [json, setJson] = useState("")
  const [xml, setXml] = useState("")
  const [activeTab, setActiveTab] = useState("json-to-xml")
  const [error, setError] = useState("")

  // Hydrate the JSON input from a shared permalink on first client render.
  useEffect(() => {
    if (initialValue) {
      setJson(initialValue)
      setActiveTab("json-to-xml")
    }
  }, [initialValue])

  const handleJsonToXml = () => {
    setError("")
    setXml("")

    if (!json.trim()) {
      setError("Please enter JSON to convert")
      return
    }

    const parsed = tryParseJson(json)
    if (!parsed.ok) {
      setError(parsed.error)
      return
    }

    try {
      const xmlResult = json2xml(parsed.value, { compact: true, spaces: 2 });
      setXml(xmlResult)
    } catch (err) {
      setError(err instanceof Error ? `Error converting JSON to XML: ${err.message}` : "Error converting JSON to XML")
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
      const jsonResult = xml2Json(xml);
      setJson(JSON.stringify(jsonResult, null, 2))
    } catch (err) {
      setError(err instanceof Error ? `Error converting XML to JSON: ${err.message}` : "Error converting XML to JSON")
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
</dimensions></product>`)
    setActiveTab("xml-to-json")
  }

  const xml2Json = (xml: string) => {
    xml = `<?xml version="1.0" encoding="UTF-8"?>\n<root>` + xml + "</root>";
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xml, "text/xml");

    // DOMParser never throws - it reports failures as a <parsererror> element.
    const parserError = xmlDoc.getElementsByTagName("parsererror")[0];
    if (parserError) {
      const detail = (parserError.textContent ?? "").replace(/\s+/g, " ").trim();
      throw new Error(detail || "The XML is not well-formed");
    }
    
    function convert(node: Node) {
        const obj = {};
        if (node.nodeType === 1) { // Element node
          if (node.childNodes.length === 1 && node.firstChild?.nodeType === 3) { // Text node
            return node.firstChild?.nodeValue?.trim();
          } else {
            for (const child of node.childNodes) {
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
    const json = convert(root);
    return json;
}

  return (
    <div className="container mx-auto px-4 py-12">
      <ToolHeader
        icon={RotateCw}
        title="JSON ↔ XML Converter"
        description="Convert freely between JSON and XML — two of the most common data serialization formats."
      />

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

          <div className="flex flex-wrap justify-center gap-4">
            <Button onClick={handleJsonToXml}>Convert to XML</Button>
            <ShareButton value={json} />
          </div>

          {xml && <JsonEditor fileType={'xml'} value={xml} onChange={() => {}} label="XML Output" readOnly />}

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
            lint={false}
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

    </div>
  )
}

