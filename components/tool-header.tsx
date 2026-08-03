import type { LucideIcon } from "lucide-react"

interface ToolHeaderProps {
  icon: LucideIcon
  title: string
  description: string
}

/** Consistent header for every tool page: brand icon tile + title + one-liner. */
export function ToolHeader({ icon: Icon, title, description }: ToolHeaderProps) {
  return (
    <div className="mb-8 flex items-start gap-4">
      <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary">
        <Icon className="h-6 w-6" />
      </div>
      <div>
        <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
        <p className="mt-1 max-w-2xl text-muted-foreground">{description}</p>
      </div>
    </div>
  )
}
