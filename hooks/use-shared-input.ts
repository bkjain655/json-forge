"use client"

import { useEffect, useState, useCallback } from "react"

// The encoded input lives in the URL *hash*, which browsers never send to the
// server - so sharing a link keeps the tool's "your data stays in your browser"
// promise intact. Base64url keeps it copy-paste safe.
const PARAM = "d"
// Rough ceiling so we never produce a link that browsers/servers will truncate.
const MAX_ENCODED_LENGTH = 8000

function toBase64Url(str: string): string {
  const bytes = new TextEncoder().encode(str)
  let binary = ""
  bytes.forEach((b) => (binary += String.fromCharCode(b)))
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "")
}

function fromBase64Url(b64: string): string {
  const padded = b64.replace(/-/g, "+").replace(/_/g, "/")
  const binary = atob(padded)
  const bytes = Uint8Array.from(binary, (c) => c.charCodeAt(0))
  return new TextDecoder().decode(bytes)
}

function readHashParam(): string | null {
  if (typeof window === "undefined") return null
  const hash = window.location.hash.replace(/^#/, "")
  const params = new URLSearchParams(hash)
  const raw = params.get(PARAM)
  if (!raw) return null
  try {
    return fromBase64Url(raw)
  } catch {
    return null
  }
}

export interface UseSharedInput {
  /** Decoded value from the URL on first client render, or null if none. */
  initialValue: string | null
  /** Build a shareable absolute URL for `value`, or null if it is too large. */
  createShareLink: (value: string) => string | null
}

/**
 * Reads a shareable input from the URL hash on mount and builds share links on
 * demand. Non-intrusive: tools keep their own state and only opt in.
 */
export function useSharedInput(): UseSharedInput {
  // Read only on the client, after mount, to avoid hydration mismatches.
  const [initialValue, setInitialValue] = useState<string | null>(null)

  useEffect(() => {
    setInitialValue(readHashParam())
  }, [])

  const createShareLink = useCallback((value: string): string | null => {
    if (typeof window === "undefined") return null
    const encoded = toBase64Url(value)
    if (encoded.length > MAX_ENCODED_LENGTH) return null
    const { origin, pathname, search } = window.location
    return `${origin}${pathname}${search}#${PARAM}=${encoded}`
  }, [])

  return { initialValue, createShareLink }
}
