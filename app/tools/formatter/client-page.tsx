"use client"

import { useState, useEffect, useMemo } from "react"
import { JsonEditor } from "@/components/json-editor"
import { JsonOutput } from "@/components/json-output"
import { ToolHeader } from "@/components/tool-header"
import { Button } from "@/components/ui/button"
import { ShareButton } from "@/components/ui/share-button"
import { Slider } from "@/components/ui/slider"
import { tryParseJson, cn } from "@/lib/utils"
import { useSharedInput } from "@/hooks/use-shared-input"
import { useDebouncedValue } from "@/hooks/use-debounced-value"
import { FileJson } from "lucide-react"

type Mode = "beautify" | "minify"

export default function JsonFormatterClientPage() {
  const { initialValue } = useSharedInput()
  const [json, setJson] = useState("")
  const [indentation, setIndentation] = useState(2)
  const [mode, setMode] = useState<Mode>("beautify")

  // Hydrate from a shared permalink on first client render.
  useEffect(() => {
    if (initialValue) setJson(initialValue)
  }, [initialValue])

  // Live: reformat as the user types (input debounced for large payloads).
  const debouncedJson = useDebouncedValue(json)
  const { output, parsed, error } = useMemo(() => {
    if (!debouncedJson.trim()) return { output: "", parsed: null as unknown, error: "" }
    const result = tryParseJson(debouncedJson)
    if (!result.ok) return { output: "", parsed: null as unknown, error: result.error }
    return {
      output: mode === "minify" ? JSON.stringify(result.value) : JSON.stringify(result.value, null, indentation),
      parsed: result.value as unknown,
      error: "",
    }
  }, [debouncedJson, mode, indentation])

  const loadSampleData = () => {
    setJson(
      '{"name":"John Doe","age":30,"isActive":true,"address":{"street":"123 Main St","city":"New York","zip":"10001"},"phoneNumbers":[{"type":"home","number":"212-555-1234"},{"type":"work","number":"646-555-4567"}]}',
    )
  }

  return (
    <div className="container mx-auto px-4">
      <div className="py-10 sm:py-14">
        <ToolHeader
          icon={FileJson}
          title="JSON Formatter"
          description="Beautify or minify your JSON — formatted live as you type. Runs entirely in your browser."
        />

        {/* Controls */}
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <div className="inline-flex rounded-md border border-border bg-secondary/40 p-0.5">
              {(["beautify", "minify"] as Mode[]).map((m) => (
                <button
                  key={m}
                  onClick={() => setMode(m)}
                  aria-pressed={mode === m}
                  className={cn(
                    "rounded-[5px] px-3 py-1.5 text-sm font-medium capitalize transition-colors",
                    mode === m ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  {m}
                </button>
              ))}
            </div>
            {mode === "beautify" && (
              <div className="flex items-center gap-3">
                <span className="text-sm text-muted-foreground">Indent</span>
                <Slider
                  value={[indentation]}
                  min={1}
                  max={8}
                  step={1}
                  onValueChange={(value) => setIndentation(value[0])}
                  className="w-28"
                  aria-label="Indentation"
                />
                <span className="w-4 text-sm font-medium tabular-nums text-muted-foreground">{indentation}</span>
              </div>
            )}
          </div>
          <div className="flex flex-wrap gap-2">
            <Button variant="ghost" size="sm" onClick={loadSampleData}>Load sample</Button>
            <ShareButton value={json} />
          </div>
        </div>

        {/* Editors */}
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <JsonEditor value={json} onChange={setJson} label="JSON input" error={error} />
          <JsonOutput
            value={output}
            parsed={parsed}
            label={mode === "minify" ? "Minified output" : "Formatted output"}
            emptyHint="Start typing valid JSON on the left — the result appears here instantly."
          />
        </div>
      </div>
    </div>
  )
}
