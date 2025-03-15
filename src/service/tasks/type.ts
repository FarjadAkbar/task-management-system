import type { Tasks, SubTask, ChecklistItem } from "@prisma/client"


export type TaskType = {
    id: string;
    title: string;
    content: string | null;
    taskStatus: string;
    priority: string;
    position: number;
    section: string | null;
    createdAt: Date;
    updatedAt: Date;
    createdBy: string | null;
    parentTaskId: string | null;
    assignees?: { userId: string }[]; // Add the assignees property
    sprint?: { projectId: string };
    task_feedback?: { isPrivate: boolean; userId: string }[];
}

export type CreateTaskPayloadType = {
  title: string
  content?: string
  priority: string
  section?: string
  sprintId?: string
  weight?: number
  estimatedHours?: number
  startDate?: Date
  dueDateAt?: Date
  assignees?: string[]
  tags?: string[]
  parentTaskId?: string
}

export type UpdateTaskPayloadType = Partial<CreateTaskPayloadType> & {
  id: string
}

export type SubTaskPayloadType = {
  taskId: string
  title: string
  description?: string
}

export type ChecklistItemPayloadType = {
  taskId: string
  title: string
}

export type TaskCommentPayloadType = {
  taskId: string
  comment: string
}

export type TaskFeedbackPayloadType = {
  taskId: string;
  userId: string;
  feedback: string
  rating: number
  isPrivate?: boolean
}


export type MoveTaskPayloadType = {
  taskId: string,
  sectionId: string,
  position: number
}