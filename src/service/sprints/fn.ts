// sprintApi.ts
import API from "@/lib/axios-client"
import type { Sprint } from "@prisma/client"
import { CreateSprintPayloadType } from "./type"

// Fetch all sprints for a project
export const fetchSprints = async (projectId: string) => {
  const response = await API.get<{ sprints: Sprint[] }>(`/projects/${projectId}/sprints`)
  return response.data.sprints
}

// Fetch a single sprint with details
export const fetchSprint = async (sprintId: string) => {
  const response = await API.get<{ sprint: Sprint }>(`/sprints/${sprintId}`)
  return response.data.sprint
}

// Create a new sprint
export const createSprint = async (projectId: string, data: CreateSprintPayloadType) => {
  const response = await API.post<{ sprint: Sprint }>(`/projects/${projectId}/sprints`, data)
  return response.data.sprint
}

// Update a sprint
export const updateSprint = async (sprintId: string, data: Partial<CreateSprintPayloadType>) => {
  const response = await API.put<{ sprint: Sprint }>(`/sprints/${sprintId}`, data)
  return response.data.sprint
}

// Delete a sprint
export const deleteSprint = async (sprintId: string) => {
  await API.delete(`/sprints/${sprintId}`)
}

// Fetch tasks for a sprint
export const fetchSprintTasks = async (sprintId: string) => {
  const response = await API.get<{ tasks: any[] }>(`/sprints/${sprintId}/tasks`)
  return response.data.tasks
}

// Start a sprint
export const startSprint = async (sprintId: string) => {
  const response = await API.post<{ sprint: Sprint }>(`/sprints/${sprintId}/start`)
  return response.data.sprint
}

// Complete a sprint
export const completeSprint = async (sprintId: string) => {
  const response = await API.post<{ sprint: Sprint }>(`/sprints/${sprintId}/complete`)
  return response.data.sprint
}
