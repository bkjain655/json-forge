import Link from "next/link"
import { FileJson } from "lucide-react"

export default function Footer() {
  return (
    <footer className="border-t py-6 md:py-8">
      <div className="container flex flex-col items-center justify-evenly gap-4 md:flex-row">
        <div className="flex items-center gap-2">
          <FileJson className="h-5 w-5" />
          <span className="text-sm font-medium">JSON Forge</span>
        </div>
        <div className="flex gap-4 text-sm text-muted-foreground">
          <Link href="/about" className="hover:underline">
            About JSON Forge
          </Link>
          <Link href="/connect" className="hover:underline">
            Connect with me
          </Link>
        </div>
        <p className="text-sm text-muted-foreground">
          &copy; 2025 JSON Forge. All rights reserved.
        </p>
      </div>
    </footer>
  )
}

