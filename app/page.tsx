import type { Metadata } from "next"
import Link from "next/link"
import { ArrowRight, Code, FileJson, GitCompare, GitMerge, RotateCw, FileCheck, ShieldCheck, Zap, Gift } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardTitle, CardDescription } from "@/components/ui/card"
import { Kbd } from "@/components/ui/kbd"
import { MakerCta } from "@/components/maker-cta"
import Description from "@/components/ui/description"
import { CONTENT as FAQ_CONTENT } from "@/lib/faq-content"
import { KEYWORDS, SITE_URL } from "@/lib/constants"

export const metadata: Metadata = {
  title: "JSON Forge - Developer Utilities for JSON Operations",
  description:
    "Free online JSON Forge for developers - compare, merge, validate, format, convert JSON to YAML, generate schemas and more.",
  keywords: KEYWORDS,
  alternates: {
    canonical: "/",
  },
}

const tools = [
  { title: "JSON Compare", description: "Diff two JSON objects and highlight what changed.", icon: GitCompare, href: "/tools/compare" },
  { title: "JSON Merge", description: "Deep-merge multiple JSON objects into one.", icon: GitMerge, href: "/tools/merge" },
  { title: "JSON Validator", description: "Validate JSON syntax and pinpoint errors.", icon: FileCheck, href: "/tools/validate" },
  { title: "JSON Formatter", description: "Beautify or minify with custom indentation.", icon: FileJson, href: "/tools/formatter" },
  { title: "JSON to YAML", description: "Convert freely between JSON and YAML.", icon: RotateCw, href: "/tools/json-yaml" },
  { title: "JSON to XML", description: "Convert freely between JSON and XML.", icon: RotateCw, href: "/tools/json-xml" },
  { title: "JSON to CSV", description: "Turn JSON arrays into clean CSV, and back.", icon: RotateCw, href: "/tools/json-csv" },
  { title: "JSON Schema Generator", description: "Generate a JSON Schema from sample data.", icon: Code, href: "/tools/schema-generator" },
]

const features = [
  { title: "Runs in your browser", description: "Every operation is client-side. Your data never leaves your machine.", icon: ShieldCheck },
  { title: "Fast & keyboard-first", description: "Press ⌘K anywhere to jump between tools instantly.", icon: Zap },
  { title: "Free & open", description: "All tools are completely free, with no limits or sign-up.", icon: Gift },
]

export default function Home() {
  const softwareApplicationLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "JSON Forge",
    url: SITE_URL,
    applicationCategory: "DeveloperApplication",
    operatingSystem: "Any",
    description:
      "Free online JSON utilities for developers - compare, merge, validate, format, convert JSON to YAML, XML and CSV, and generate schemas.",
    featureList: tools.map((tool) => tool.title),
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
  }

  const faqLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQ_CONTENT.map((item) => ({
      "@type": "Question",
      name: item.title,
      acceptedAnswer: { "@type": "Answer", text: item.description.join(" ") },
    })),
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareApplicationLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />

      {/* Hero */}
      <section className="relative overflow-hidden border-b border-border">
        {/* accent glow */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute left-1/2 top-[-6rem] h-[24rem] w-[42rem] -translate-x-1/2 rounded-full opacity-70 blur-[100px]"
          style={{ background: "radial-gradient(closest-side, hsl(var(--primary) / 0.18), transparent)" }}
        />
        <div className="container relative mx-auto px-4">
          <div className="mx-auto max-w-3xl py-20 text-center sm:py-28">
            <Badge variant="outline" className="border-primary/20 bg-primary/10 text-primary">
              <span className="font-mono">8 tools</span> · 100% client-side
            </Badge>
            <h1 className="mt-5 text-4xl font-bold tracking-tight sm:text-5xl">
              The JSON toolkit for developers
            </h1>
            <p className="mx-auto mt-4 max-w-xl text-lg text-muted-foreground">
              Compare, merge, validate, format and convert JSON — fast, private, and free. Everything runs right in your browser.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <Button size="lg" asChild>
                <Link href="/tools/formatter">
                  Open JSON Formatter <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="#tools">Browse all tools</Link>
              </Button>
            </div>
            <p className="mt-6 text-sm text-muted-foreground">
              Tip: press <Kbd>⌘K</Kbd> anywhere to search tools
            </p>
          </div>
        </div>
      </section>

      {/* Tools grid */}
      <section id="tools" className="scroll-mt-20 py-16">
        <div className="container mx-auto px-4">
          <div className="mb-8">
            <h2 className="text-2xl font-semibold tracking-tight">All tools</h2>
            <p className="mt-1 text-muted-foreground">Pick a utility to get started.</p>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {tools.map((tool) => {
              const Icon = tool.icon
              return (
                <Link key={tool.title} href={tool.href} className="group block">
                  <Card className="h-full transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-md">
                    <CardContent className="p-5">
                      <div className="mb-4 grid h-10 w-10 place-items-center rounded-lg border border-border bg-secondary text-muted-foreground transition-colors group-hover:border-primary/30 group-hover:bg-primary/10 group-hover:text-primary">
                        <Icon className="h-5 w-5" />
                      </div>
                      <div className="flex items-center justify-between gap-2">
                        <CardTitle className="text-lg">{tool.title}</CardTitle>
                        <ArrowRight className="h-4 w-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-foreground" />
                      </div>
                      <CardDescription className="mt-2">{tool.description}</CardDescription>
                    </CardContent>
                  </Card>
                </Link>
              )
            })}
          </div>
        </div>
      </section>

      {/* Why */}
      <section className="border-t border-border py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {features.map((feature) => {
              const Icon = feature.icon
              return (
                <div key={feature.title} className="flex gap-4">
                  <div className="grid h-10 w-10 shrink-0 place-items-center rounded-lg border border-border bg-secondary/50 text-foreground">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold">{feature.title}</h3>
                    <p className="mt-1 text-sm text-muted-foreground">{feature.description}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4">
        <div className="pb-20 text-center">
          <Description />
        </div>
      </div>

      <MakerCta />
    </>
  )
}
