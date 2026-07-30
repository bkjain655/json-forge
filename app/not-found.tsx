import type { Metadata } from "next"
import Link from "next/link"
import { FileJson } from "lucide-react"
import { Button } from "@/components/ui/button"

export const metadata: Metadata = {
  title: "Page Not Found",
  description: "The page you are looking for does not exist.",
}

export default function NotFound() {
  return (
    <div className="container mx-auto flex flex-col items-center justify-center px-4 py-24 text-center">
      <FileJson className="h-12 w-12 mb-4 text-primary" />
      <p className="text-sm font-mono text-muted-foreground mb-2">404</p>
      <h1 className="text-3xl font-bold mb-2">This page could not be found</h1>
      <p className="text-muted-foreground max-w-md mx-auto mb-8">
        The link may be broken or the page may have moved. All JSON Forge tools are still one click away.
      </p>
      <div className="flex flex-wrap justify-center gap-4">
        <Button asChild>
          <Link href="/">Back to Home</Link>
        </Button>
        <Button asChild variant="outline">
          <Link href="/tools/formatter">Open JSON Formatter</Link>
        </Button>
      </div>
    </div>
  )
}
