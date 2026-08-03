"use client"

import { useState, useEffect } from "react"
import { JsonEditor } from "@/components/json-editor"
import { JsonTree } from "@/components/json-tree"
import { ToolHeader } from "@/components/tool-header"
import { Button } from "@/components/ui/button"
import { ShareButton } from "@/components/ui/share-button"
import { Slider } from "@/components/ui/slider"
import { tryParseJson, cn } from "@/lib/utils"
import { useSharedInput } from "@/hooks/use-shared-input"
import { FileJson } from "lucide-react"

type Mode = "beautify" | "minify"
type OutputView = "text" | "tree"

export default function JsonFormatterClientPage() {
  const { initialValue } = useSharedInput()
  const [json, setJson] = useState("")
  const [formattedJson, setFormattedJson] = useState("")
  const [parsed, setParsed] = useState<unknown>(null)
  const [outputView, setOutputView] = useState<OutputView>("text")
  const [indentation, setIndentation] = useState(2)
  const [mode, setMode] = useState<Mode>("beautify")
  const [error, setError] = useState("")

  // Hydrate from a shared permalink on first client render.
  useEffect(() => {
    if (initialValue) setJson(initialValue)
  }, [initialValue])

  // Live: reformat as the user types / changes options (debounced for large input).
  useEffect(() => {
    const id = setTimeout(() => {
      if (!json.trim()) {
        setError("")
        setFormattedJson("")
        setParsed(null)
        return
      }
      const result = tryParseJson(json)
      if (!result.ok) {
        setError(result.error)
        setFormattedJson("")
        setParsed(null)
        return
      }
      setError("")
      setParsed(result.value)
      setFormattedJson(mode === "minify" ? JSON.stringify(result.value) : JSON.stringify(result.value, null, indentation))
    }, 150)
    return () => clearTimeout(id)
  }, [json, indentation, mode])

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
            {/* Mode toggle */}
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

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-foreground">
                {mode === "minify" ? "Minified output" : "Formatted output"}
              </p>
              {/* Text / Tree view toggle */}
              <div className="inline-flex rounded-md border border-border bg-secondary/40 p-0.5">
                {(["text", "tree"] as OutputView[]).map((v) => (
                  <button
                    key={v}
                    onClick={() => setOutputView(v)}
                    aria-pressed={outputView === v}
                    className={cn(
                      "rounded-[5px] px-2.5 py-1 text-xs font-medium capitalize transition-colors",
                      outputView === v ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground",
                    )}
                  >
                    {v}
                  </button>
                ))}
              </div>
            </div>
            {outputView === "tree" && parsed !== null ? (
              <JsonTree data={parsed as never} className="h-[400px]" />
            ) : (
              <JsonEditor
                value={formattedJson}
                onChange={() => {}}
                emptyHint="Start typing valid JSON on the left — the result appears here instantly."
                readOnly
              />
            )}
          </div>
        </div>

      </div>
    </div>
  )
}
