"use client"

import { useState } from "react"
import { ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"

type Json = string | number | boolean | null | Json[] | { [key: string]: Json }

function isExpandable(v: unknown): v is Json[] | Record<string, Json> {
  return typeof v === "object" && v !== null
}

function Leaf({ value }: { value: Exclude<Json, Json[] | object> }) {
  if (typeof value === "string") return <span className="text-green-600 dark:text-green-400">&quot;{value}&quot;</span>
  if (typeof value === "number") return <span className="text-primary">{value}</span>
  if (typeof value === "boolean") return <span className="text-amber-600 dark:text-amber-400">{String(value)}</span>
  return <span className="text-muted-foreground">null</span>
}

function TreeNode({
  name,
  value,
  depth,
  defaultExpanded = false,
}: {
  name?: string
  value: Json
  depth: number
  defaultExpanded?: boolean
}) {
  const [expanded, setExpanded] = useState(defaultExpanded || depth < 1)

  const keyLabel = name !== undefined && <span className="text-foreground">{name}: </span>

  if (!isExpandable(value)) {
    return (
      <div className="whitespace-pre" style={{ paddingLeft: depth * 14 }}>
        {keyLabel}
        <Leaf value={value} />
      </div>
    )
  }

  const isArray = Array.isArray(value)
  const entries = isArray
    ? (value as Json[]).map((v, i) => [String(i), v] as const)
    : Object.entries(value as Record<string, Json>)
  const count = entries.length
  const summary = isArray ? `[${count}]` : `{${count}}`

  return (
    <div>
      <button
        type="button"
        onClick={() => setExpanded((e) => !e)}
        aria-expanded={expanded}
        className="flex w-full items-center gap-1 rounded hover:bg-secondary/60"
        style={{ paddingLeft: depth * 14 }}
      >
        <ChevronRight className={cn("h-3.5 w-3.5 shrink-0 text-muted-foreground transition-transform", expanded && "rotate-90")} />
        {keyLabel}
        <span className="text-muted-foreground">{expanded ? (isArray ? "[" : "{") : summary}</span>
      </button>
      {expanded && (
        <>
          {entries.map(([k, v]) => (
            <TreeNode key={k} name={isArray ? undefined : k} value={v} depth={depth + 1} />
          ))}
          <div className="text-muted-foreground" style={{ paddingLeft: depth * 14 + 18 }}>
            {isArray ? "]" : "}"}
          </div>
        </>
      )}
    </div>
  )
}

/** Collapsible, type-colored tree view of a JSON value. */
export function JsonTree({ data, className }: { data: Json; className?: string }) {
  return (
    <div className={cn("overflow-auto rounded-md border border-input bg-muted/20 p-3 font-mono text-[13px] leading-relaxed", className)}>
      <TreeNode value={data} depth={0} defaultExpanded />
    </div>
  )
}
