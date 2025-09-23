import { ActiveStatus, RoleEnum } from "@prisma/client";

export interface Session {
    id: string;
    _id: string;
    name: string;
    role?: string;
    avatar?: string | null | undefined;
    isAdmin: boolean;
    userStatus: string;
}

// Socket.IO types
export interface SocketUser {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role?: RoleEnum;
  userStatus?: ActiveStatus;
}

export interface SocketInstance {
  emit: (event: string, data: any) => void;
  on: (event: string, callback: (data: any) => void) => void;
  off: (event: string) => void;
  disconnect: () => void;
}

// File System types - matching the actual data structure from listFiles
export interface FileSystemItem {
  id: string;
  name: string;
  mimeType: string;
  size?: number;
  webViewLink?: string | null;
  createdTime?: string | null;
  modifiedTime?: string | null;
  dbId?: string;
  permission?: string;
  fullPath?: string;
  thumbnailLink?: string;
}

// Type for the actual return from listFiles function
export type ListFilesResult = {
  success: true;
  files: (FileSystemItem | null)[];
} | {
  error: string;
}

// Re-export types from dedicated modules
export * from './filesystem';
export * from './tasks';

// Task Assignee types
export interface TaskAssignee {
  id: string;
  userId: string;
  taskId: string;
  assignedAt: Date;
  user: {
    id: string;
    name: string;
    email: string;
    avatar?: string;
    role?: RoleEnum;
  };
}

// Error types
export interface ApiError {
  message: string;
  code?: string;
  statusCode?: number;
  details?: Record<string, any>;
}

export interface ValidationError extends ApiError {
  field: string;
  value: any;
}

// Prisma Where clause types
export interface TaskWhereClause {
  OR?: Array<{
    createdBy?: string;
    assignees?: { some: { userId: string } };
    sprint?: {
      project?: {
        members?: { some: { userId: string } };
        createdById?: string;
      };
    };
  }>;
  AND?: Array<{
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
  }>;
}

export interface ProjectWhereClause {
  id?: string;
  createdById?: string;
  members?: { some: { userId: string } };
  name?: { contains: string; mode: "insensitive" };
}

export interface UserWhereClause {
  id?: string;
  email?: string;
  name?: { contains: string; mode: "insensitive" };
  role?: RoleEnum;
  userStatus?: ActiveStatus;
}

// Filter Types
export interface TaskSearchFilters {
  query?: string;
  priority?: string;
  status?: string;
  assignedToMe?: boolean;
  createdByMe?: boolean;
  sprintId?: string;
  projectId?: string;
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
}

export interface ProjectSearchFilters {
  query?: string;
  status?: string;
  createdByMe?: boolean;
  memberOf?: boolean;
}

export interface ProjectFilterClause {
  name?: { contains: string; mode: "insensitive" };
  status?: string;
  createdById?: string;
  members?: { some: { userId: string } };
}

export interface UserSearchFilters {
  query?: string;
  role?: RoleEnum;
  status?: ActiveStatus;
}

export interface UserFilterClause {
  OR?: Array<{
    name?: { contains: string; mode: "insensitive" };
    email?: { contains: string; mode: "insensitive" };
  }>;
  role?: RoleEnum;
  userStatus?: ActiveStatus;
}

export interface FileSearchFilters {
  query?: string;
  type?: 'file' | 'folder';
  mimeType?: string;
  uploadedBy?: string;
}

export interface FileFilterClause {
  name?: { contains: string; mode: "insensitive" };
  type?: 'file' | 'folder';
  mimeType?: string;
  uploadedBy?: string;
}
  