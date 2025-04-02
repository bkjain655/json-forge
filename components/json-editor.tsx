"use client"

import { useState, useEffect } from "react"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Copy, FileUp, Download, Trash } from "lucide-react"
import { cn } from "@/lib/utils"

interface JsonEditorProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  label?: string
  error?: string
  height?: string
  className?: string
  readOnly?: boolean
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
}: JsonEditorProps) {
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    if (copied) {
      const timeout = setTimeout(() => setCopied(false), 2000)
      return () => clearTimeout(timeout)
    }
  }, [copied])

  const handleCopy = () => {
    navigator.clipboard.writeText(value)
    setCopied(true)
  }

  const handleClear = () => {
    onChange("")
  }

  const handleUpload = () => {
    const input = document.createElement("input")
    input.type = "file"
    input.accept = ".json,.txt"
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0]
      if (!file) return

      const reader = new FileReader()
      reader.onload = (event) => {
        const content = event.target?.result as string
        onChange(content)
      }
      reader.readAsText(file)
    }
    input.click()
  }

  const handleDownload = () => {
    const blob = new Blob([value], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "data.json"
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  return (
    <div className={cn("space-y-2", className)}>
      {label && <div className="text-sm font-medium">{label}</div>}
      <div className="relative">
        <Textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={cn("font-mono resize-none p-4", height)}
          readOnly={readOnly}
        />
        <div className="absolute top-2 right-2 flex gap-1">
          <Button variant="ghost" size="icon" onClick={handleCopy} title="Copy to clipboard">
            <Copy className="h-4 w-4" />
          </Button>
          {!readOnly && (
            <Button variant="ghost" size="icon" onClick={handleClear} title="Clear">
              <Trash className="h-4 w-4" />
            </Button>
          )}
          {!readOnly && (
            <Button variant="ghost" size="icon" onClick={handleUpload} title="Upload JSON file">
              <FileUp className="h-4 w-4" />
            </Button>
          )}
          {value && (
            <Button variant="ghost" size="icon" onClick={handleDownload} title="Download JSON">
              <Download className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  )
}

