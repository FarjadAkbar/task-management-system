import { Skeleton } from "@/components/ui/skeleton"

export function CalendarSkeleton() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Skeleton className="h-8 w-24" />
          <Skeleton className="h-8 w-24" />
        </div>
        <Skeleton className="h-8 w-32" />
        <div className="flex items-center space-x-2">
          <Skeleton className="h-8 w-24" />
          <Skeleton className="h-8 w-24" />
          <Skeleton className="h-8 w-24" />
        </div>
      </div>
      <div className="grid grid-cols-7 gap-4">
        {Array.from({ length: 7 }).map((_, i) => (
          <Skeleton key={i} className="h-8" />
        ))}
      </div>
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className="grid grid-cols-7 gap-4">
          {Array.from({ length: 7 }).map((_, j) => (
            <Skeleton key={j} className="h-24" />
          ))}
        </div>
      ))}
    </div>
  )
}

