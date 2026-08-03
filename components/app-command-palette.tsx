"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useTheme } from "next-themes"
import {
  Home,
  GitCompare,
  GitMerge,
  FileCheck,
  FileJson,
  RotateCw,
  Code,
  Info,
  Mail,
  Sun,
  Moon,
  Laptop,
} from "lucide-react"
import {
  CommandDialog,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
} from "@/components/ui/command"

const OPEN_EVENT = "open-command-palette"

/** Open the command palette from anywhere (also reachable with ⌘K / Ctrl+K). */
export function openCommandPalette() {
  window.dispatchEvent(new Event(OPEN_EVENT))
}

const navItems = [
  { label: "Home", keywords: "start", icon: Home, href: "/" },
]

const toolItems = [
  { label: "JSON Compare", keywords: "diff difference", icon: GitCompare, href: "/tools/compare" },
  { label: "JSON Merge", keywords: "combine join", icon: GitMerge, href: "/tools/merge" },
  { label: "JSON Validator", keywords: "lint check verify", icon: FileCheck, href: "/tools/validate" },
  { label: "JSON Formatter", keywords: "beautify pretty minify indent", icon: FileJson, href: "/tools/formatter" },
  { label: "JSON to YAML", keywords: "convert yml", icon: RotateCw, href: "/tools/json-yaml" },
  { label: "JSON to XML", keywords: "convert", icon: RotateCw, href: "/tools/json-xml" },
  { label: "JSON to CSV", keywords: "convert spreadsheet excel", icon: RotateCw, href: "/tools/json-csv" },
  { label: "JSON Schema Generator", keywords: "generate structure", icon: Code, href: "/tools/schema-generator" },
]

const pageItems = [
  { label: "About", keywords: "info", icon: Info, href: "/about" },
  { label: "Contact", keywords: "email support", icon: Mail, href: "/contact-us" },
]

export function AppCommandPalette() {
  const router = useRouter()
  const { setTheme } = useTheme()
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault()
        setOpen((v) => !v)
      }
    }
    const onOpen = () => setOpen(true)
    document.addEventListener("keydown", onKey)
    window.addEventListener(OPEN_EVENT, onOpen)
    return () => {
      document.removeEventListener("keydown", onKey)
      window.removeEventListener(OPEN_EVENT, onOpen)
    }
  }, [])

  const run = (fn: () => void) => () => {
    setOpen(false)
    fn()
  }

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <CommandInput placeholder="Search tools, pages, theme…" />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>

        <CommandGroup heading="Navigation">
          {navItems.map((item) => (
            <CommandItem key={item.href} value={`${item.label} ${item.keywords}`} onSelect={run(() => router.push(item.href))}>
              <item.icon />
              <span>{item.label}</span>
            </CommandItem>
          ))}
        </CommandGroup>

        <CommandGroup heading="Tools">
          {toolItems.map((item) => (
            <CommandItem key={item.href} value={`${item.label} ${item.keywords}`} onSelect={run(() => router.push(item.href))}>
              <item.icon />
              <span>{item.label}</span>
            </CommandItem>
          ))}
        </CommandGroup>

        <CommandGroup heading="Pages">
          {pageItems.map((item) => (
            <CommandItem key={item.href} value={`${item.label} ${item.keywords}`} onSelect={run(() => router.push(item.href))}>
              <item.icon />
              <span>{item.label}</span>
            </CommandItem>
          ))}
        </CommandGroup>

        <CommandGroup heading="Theme">
          <CommandItem value="light theme appearance" onSelect={run(() => setTheme("light"))}>
            <Sun />
            <span>Light theme</span>
          </CommandItem>
          <CommandItem value="dark theme appearance" onSelect={run(() => setTheme("dark"))}>
            <Moon />
            <span>Dark theme</span>
          </CommandItem>
          <CommandItem value="system theme appearance auto" onSelect={run(() => setTheme("system"))}>
            <Laptop />
            <span>System theme</span>
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  )
}
