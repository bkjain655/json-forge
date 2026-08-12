import { ArrowUpRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { AUTHOR_NAME, AUTHOR_URL } from "@/lib/constants"

/**
 * Maker credit. A neutral, low-pressure link to more of Bhavesh's work —
 * no sales pitch, so the site reads well to any visitor.
 */
export function MakerCta() {
  return (
    <section className="border-t border-border bg-secondary/30">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-start justify-between gap-6 py-12 sm:flex-row sm:items-center">
          <div>
            <p className="text-sm font-medium text-primary">Made by {AUTHOR_NAME}</p>
            <h2 className="mt-1 text-xl font-semibold tracking-tight sm:text-2xl">
              More tools & projects
            </h2>
            <p className="mt-2 max-w-xl text-muted-foreground">
              JSON Forge is one of several web tools and products I build and maintain. Explore the
              rest of my work.
            </p>
          </div>
          <Button asChild size="lg" className="shrink-0">
            <a href={AUTHOR_URL} target="_blank" rel="noopener noreferrer">
              See more of my work <ArrowUpRight className="ml-2 h-4 w-4" />
            </a>
          </Button>
        </div>
      </div>
    </section>
  )
}
