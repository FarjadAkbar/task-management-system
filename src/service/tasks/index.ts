import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { addChecklistItem, addSubtask, addTaskAttachments, addTaskComment, addTaskFeedback, completeChecklistItem, completeSubtask, completeTask, createTask, deleteTask, getSectionTasks, getTask, getTaskFilters, moveTask, searchTasks, updateTask } from "./fn"

// Get a single task with details
export function useTask(taskId: string) {
  return useQuery({
    queryKey: ["task", taskId],
    queryFn: async () => getTask(taskId),
    enabled: !!taskId,
    staleTime: 60 * 1000,
  })
}

// Get tasks for a section
export function useSectionTasks(sectionId: string) {
  return useQuery({
    queryKey: ["section-tasks", sectionId],
    queryFn: async () => getSectionTasks(sectionId),
    enabled: !!sectionId,
  })
}

// Create a new task
export function useCreateTask() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createTask,
    onSuccess: (data) => {
      // queryClient.invalidateQueries({ queryKey: ["section-tasks", data.section] })
      queryClient.invalidateQueries({ queryKey: ["sprint-tasks", data.sprintId], exact: true })
    },
  })
}

// Update a task
export function useUpdateTask() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: updateTask,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["task", data.id] })
      queryClient.invalidateQueries({ queryKey: ["section-tasks", data.section] })
      queryClient.invalidateQueries({ queryKey: ["sprint-tasks", data.sprintId] })
    },
  })
}

// Delete a task
export function useDeleteTask() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: deleteTask,
    onSuccess: (data) => {
      // queryClient.invalidateQueries({ queryKey: ["section-tasks", data.section] })
      queryClient.invalidateQueries({ queryKey: ["sprint-tasks", data.sprintId], exact: true })
    },
  })
}

// Move a task to a different section
export function useMoveTask() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: moveTask,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["sprint-tasks", data.sprintId], exact: true })
    },
  })
}

// Complete a task
export function useCompleteTask() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: completeTask,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["task", data.id] })
      queryClient.invalidateQueries({ queryKey: ["section-tasks", data.section] })
      queryClient.invalidateQueries({ queryKey: ["sprint-tasks", data.sprintId] })
    },
  })
}

// Add a subtask
export function useAddSubtask() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: addSubtask,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["task", variables.taskId] })
    },
  })
}

// Complete a subtask
export function useCompleteSubtask() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: completeSubtask,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["task", data.taskId] })
    },
  })
}

// Add a checklist item
export function useAddChecklistItem() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: addChecklistItem,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["task", variables.taskId] })
    },
  })
}

// Complete a checklist item
export function useCompleteChecklistItem() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: completeChecklistItem,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["task", data.taskId] })
    },
  })
}

// Add a comment to a task
export function useAddTaskComment() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: addTaskComment,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["task", variables.taskId] })
    },
  })
}

// Add feedback to a task
export function useAddTaskFeedback() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: addTaskFeedback,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["task", variables.taskId] })
    },
  })
}

// Get task filters
export function useTaskFilters() {
  return useQuery({
    queryKey: ["task-filters"],
    queryFn: async () => getTaskFilters,
  })
}

// Search tasks
export function useSearchTasks(query: string, filters: any = {}) {
  return useQuery({
    queryKey: ["search-tasks", query, filters],
    queryFn: async () => searchTasks(query, filters),
    enabled: !!query || Object.values(filters).some((value) => !!value),
  })
}

export function useAddTaskAttachmentsMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: addTaskAttachments,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["task", variables.taskId] })
    }
  })
}

