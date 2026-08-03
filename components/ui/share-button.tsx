"use client"

import { useState, useEffect } from "react"
import { toast } from "sonner"
import { Check, Share2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useSharedInput } from "@/hooks/use-shared-input"

interface ShareButtonProps {
  /** The current input to encode into the shareable link. */
  value: string
  className?: string
}

/**
 * Copies a permalink that reloads the tool pre-filled with `value`. The payload
 * rides in the URL hash, so it never reaches a server.
 */
export function ShareButton({ value, className }: ShareButtonProps) {
  const { createShareLink } = useSharedInput()
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    if (copied) {
      const timeout = setTimeout(() => setCopied(false), 2000)
      return () => clearTimeout(timeout)
    }
  }, [copied])

  const handleShare = async () => {
    if (!value.trim()) {
      toast.error("Nothing to share yet - add some input first")
      return
    }
    const link = createShareLink(value)
    if (!link) {
      toast.error("Input is too large to share via a link")
      return
    }
    try {
      await navigator.clipboard.writeText(link)
      setCopied(true)
      toast.success("Share link copied to clipboard")
    } catch {
      toast.error("Couldn't copy - your browser blocked clipboard access")
    }
  }

  return (
    <Button variant="outline" onClick={handleShare} className={className}>
      {copied ? <Check className="mr-2 h-4 w-4 text-green-600 dark:text-green-500" /> : <Share2 className="mr-2 h-4 w-4" />}
      {copied ? "Link copied" : "Share"}
    </Button>
  )
}
