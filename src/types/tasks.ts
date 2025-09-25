import { ActiveStatus, RoleEnum } from "@prisma/client";
import { TaskAssignee } from "./type";

// Task Component Props
export interface TaskCardProps {
  task: TaskType;
  taskId: string;
}

export interface TaskDetailDialogProps {
  taskId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export interface TaskChecklistProps {
  taskId: string;
  checklist: ChecklistItemType[];
}

export interface TaskCommentsProps {
  taskId: string;
  comments: TaskCommentType[];
}

export interface TaskAttachmentsProps {
  taskId: string;
  attachments: TaskAttachment[];
}

export interface TaskFeedbackProps {
  taskId: string;
  feedback: TaskFeedbackType[];
}

export interface EditableFieldProps {
  field: string;
  value: string;
  onSave: (field: string, value: string) => void;
  displayClassName?: string;
  inputClassName?: string;
  asTextarea?: boolean;
}

// Task Assignee Type is imported from ./type

// Task Types (re-exported from service)
export interface TaskType {
  id: string;
  title: string;
  content?: string;
  priority: string;
  taskStatus: string;
  weight: number;
  estimatedHours?: number;
  startDate?: Date;
  dueDateAt?: Date;
  tags?: string[];
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
  sprintId?: string;
  assignees: TaskAssignee[];
  sprint: Sprint | null;
  assigned_section: Sections | null;
  task_feedback: TaskFeedbackType[];
  subtasks: SubTaskType[];
  comments: TaskCommentType[];
  checklists: ChecklistItemType[];
  documents: TaskAttachment[];
}

export interface TaskAttachment {
  document: {
    size: number;
    document_name: string;
    document_file_url: string;
    document_file_mimeType: string;
  };
  taskId: string;
  documentId: string;
}

export interface CreateTaskPayloadType {
  title: string;
  section?: string;
  sprintId?: string;
  assignees?: string[];
  tags?: string[];
  parentTaskId?: string;
}

export interface UpdateTaskPayloadType extends Partial<CreateTaskPayloadType> {
  id: string;
  priority?: string;
}

export interface SubTaskPayloadType {
  taskId: string;
  title: string;
  description?: string;
}

export interface ChecklistItemPayloadType {
  taskId: string;
  title: string;
}

export interface TaskCommentPayloadType {
  taskId: string;
  comment: string;
}

export interface TaskFeedbackPayloadType {
  taskId: string;
  userId: string;
  feedback: string;
  rating: number;
  isPrivate?: boolean;
}

export interface MoveTaskPayloadType {
  taskId: string;
  sectionId: string;
  position: number;
}

export interface TaskCommentType {
  id: string;
  taskId: string;
  comment: string;
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
  title: string;
  completedAt: Date;
  assigned_user: UserType;
}

export interface SubTaskType {
  id: string;
  taskId: string;
  title: string;
  description?: string;
  completed: boolean;
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
  createdByUser: UserType;
}

export interface ChecklistItemType {
  id: string;
  taskId: string;
  title: string;
  completed: boolean;
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
  completedBy?: string;
  completedAt?: Date;
  createdByUser: UserType;
  completedByUser?: UserType;
}

export interface TaskFeedbackType {
  id: string;
  taskId: string;
  userId: string;
  feedback: string;
  rating: number;
  isPrivate: boolean;
  createdAt: Date;
  updatedAt: Date;
  user: UserType;
}

// Task State Types
export interface TaskState {
  tasks: TaskType[];
  isLoading: boolean;
  selectedTask: TaskType | null;
  showDetailDialog: boolean;
  showCreateDialog: boolean;
  showEditDialog: boolean;
  showDeleteModal: boolean;
  filters: TaskSearchFilters;
  sortBy: string;
  sortOrder: 'asc' | 'desc';
}

// Task Action Types
export interface TaskActionHandlers {
  onCreateTask: (data: CreateTaskPayloadType) => Promise<void>;
  onUpdateTask: (data: UpdateTaskPayloadType) => Promise<void>;
  onDeleteTask: (taskId: string) => Promise<void>;
  onCompleteTask: (taskId: string) => Promise<void>;
  onMoveTask: (data: MoveTaskPayloadType) => Promise<void>;
  onAssignTask: (taskId: string, userIds: string[]) => Promise<void>;
  onAddComment: (data: TaskCommentPayloadType) => Promise<void>;
  onAddSubTask: (data: SubTaskPayloadType) => Promise<void>;
  onAddChecklistItem: (data: ChecklistItemPayloadType) => Promise<void>;
  onAddFeedback: (data: TaskFeedbackPayloadType) => Promise<void>;
}

// Task Hook Types
export interface UseTaskReturn {
  state: TaskState;
  actions: TaskActionHandlers;
  utils: {
    getTaskById: (id: string) => TaskType | undefined;
    getTasksByStatus: (status: string) => TaskType[];
    getTasksByPriority: (priority: string) => TaskType[];
    getTasksByAssignee: (userId: string) => TaskType[];
    getTasksBySprint: (sprintId: string) => TaskType[];
    calculateTaskProgress: (task: TaskType) => number;
    isTaskOverdue: (task: TaskType) => boolean;
    getTaskStats: () => {
      total: number;
      completed: number;
      inProgress: number;
      overdue: number;
    };
  };
}

// Task Context Types
export interface TaskContextType {
  state: TaskState;
  actions: TaskActionHandlers;
  utils: UseTaskReturn['utils'];
}

// Task Event Types
export interface TaskEvent {
  type: 'task_created' | 'task_updated' | 'task_deleted' | 'task_completed' | 'task_assigned' | 'comment_added' | 'subtask_added' | 'checklist_item_added' | 'feedback_added';
  payload: {
    task?: TaskType;
    user?: {
      id: string;
      name: string;
      email: string;
    };
    comment?: TaskCommentType;
    subtask?: SubTaskType;
    checklistItem?: ChecklistItemType;
    feedback?: TaskFeedbackType;
  };
  timestamp: Date;
}

// Task Form Types
export interface TaskFormData {
  title: string;
  content?: string;
  priority: 'LOW' | 'MEDIUM' | 'HIGH';
  weight: number;
  estimatedHours?: number;
  startDate?: Date;
  dueDateAt?: Date;
  tags: string[];
  assignees: string[];
  sprintId?: string;
  sectionId?: string;
}

export interface TaskFormErrors {
  title?: string;
  content?: string;
  priority?: string;
  weight?: string;
  estimatedHours?: string;
  startDate?: string;
  dueDateAt?: string;
  tags?: string;
  assignees?: string;
  sprintId?: string;
  sectionId?: string;
}

// Task Filter Types
export interface TaskSearchFilters {
  query?: string;
  priority?: string;
  status?: string;
  assignedToMe?: boolean;
  createdByMe?: boolean;
  sprintId?: string;
  projectId?: string;
  tags?: string[];
  dueDate?: {
    from?: Date;
    to?: Date;
  };
  createdDate?: {
    from?: Date;
    to?: Date;
  };
}

export interface TaskFilterClause {
  OR?: Array<{
    title?: { contains: string; mode: "insensitive" };
    content?: { contains: string; mode: "insensitive" };
  }>;
  priority?: string;
  taskStatus?: string;
  assignees?: { some: { userId: string } };
  createdBy?: string;
  sprintId?: string;
  sprint?: { projectId: string };
  tags?: { hasSome: string[] };
  dueDateAt?: {
    gte?: Date;
    lte?: Date;
  };
  createdAt?: {
    gte?: Date;
    lte?: Date;
  };
}

// Task Statistics Types
export interface TaskStats {
  total: number;
  completed: number;
  inProgress: number;
  overdue: number;
  highPriority: number;
  mediumPriority: number;
  lowPriority: number;
  byStatus: Record<string, number>;
  byPriority: Record<string, number>;
  byAssignee: Record<string, number>;
  bySprint: Record<string, number>;
  completionRate: number;
  averageCompletionTime: number;
}

// Task Board Types
export interface TaskBoardColumn {
  id: string;
  title: string;
  status: string;
  tasks: TaskType[];
  color: string;
  order: number;
}

export interface TaskBoardProps {
  columns: TaskBoardColumn[];
  onTaskMove: (taskId: string, fromColumnId: string, toColumnId: string, position: number) => void;
  onTaskClick: (task: TaskType) => void;
  onCreateTask: (columnId: string) => void;
}

// Task Timeline Types
export interface TaskTimelineEvent {
  id: string;
  type: 'created' | 'updated' | 'completed' | 'assigned' | 'commented' | 'subtask_added' | 'checklist_item_added' | 'feedback_added';
  taskId: string;
  userId: string;
  user: UserType;
  description: string;
  timestamp: Date;
  metadata?: Record<string, any>;
}

export interface TaskTimelineProps {
  taskId: string;
  events: TaskTimelineEvent[];
  onLoadMore: () => void;
  hasMore: boolean;
  isLoading: boolean;
}

// Helper Types
export interface UserType {
  id: string;
  name: string | null;
  email: string;
  avatar?: string | null;
  role?: RoleEnum;
  userStatus?: ActiveStatus;
  first_name?: string;
  last_name?: string;
  lastLoginAt?: Date;
}

export interface Sprint {
  id: string;
  name: string;
  description?: string;
  startDate: Date;
  endDate: Date;
  status: string;
  projectId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Sections {
  id: string;
  name: string;
  description?: string;
  boardId: string;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}
