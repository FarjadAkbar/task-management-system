"use client"

import { useQuery } from "@tanstack/react-query"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Skeleton } from "@/components/ui/skeleton"
import { useSprints } from "@/service/sprints"
import { SprintType } from "@/service/sprints/type"

interface SprintSelectorProps {
  projectId: string
  value?: string
  onValueChange: (value: string) => void
  placeholder?: string
}

export function SprintSelector({ projectId, value, onValueChange, placeholder = "Select sprint" }: SprintSelectorProps) {
  const { data: sprints, isLoading } = useSprints(projectId)

  if (isLoading) {
    return <Skeleton className="h-10 w-full" />
  }

  if (!sprints || sprints.length === 0) {
    return (
      <div className="text-sm text-muted-foreground">
        No sprints available. Create a sprint first.
      </div>
    )
  }

  return (
    <Select value={value} onValueChange={onValueChange}>
      <SelectTrigger>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {sprints.map((sprint: SprintType) => (
          <SelectItem key={sprint.id} value={sprint.id}>
            <div className="flex items-center justify-between w-full">
              <span>{sprint.name}</span>
              <span className="text-xs text-muted-foreground ml-2">
                {sprint.status}
              </span>
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
