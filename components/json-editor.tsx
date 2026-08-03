"use client"

import { useState, useEffect } from "react"
import dynamic from "next/dynamic"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { EmptyState } from "@/components/ui/empty-state"
import { Copy, Check, FileUp, Download, Trash, FileJson } from "lucide-react"
import { MAX_INPUT_SIZE_LABEL, cn, isOverSizeLimit } from "@/lib/utils"

// Lazy-load CodeMirror so its ~140kB stays out of each tool route's initial
// bundle. The page shell renders immediately; the editor streams in after.
const CodeEditor = dynamic(() => import("@/components/code-editor").then((m) => m.CodeEditor), {
  ssr: false,
  loading: () => (
    <div className="animate-pulse rounded-md border border-input bg-muted/20" style={{ height: 400 }} aria-hidden="true" />
  ),
})

interface JsonEditorProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  label?: string
  error?: string
  /** Editor body height in pixels. */
  heightPx?: number
  className?: string
  readOnly?: boolean
  fileType?: string
  /** Enable live JSON syntax-error markers. Defaults on for editable JSON inputs. */
  lint?: boolean
  /** Shown in the empty placeholder for read-only result panes. */
  emptyHint?: string
}

export function JsonEditor({
  value,
  onChange,
  placeholder = "Paste your JSON here...",
  label,
  error,
  heightPx = 400,
  className,
  readOnly = false,
  fileType = "json",
  lint,
  emptyHint = "Run the tool to see the result here.",
}: JsonEditorProps) {
  const [copied, setCopied] = useState(false)
  const [sizeError, setSizeError] = useState("")

  useEffect(() => {
    if (copied) {
      const timeout = setTimeout(() => setCopied(false), 2000)
      return () => clearTimeout(timeout)
    }
  }, [copied])

  const tooLargeMessage = `Input is too large. The maximum supported size is ${MAX_INPUT_SIZE_LABEL} - everything is parsed in your browser, so bigger inputs would freeze the page.`

  const handleValueChange = (next: string) => {
    if (isOverSizeLimit(next)) {
      setSizeError(tooLargeMessage)
      return
    }
    setSizeError("")
    onChange(next)
  }

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(value)
      setCopied(true)
      toast.success("Copied to clipboard")
    } catch {
      toast.error("Couldn't copy - your browser blocked clipboard access")
    }
  }

  const handleClear = () => {
    setSizeError("")
    onChange("")
  }

  const handleUpload = () => {
    const input = document.createElement("input")
    input.type = "file"
    input.accept = ".json,.txt,.yaml,.yml,.xml,.csv"
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0]
      if (!file) return

      if (isOverSizeLimit(file.size)) {
        setSizeError(tooLargeMessage)
        return
      }

      const reader = new FileReader()
      reader.onload = (event) => {
        handleValueChange(event.target?.result as string)
      }
      reader.onerror = () => setSizeError("Could not read the selected file.")
      reader.readAsText(file)
    }
    input.click()
  }

  const handleDownload = () => {
    const blob = new Blob([value], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `data.${fileType}`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    toast.success(`Downloaded data.${fileType}`)
  }

  const message = error || sizeError
  const showEmptyState = readOnly && !value
  // Lint editable JSON inputs by default; callers pass lint={false} for YAML/XML/CSV.
  const lintEnabled = lint ?? (!readOnly && fileType === "json")

  return (
    <div
      className={cn("space-y-2", className)}
      // Read-only editors are result panes - announce their content to screen readers.
      {...(readOnly ? { role: "status", "aria-live": "polite" as const } : {})}
    >
      {label && <p className="text-sm font-medium text-foreground">{label}</p>}
      {showEmptyState ? (
        <EmptyState
          icon={FileJson}
          title="No output yet"
          description={emptyHint}
          className="flex"
          style={{ height: heightPx }}
        />
      ) : (
        <div className="relative">
          <CodeEditor
            value={value}
            onChange={readOnly ? undefined : handleValueChange}
            readOnly={readOnly}
            lint={lintEnabled}
            placeholder={placeholder}
            heightPx={heightPx}
            ariaLabel={label}
          />
          <div className="absolute right-2 top-2 z-10 flex gap-1">
            <Button variant="ghost" size="icon" onClick={handleCopy} disabled={!value} title="Copy to clipboard">
              {copied ? <Check className="h-4 w-4 text-green-600 dark:text-green-500" /> : <Copy className="h-4 w-4" />}
              <span className="sr-only">{copied ? "Copied" : "Copy to clipboard"}</span>
            </Button>
            {!readOnly && (
              <Button variant="ghost" size="icon" onClick={handleClear} disabled={!value} title="Clear">
                <Trash className="h-4 w-4" />
                <span className="sr-only">Clear</span>
              </Button>
            )}
            {!readOnly && (
              <Button variant="ghost" size="icon" onClick={handleUpload} title="Upload file">
                <FileUp className="h-4 w-4" />
                <span className="sr-only">Upload file</span>
              </Button>
            )}
            {value && (
              <Button variant="ghost" size="icon" onClick={handleDownload} title="Download">
                <Download className="h-4 w-4" />
                <span className="sr-only">Download</span>
              </Button>
            )}
          </div>
        </div>
      )}
      {message && (
        <p role="alert" className="text-sm text-destructive">
          {message}
        </p>
      )}
    </div>
  )
}
