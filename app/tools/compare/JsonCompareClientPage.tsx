"use client"

import { useState, useMemo } from "react"
import { JsonEditor } from "@/components/json-editor"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { compareJson, tryParseJson, type JsonDiff } from "@/lib/utils"
import { GitCompare, CheckCircle } from "lucide-react"
import { ToolHeader } from "@/components/tool-header"
import { useDebouncedValue } from "@/hooks/use-debounced-value"

export default function JsonCompareClientPage() {
  const [json1, setJson1] = useState("")
  const [json2, setJson2] = useState("")

  const debJson1 = useDebouncedValue(json1)
  const debJson2 = useDebouncedValue(json2)

  const { result, error1, error2 } = useMemo(() => {
    const p1 = debJson1.trim() ? tryParseJson(debJson1) : null
    const p2 = debJson2.trim() ? tryParseJson(debJson2) : null
    const error1 = p1 && !p1.ok ? p1.error : ""
    const error2 = p2 && !p2.ok ? p2.error : ""
    if (!p1 || !p2 || !p1.ok || !p2.ok) return { result: null as JsonDiff | null, error1, error2 }
    return { result: compareJson(debJson1, debJson2), error1: "", error2: "" }
  }, [debJson1, debJson2])

  const identical =
    result && !Object.keys(result.added).length && !Object.keys(result.removed).length && !Object.keys(result.modified).length

  const loadSampleData = () => {
    setJson1(JSON.stringify({ name: "John Doe", age: 30, address: { street: "123 Main St", city: "New York", zip: "10001" }, hobbies: ["reading", "gaming"] }, null, 2))
    setJson2(JSON.stringify({ name: "John Doe", age: 31, address: { street: "456 Park Ave", city: "New York", zip: "10001", country: "USA" }, hobbies: ["reading", "traveling"], email: "john@example.com" }, null, 2))
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <ToolHeader
        icon={GitCompare}
        title="JSON Compare"
        description="Compare two JSON objects live — see exactly what was added, removed, or modified as you type."
      />

      <div className="mb-4 flex flex-wrap gap-2">
        <Button variant="ghost" size="sm" onClick={loadSampleData}>Load sample</Button>
      </div>

      <div className="mb-8 grid grid-cols-1 gap-4 lg:grid-cols-2">
        <JsonEditor value={json1} onChange={setJson1} label="First JSON" error={error1} />
        <JsonEditor value={json2} onChange={setJson2} label="Second JSON" error={error2} />
      </div>

      {result && (
        <div className="space-y-4" role="status" aria-live="polite">
          <h2 className="text-lg font-semibold tracking-tight">Differences</h2>
          {identical ? (
            <div className="flex items-center gap-2 rounded-md border border-green-600/30 bg-green-500/10 px-3 py-2 text-sm text-green-700 dark:text-green-300">
              <CheckCircle className="h-4 w-4" /> The two documents are structurally identical.
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <DiffCard title="Added" tone="text-green-600 dark:text-green-400" data={result.added} empty="Nothing added" />
              <DiffCard title="Removed" tone="text-destructive" data={result.removed} empty="Nothing removed" />
              <DiffCard title="Modified" tone="text-primary" data={result.modified} empty="Nothing modified" />
            </div>
          )}
        </div>
      )}
    </div>
  )
}

function DiffCard({ title, tone, data, empty }: { title: string; tone: string; data: Record<string, unknown>; empty: string }) {
  const has = Object.keys(data).length > 0
  return (
    <Card className="p-4">
      <h3 className={`mb-2 text-sm font-semibold ${tone}`}>
        {title} {has && <span className="text-muted-foreground">({Object.keys(data).length})</span>}
      </h3>
      {has ? (
        <pre className="max-h-[300px] overflow-auto rounded-md bg-muted p-3 font-mono text-xs">{JSON.stringify(data, null, 2)}</pre>
      ) : (
        <p className="text-sm text-muted-foreground">{empty}</p>
      )}
    </Card>
  )
}
