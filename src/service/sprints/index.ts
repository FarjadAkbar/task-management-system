

// hooks/useSprint.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import {
  fetchSprints,
  fetchSprint,
  createSprint,
  updateSprint,
  deleteSprint,
  fetchSprintTasks,
  startSprint,
  completeSprint,
} from "./fn"
import { CreateSprintPayloadType } from "./type"

export function useSprints(projectId: string | null) {
  return useQuery({
    queryKey: ["sprints", projectId],
    queryFn: () => (projectId ? fetchSprints(projectId) : []),
    enabled: !!projectId,
  })
}

export function useSprint(sprintId: string) {
  return useQuery({
    queryKey: ["sprint", sprintId],
    queryFn: () => fetchSprint(sprintId),
    enabled: !!sprintId,
  })
}

export function useCreateSprint() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ projectId, data }: { projectId: string; data: CreateSprintPayloadType }) =>
      createSprint(projectId, data),
    onSuccess: (_, { projectId }) => {
      queryClient.invalidateQueries({ queryKey: ["sprints", projectId] })
      queryClient.invalidateQueries({ queryKey: ["project", projectId] })
    },
  })
}

export function useUpdateSprint() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ sprintId, data }: { sprintId: string; data: Partial<CreateSprintPayloadType> }) =>
      updateSprint(sprintId, data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["sprint", data.id] })
      queryClient.invalidateQueries({ queryKey: ["sprints", data.projectId] })
      queryClient.invalidateQueries({ queryKey: ["project", data.projectId] })
    },
  })
}

export function useDeleteSprint() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ sprintId }: { sprintId: string }) => deleteSprint(sprintId),
    // onSuccess: (_, { projectId }) => {
    //   queryClient.invalidateQueries({ queryKey: ["sprints", projectId] })
    //   queryClient.invalidateQueries({ queryKey: ["project", projectId] })
    // },
  })
}

export function useSprintTasks(sprintId: string) {
  return useQuery({
    queryKey: ["sprint-tasks", sprintId],
    queryFn: () => fetchSprintTasks(sprintId),
    // enabled: !!sprintId,
  })
}

export function useStartSprint() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: startSprint,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["sprint", data.id] })
      queryClient.invalidateQueries({ queryKey: ["sprints", data.projectId] })
      queryClient.invalidateQueries({ queryKey: ["project", data.projectId] })
    },
  })
}

export function useCompleteSprint() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: completeSprint,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["sprint", data.id] })
      queryClient.invalidateQueries({ queryKey: ["sprints", data.projectId] })
      queryClient.invalidateQueries({ queryKey: ["project", data.projectId] })
    },
  })
}
