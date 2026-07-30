"use client"

import { useState, useEffect, useId } from "react"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Copy, FileUp, Download, Trash } from "lucide-react"
import { MAX_INPUT_SIZE_LABEL, cn, isOverSizeLimit } from "@/lib/utils"

interface JsonEditorProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  label?: string
  error?: string
  height?: string
  className?: string
  readOnly?: boolean
  fileType?: string
}

export function JsonEditor({
  value,
  onChange,
  placeholder = "Paste your JSON here...",
  label,
  error,
  height = "h-[400px]",
  className,
  readOnly = false,
  fileType = "json",
}: JsonEditorProps) {
  const [copied, setCopied] = useState(false)
  const [sizeError, setSizeError] = useState("")
  const textareaId = useId()

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

  const handleCopy = () => {
    navigator.clipboard.writeText(value)
    setCopied(true)
  }

  const handleClear = () => {
    setSizeError("")
    onChange("")
  }

  const handleUpload = () => {
    const input = document.createElement("input")
    input.type = "file"
    input.accept = ".json,.txt"
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
  }

  const message = error || sizeError

  return (
    <div
      className={cn("space-y-2", className)}
      // Read-only editors are result panes - announce their content to screen readers.
      {...(readOnly ? { role: "status", "aria-live": "polite" as const } : {})}
    >
      {label && (
        <label htmlFor={textareaId} className="block text-sm font-medium">
          {label}
        </label>
      )}
      <div className="relative">
        <Textarea
          id={textareaId}
          value={value}
          onChange={(e) => handleValueChange(e.target.value)}
          placeholder={placeholder}
          className={cn("font-mono resize-none p-4", height)}
          readOnly={readOnly}
          aria-invalid={message ? true : undefined}
          aria-describedby={message ? `${textareaId}-message` : undefined}
        />
        <div className="absolute top-2 right-2 flex gap-1">
          <Button variant="ghost" size="icon" onClick={handleCopy} title="Copy to clipboard">
            <Copy className="h-4 w-4" />
            <span className="sr-only">{copied ? "Copied" : "Copy to clipboard"}</span>
          </Button>
          {!readOnly && (
            <Button variant="ghost" size="icon" onClick={handleClear} title="Clear">
              <Trash className="h-4 w-4" />
              <span className="sr-only">Clear</span>
            </Button>
          )}
          {!readOnly && (
            <Button variant="ghost" size="icon" onClick={handleUpload} title="Upload JSON file">
              <FileUp className="h-4 w-4" />
              <span className="sr-only">Upload file</span>
            </Button>
          )}
          {value && (
            <Button variant="ghost" size="icon" onClick={handleDownload} title="Download JSON">
              <Download className="h-4 w-4" />
              <span className="sr-only">Download</span>
            </Button>
          )}
        </div>
      </div>
      {message && (
        <p id={`${textareaId}-message`} role="alert" className="text-sm text-destructive">
          {message}
        </p>
      )}
    </div>
  )
}
