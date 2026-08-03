"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Braces, Menu, Search, ChevronDown, X, ArrowUpRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Kbd } from "@/components/ui/kbd"
import { ModeToggle } from "@/components/mode-toggle"
import { openCommandPalette } from "@/components/app-command-palette"
import { AUTHOR_NAME, AUTHOR_URL } from "@/lib/constants"
import { cn } from "@/lib/utils"

const tools = [
  { name: "JSON Compare", href: "/tools/compare" },
  { name: "JSON Merge", href: "/tools/merge" },
  { name: "JSON Validator", href: "/tools/validate" },
  { name: "JSON Formatter", href: "/tools/formatter" },
  { name: "JSON to YAML", href: "/tools/json-yaml" },
  { name: "JSON to XML", href: "/tools/json-xml" },
  { name: "JSON to CSV", href: "/tools/json-csv" },
  { name: "JSON Schema Generator", href: "/tools/schema-generator" },
]

export default function Header() {
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [toolsOpen, setToolsOpen] = useState(false)

  // Close menus on navigation.
  useEffect(() => {
    setMobileOpen(false)
    setToolsOpen(false)
  }, [pathname])

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border bg-background/80 backdrop-blur-md">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center gap-6">
          {/* Logo */}
          <Link href="/" aria-label="JSON Forge home" className="flex items-center gap-2.5">
            <span className="grid h-9 w-9 place-items-center rounded-lg bg-primary text-primary-foreground shadow-sm">
              <Braces className="h-5 w-5" />
            </span>
            <span className="text-[15px] font-semibold tracking-tight">JSON Forge</span>
          </Link>

          {/* Desktop nav — left-aligned, product-focused */}
          <nav className="hidden items-center gap-1 md:flex">
            <NavLink href="/" active={pathname === "/"}>Home</NavLink>
            <div className="relative" onMouseEnter={() => setToolsOpen(true)} onMouseLeave={() => setToolsOpen(false)}>
              <button
                className={cn(
                  "flex items-center gap-1 rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground",
                  pathname.startsWith("/tools") && "text-foreground",
                )}
                aria-expanded={toolsOpen}
                onClick={() => setToolsOpen((v) => !v)}
              >
                Tools <ChevronDown className={cn("h-3.5 w-3.5 transition-transform", toolsOpen && "rotate-180")} />
              </button>
              {toolsOpen && (
                <div className="absolute left-0 top-full w-[320px] pt-2">
                  <div className="grid grid-cols-1 gap-0.5 rounded-xl border border-border bg-popover p-2 shadow-lg">
                    {tools.map((tool) => (
                      <Link
                        key={tool.href}
                        href={tool.href}
                        className={cn(
                          "rounded-md px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground",
                          pathname === tool.href && "bg-secondary text-foreground",
                        )}
                      >
                        {tool.name}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </nav>

          {/* Right cluster */}
          <div className="ml-auto flex items-center gap-2">
            <button
              onClick={openCommandPalette}
              aria-label="Open command palette"
              className="hidden h-9 items-center gap-2 rounded-md border border-border bg-secondary/60 px-3 text-sm text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground sm:flex"
            >
              <Search className="h-4 w-4" />
              <span className="hidden lg:inline">Search…</span>
              <Kbd>⌘K</Kbd>
            </button>

            {/* Funnel: this tool's audience is exactly Bhavesh's audience. */}
            <a
              href={AUTHOR_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden items-center gap-1 rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground lg:flex"
            >
              Built by {AUTHOR_NAME}
              <ArrowUpRight className="h-3.5 w-3.5" />
            </a>

            <ModeToggle />

            <div className="md:hidden">
              <Button variant="outline" size="icon" aria-label="Toggle menu" onClick={() => setMobileOpen((v) => !v)}>
                {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="border-t border-border bg-background md:hidden">
          <div className="container mx-auto px-4">
            <div className="flex flex-col gap-1 py-4">
              <MobileLink href="/" active={pathname === "/"}>Home</MobileLink>
              <p className="px-3 pb-1 pt-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Tools</p>
              {tools.map((tool) => (
                <MobileLink key={tool.href} href={tool.href} active={pathname === tool.href}>
                  {tool.name}
                </MobileLink>
              ))}
              <a
                href={AUTHOR_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 flex items-center gap-1 rounded-md px-3 py-2.5 text-sm font-medium text-primary"
              >
                Built by {AUTHOR_NAME} <ArrowUpRight className="h-3.5 w-3.5" />
              </a>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}

function NavLink({ href, active, children }: { href: string; active?: boolean; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className={cn(
        "rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground",
        active && "text-foreground",
      )}
    >
      {children}
    </Link>
  )
}

function MobileLink({ href, active, children }: { href: string; active?: boolean; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className={cn(
        "rounded-md px-3 py-2.5 text-sm text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground",
        active && "bg-secondary text-foreground",
      )}
    >
      {children}
    </Link>
  )
}
