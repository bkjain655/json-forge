import { ArrowUpRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { AUTHOR_NAME, AUTHOR_URL, AUTHOR_TAGLINE } from "@/lib/constants"

/**
 * Conversion band. JSON Forge's visitors are developers and technical buyers —
 * exactly the audience for Bhavesh's front-end engagements — so give them one
 * clear, low-pressure path to the portfolio.
 */
export function MakerCta() {
  return (
    <section className="border-t border-border bg-secondary/30">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-start justify-between gap-6 py-12 sm:flex-row sm:items-center">
          <div>
            <p className="text-sm font-medium text-primary">Made by {AUTHOR_NAME}</p>
            <h2 className="mt-1 text-xl font-semibold tracking-tight sm:text-2xl">
              Building a SaaS product? {AUTHOR_TAGLINE}.
            </h2>
            <p className="mt-2 max-w-xl text-muted-foreground">
              This tool is a small taste of the craft. If you need a fast, polished front-end for your
              enterprise SaaS, let&apos;s talk.
            </p>
          </div>
          <Button asChild size="lg" className="shrink-0">
            <a href={AUTHOR_URL} target="_blank" rel="noopener noreferrer">
              Work with me <ArrowUpRight className="ml-2 h-4 w-4" />
            </a>
          </Button>
        </div>
      </div>
    </section>
  )
}
