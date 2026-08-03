"use client"

import { useState } from "react"
import { JsonEditor } from "@/components/json-editor"
import { JsonTree } from "@/components/json-tree"
import { cn } from "@/lib/utils"

interface JsonOutputProps {
  /** Text form of the output (formatted string). */
  value: string
  /** Parsed value for the tree view; null/undefined disables the Tree tab. */
  parsed?: unknown
  label: string
  emptyHint?: string
  fileType?: string
  heightPx?: number
}

/**
 * Read-only result pane with a Text / Tree view toggle. Tree view is offered
 * only when a parsed value is available (i.e. the output is JSON).
 */
export function JsonOutput({ value, parsed, label, emptyHint, fileType = "json", heightPx }: JsonOutputProps) {
  const [view, setView] = useState<"text" | "tree">("text")
  const canTree = parsed !== null && parsed !== undefined

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-foreground">{label}</p>
        {canTree && (
          <div className="inline-flex rounded-md border border-border bg-secondary/40 p-0.5">
            {(["text", "tree"] as const).map((v) => (
              <button
                key={v}
                onClick={() => setView(v)}
                aria-pressed={view === v}
                className={cn(
                  "rounded-[5px] px-2.5 py-1 text-xs font-medium capitalize transition-colors",
                  view === v ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground",
                )}
              >
                {v}
              </button>
            ))}
          </div>
        )}
      </div>
      {view === "tree" && canTree ? (
        <JsonTree data={parsed as never} className="h-[400px]" />
      ) : (
        <JsonEditor value={value} onChange={() => {}} emptyHint={emptyHint} fileType={fileType} heightPx={heightPx} readOnly />
      )}
    </div>
  )
}
