"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { FileJson, Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ModeToggle } from "@/components/mode-toggle"
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"
import { cn } from "@/lib/utils"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"

export default function Header() {
  const pathname = usePathname()

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

  const pages = [
    { name: "About Us", href: "/about" },
    { name: "Contact Us", href: "/contact-us" },
    { name: "Privacy Policy", href: "/privacy-policy" },
    { name: "Terms & Conditions", href: "/terms-and-conditions" },
  ]

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        
        {/* Logo */}
        <div className="flex items-center gap-2 ml-4">
          <Link href="/" aria-label="JSON Forge Home" className="flex items-center space-x-2">
            <FileJson className="h-6 w-6" />
            <span className="font-bold text-xl hidden sm:inline-block">JSON Forge</span>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <NavigationMenu className="hidden md:flex">
          <NavigationMenuList>
            <NavigationMenuItem>
              <Link href="/" legacyBehavior passHref>
                <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                  Home
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>

            <NavigationMenuItem>
              <NavigationMenuTrigger>Tools</NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                  {tools.map((tool) => (
                    <li key={tool.name}>
                      <NavigationMenuLink asChild>
                        <Link
                          href={tool.href}
                          className={cn(
                            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
                            pathname === tool.href ? "bg-accent text-accent-foreground" : "",
                          )}
                        >
                          <div className="text-sm font-medium leading-none">{tool.name}</div>
                        </Link>
                      </NavigationMenuLink>
                    </li>
                  ))}
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>

            {pages.map((page) => (
              <NavigationMenuItem key={page.name}>
                <Link href={page.href} legacyBehavior passHref>
                  <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                    {page.name}
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
            ))}
          </NavigationMenuList>
        </NavigationMenu>

        {/* Theme Toggle */}
        <div className="flex items-center gap-2">
          <ModeToggle />
        </div>

        {/* Mobile Navigation */}
        <Sheet>
          <SheetTrigger asChild className="md:hidden">
            <Button variant="outline" size="icon">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left">
            <div className="flex flex-col gap-6 mt-8">
              <Link href="/" className="text-lg font-semibold" aria-label="Home">
                Home
              </Link>

              <div className="space-y-3">
                <h3 className="text-lg font-semibold">Tools</h3>
                <div className="flex flex-col space-y-2 pl-2">
                  {tools.map((tool) => (
                    <Link
                      key={tool.name}
                      href={tool.href}
                      className={cn(
                        "text-muted-foreground hover:text-foreground",
                        pathname === tool.href ? "text-foreground font-medium" : "",
                      )}
                    >
                      {tool.name}
                    </Link>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <h3 className="text-lg font-semibold">Pages</h3>
                <div className="flex flex-col space-y-2 pl-2">
                  {pages.map((page) => (
                    <Link
                      key={page.name}
                      href={page.href}
                      className="text-muted-foreground hover:text-foreground"
                    >
                      {page.name}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  )
}
