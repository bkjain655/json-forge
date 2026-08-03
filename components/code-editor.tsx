"use client"

import { useEffect, useMemo, useState } from "react"
import CodeMirror, { EditorView } from "@uiw/react-codemirror"
import { json, jsonParseLinter } from "@codemirror/lang-json"
import { linter, lintGutter, type Diagnostic } from "@codemirror/lint"
import { useTheme } from "next-themes"
import { cn } from "@/lib/utils"

// Don't flag an empty editor as invalid JSON — only lint once there's content.
const jsonLinter = jsonParseLinter()
const emptyAwareJsonLinter = linter((view): Diagnostic[] =>
  view.state.doc.length === 0 ? [] : jsonLinter(view),
)

interface CodeEditorProps {
  value: string
  onChange?: (value: string) => void
  readOnly?: boolean
  /** Enable live JSON syntax-error markers (only for JSON input, not YAML/XML/CSV). */
  lint?: boolean
  placeholder?: string
  heightPx?: number
  ariaLabel?: string
  className?: string
}

// Blend CodeMirror into the surrounding card: transparent background, our type
// scale, no focus outline (the wrapper owns the focus ring).
const baseTheme = EditorView.theme({
  "&": { backgroundColor: "transparent", fontSize: "13px" },
  "&.cm-focused": { outline: "none" },
  ".cm-gutters": { backgroundColor: "transparent", border: "none" },
  ".cm-content": { fontFamily: "var(--font-mono, ui-monospace, SFMono-Regular, Menlo, monospace)" },
})

export function CodeEditor({
  value,
  onChange,
  readOnly = false,
  lint = false,
  placeholder,
  heightPx = 400,
  ariaLabel,
  className,
}: CodeEditorProps) {
  const { resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  const extensions = useMemo(() => {
    const base = [json(), EditorView.lineWrapping, baseTheme]
    if (lint && !readOnly) base.push(emptyAwareJsonLinter, lintGutter())
    return base
  }, [lint, readOnly])

  // Avoid SSR/hydration mismatch (theme is only known on the client).
  if (!mounted) {
    return (
      <div
        className={cn("rounded-md border border-input bg-muted/20", className)}
        style={{ height: heightPx }}
        aria-hidden="true"
      />
    )
  }

  return (
    <div
      className={cn(
        "overflow-hidden rounded-md border border-input bg-muted/20 focus-within:ring-1 focus-within:ring-ring",
        className,
      )}
    >
      <CodeMirror
        value={value}
        onChange={onChange}
        editable={!readOnly}
        readOnly={readOnly}
        placeholder={placeholder}
        height={`${heightPx}px`}
        theme={resolvedTheme === "dark" ? "dark" : "light"}
        extensions={extensions}
        aria-label={ariaLabel}
        basicSetup={{
          lineNumbers: true,
          foldGutter: true,
          highlightActiveLine: !readOnly,
          highlightActiveLineGutter: !readOnly,
          autocompletion: false,
          searchKeymap: false,
        }}
      />
    </div>
  )
}
