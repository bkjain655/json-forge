import type { Metadata } from "next"
import Link from "next/link"
import { ArrowRight, Code, FileJson, GitCompare, GitMerge, RotateCw, FileCheck } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import Description from "@/components/ui/description"
import { KEYWORDS } from "@/lib/constants"

export const metadata: Metadata = {
  title: "JSON Forge - Developer Utilities for JSON Operations",
  description:
    "Free online JSON Forge for developers - compare, merge, validate, format, convert JSON to YAML, generate schemas and more.",
  keywords: KEYWORDS,
}

export default function Home() {
  const tools = [
    {
      title: "JSON Compare",
      description: "Compare two JSON objects and highlight the differences",
      icon: <GitCompare className="h-8 w-8 mb-2" />,
      href: "/tools/compare",
    },
    {
      title: "JSON Merge",
      description: "Merge multiple JSON objects into a single object",
      icon: <GitMerge className="h-8 w-8 mb-2" />,
      href: "/tools/merge",
    },
    {
      title: "JSON Validator",
      description: "Validate JSON syntax and structure",
      icon: <FileCheck className="h-8 w-8 mb-2" />,
      href: "/tools/validate",
    },
    {
      title: "JSON Formatter",
      description: "Format and beautify JSON with customizable indentation",
      icon: <FileJson className="h-8 w-8 mb-2" />,
      href: "/tools/formatter",
    },
    {
      title: "JSON to YAML",
      description: "Convert between JSON and YAML formats",
      icon: <RotateCw className="h-8 w-8 mb-2" />,
      href: "/tools/json-yaml",
    },
    {
      title: "JSON to XML",
      description: "Convert between JSON and XML formats",
      icon: <RotateCw className="h-8 w-8 mb-2" />,
      href: "/tools/json-xml",
    }, 
    {
      title: "JSON to CSV",
      description: "Convert between JSON and CSV formats",
      icon: <RotateCw className="h-8 w-8 mb-2" />,
      href: "/tools/json-csv",
    },    
    {
      title: "JSON Schema Generator",
      description: "Generate JSON schema from JSON data",
      icon: <Code className="h-8 w-8 mb-2" />,
      href: "/tools/schema-generator",
    },
  ]

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="text-center mb-16">
        <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-4">JSON Forge for Developers</h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          Free online utilities to work with JSON data. Compare, merge, validate, format, convert, and more.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tools.map((tool) => (
          <Card key={tool.title} className="flex flex-col h-full">
            <CardHeader>
              <div className="text-primary">{tool.icon}</div>
              <CardTitle>{tool.title}</CardTitle>
              <CardDescription>{tool.description}</CardDescription>
            </CardHeader>
            <CardFooter className="mt-auto">
              <Link href={tool.href} className="w-full">
                <Button className="w-full">
                  Use Tool <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </CardFooter>
          </Card>
        ))}
      </div>
      <div className="mt-20 text-center">
        <Description />  
      </div>
      <div className="mt-20 text-center">
        <h2 className="text-3xl font-bold mb-6">Why Use Our JSON Forge?</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <div>
            <h3 className="text-xl font-semibold mb-2">Fast & Secure</h3>
            <p className="text-muted-foreground">
              All operations run in your browser. Your data never leaves your computer.
            </p>
          </div>
          <div>
            <h3 className="text-xl font-semibold mb-2">Developer Friendly</h3>
            <p className="text-muted-foreground">
              Built by developers for developers with a clean, intuitive interface.
            </p>
          </div>
          <div>
            <h3 className="text-xl font-semibold mb-2">Free & Open</h3>
            <p className="text-muted-foreground">All tools are completely free to use with no limitations.</p>
          </div>
        </div>
      </div>
    </div>
  )
}

