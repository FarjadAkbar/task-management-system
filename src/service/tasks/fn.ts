// taskApi.ts
import API from "@/lib/axios-client";
import type {
  Tasks,
  SubTask,
  ChecklistItem,
  TasksComments,
  TaskFeedback,
} from "@prisma/client";
import {
  ChecklistItemPayloadType,
  SubTaskPayloadType,
  TaskCommentPayloadType,
  TaskFeedbackPayloadType,
  CreateTaskPayloadType,
  UpdateTaskPayloadType,
  MoveTaskPayloadType,
} from "./type";

export const getTask = async (taskId: string) => {
  const response = await API.get<{ task: Tasks }>(`/tasks/${taskId}`);
  return response.data.task;
};

export const getSectionTasks = async (sectionId: string) => {
  const response = await API.get<{ tasks: Tasks[] }>(
    `/sections/${sectionId}/tasks`
  );
  return response.data.tasks;
};

export const createTask = async (data: CreateTaskPayloadType) => {
  const response = await API.post<{ task: Tasks }>("/tasks", data);
  return response.data.task;
};

export const updateTask = async (
  data: UpdateTaskPayloadType
) => {
  const response = await API.put<{ task: Tasks }>(`/tasks/${data.id}`, data);
  return response.data.task;
};

export const deleteTask = async (taskId: string) => {
  const response = await API.delete<{ task: Tasks }>(`/tasks/${taskId}`);
  return response.data.task;
};

export const moveTask = async (
  data: MoveTaskPayloadType
) => {
  const response = await API.post<{ task: Tasks }>(`/tasks/${data.taskId}/move`, data);
  return response.data.task;
};

export const completeTask = async (taskId: string) => {
  const response = await API.post<{ task: Tasks }>(`/tasks/${taskId}/complete`);
  return response.data.task;
};

export const addSubtask = async (data: SubTaskPayloadType) => {
  const response = await API.post<{ subtask: SubTask }>(
    `/tasks/${data.taskId}/subtasks`,
    data
  );
  return response.data.subtask;
};

export const completeSubtask = async (
  data: { subtaskId: string; completed: boolean }
) => {
  const response = await API.put<{ subtask: SubTask }>(
    `/subtasks/${data.subtaskId}`,
    { completed: data.completed }
  );
  return response.data.subtask;
};

export const addChecklistItem = async (
  data: ChecklistItemPayloadType
) => {
  const response = await API.post<{ checklistItem: ChecklistItem }>(
    `/tasks/${data.taskId}/checklist`,
    data
  );
  return response.data.checklistItem;
};

export const completeChecklistItem = async (
  data: { checklistItemId: string; completed: boolean }
) => {
  const response = await API.put<{ checklistItem: ChecklistItem }>(
    `/checklist/${data.checklistItemId}`,
    { completed: data.completed }
  );
  return response.data.checklistItem;
};

export const addTaskComment = async (
  data: TaskCommentPayloadType
) => {
  const response = await API.post<{ comment: TasksComments }>(
    `/tasks/${data.taskId}/comments`,
    data
  );
  return response.data.comment;
};

export const addTaskFeedback = async (
  data: TaskFeedbackPayloadType
) => {
  const response = await API.post<{ feedback: TaskFeedback }>(
    `/tasks/${data.taskId}/feedback`,
    { ...data, userId: data.userId }
  );
  return response.data.feedback;
};

export const getTaskFilters = async () => {
  const response = await API.get<{ filters: any }>("/tasks/filters");
  return response.data.filters;
};

export const searchTasks = async (query: string, filters: any = {}) => {
  const params = new URLSearchParams();
  if (query) params.append("q", query);

  Object.entries(filters).forEach(([key, value]) => {
    if (value) params.append(key, String(value));
  });

  const response = await API.get<{ tasks: Tasks[] }>(`/tasks/search?${params}`);
  return response.data.tasks;
};
