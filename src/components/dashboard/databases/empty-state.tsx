import type { ReactNode } from "react"
import { FileQuestion } from "lucide-react"

interface EmptyStateProps {
  title: string
  description: string
  icon?: ReactNode
  action?: ReactNode
}

export function EmptyState({ title, description, icon, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center border-2 border-dashed rounded-lg h-64">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted mb-4">
        {icon || <FileQuestion className="h-6 w-6 text-muted-foreground" />}
      </div>
      <h3 className="text-lg font-medium">{title}</h3>
      <p className="text-sm text-muted-foreground mt-1 mb-4 max-w-sm">{description}</p>
      {action}
    </div>
  )
}

