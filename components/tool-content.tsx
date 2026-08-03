import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { JsonLd } from "@/components/json-ld"
import { TOOLS } from "@/lib/tool-content"
import { faqLd } from "@/lib/structured-data"

/**
 * Long-form, server-rendered content for a tool page: about, how-to, use cases,
 * FAQ (with FAQPage schema) and internal links. Drives SEO depth and passes
 * ad-network content review.
 */
export function ToolContent({ slug }: { slug: string }) {
  const tool = TOOLS[slug]
  if (!tool) return null

  return (
    <section className="border-t border-border">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-3xl space-y-14 py-14">
          {/* About */}
          <div>
            <h2 className="text-xl font-semibold tracking-tight">About the {tool.name}</h2>
            <div className="mt-4 space-y-4 leading-relaxed text-muted-foreground">
              {tool.intro.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>
          </div>

          {/* How to use */}
          <div>
            <h2 className="text-xl font-semibold tracking-tight">How to use the {tool.name}</h2>
            <ol className="mt-4 space-y-3">
              {tool.howTo.map((step, i) => (
                <li key={i} className="flex gap-3 text-muted-foreground">
                  <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
                    {i + 1}
                  </span>
                  <span className="leading-relaxed">{step}</span>
                </li>
              ))}
            </ol>
          </div>

          {/* Use cases */}
          <div>
            <h2 className="text-xl font-semibold tracking-tight">Common uses</h2>
            <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
              {tool.useCases.map((uc) => (
                <div key={uc.title} className="rounded-lg border border-border bg-secondary/30 p-4">
                  <h3 className="text-sm font-semibold">{uc.title}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{uc.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* FAQ */}
          <div>
            <h2 className="text-xl font-semibold tracking-tight">Frequently asked questions</h2>
            <div className="mt-4 divide-y divide-border">
              {tool.faqs.map((faq) => (
                <div key={faq.question} className="py-4">
                  <h3 className="font-medium text-foreground">{faq.question}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{faq.answer}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Related tools (internal linking) */}
          {tool.related.length > 0 && (
            <div>
              <h2 className="text-xl font-semibold tracking-tight">Related tools</h2>
              <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
                {tool.related.map((rel) => {
                  const r = TOOLS[rel]
                  if (!r) return null
                  return (
                    <Link key={rel} href={r.path} className="group block">
                      <Card className="transition-colors hover:border-primary/40">
                        <CardContent className="flex items-center justify-between p-4">
                          <span className="text-sm font-medium">{r.name}</span>
                          <ArrowRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-primary" />
                        </CardContent>
                      </Card>
                    </Link>
                  )
                })}
              </div>
            </div>
          )}
        </div>
      </div>

      <JsonLd data={faqLd(tool.faqs)} />
    </section>
  )
}
