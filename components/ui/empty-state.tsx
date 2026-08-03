import type { LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"

interface EmptyStateProps extends React.HTMLAttributes<HTMLDivElement> {
  icon?: LucideIcon
  title: string
  description?: string
  /** Optional action node (e.g. a button) rendered under the description. */
  action?: React.ReactNode
}

/**
 * Centered placeholder for result panes and empty lists. Keeps every tool's
 * "nothing here yet" moment consistent instead of showing a blank box.
 */
export function EmptyState({ icon: Icon, title, description, className, action, ...props }: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-2 rounded-md border border-dashed border-border bg-muted/30 px-6 py-10 text-center",
        className,
      )}
      {...props}
    >
      {Icon && <Icon className="h-8 w-8 text-muted-foreground/60" aria-hidden="true" />}
      <p className="text-sm font-medium text-foreground">{title}</p>
      {description && <p className="max-w-xs text-sm text-muted-foreground">{description}</p>}
      {action && <div className="mt-2">{action}</div>}
    </div>
  )
}
