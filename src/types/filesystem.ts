import { ActiveStatus, RoleEnum } from "@prisma/client";

// Core File System Item Type
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

// File System API Response Types
export type ListFilesResult = {
  success: true;
  files: (FileSystemItem | null)[];
} | {
  error: string;
}

export type FileUploadResult = {
  success: true;
  file: {
    id: string;
    name: string;
    url: string;
  };
} | {
  error: string;
}

export type FileDeleteResult = {
  success: true;
} | {
  error: string;
}

export type FileShareResult = {
  success: true;
} | {
  error: string;
}

// File System Component Props
export interface FileGridProps {
  files: FileSystemItem[];
  onFolderClick: (folderId: string) => void;
  isAdmin: boolean;
}

export interface FileListProps {
  files: FileSystemItem[];
  onFolderClick: (folderId: string) => void;
  isAdmin: boolean;
}

export interface FileExplorerProps {
  isAdmin: boolean;
}

export interface FileToolbarProps {
  isAdmin: boolean;
  currentFolder?: string;
  onFilesUploaded: () => void;
}

export interface FolderBreadcrumbProps {
  path: Array<{ id: string; name: string }>;
  onFolderClick: (folderId: string) => void;
}

export interface ShareFileDialogProps {
  file: FileSystemItem;
  isOpen: boolean;
  onClose: () => void;
}

export interface AssignFolderModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  folderId?: string;
  folderName?: string;
}

export interface FileContextMenuProps {
  isAdmin: boolean;
}

// File System Action Types
export interface FileActionHandlers {
  onFileClick: (file: FileSystemItem) => void;
  onFolderClick: (folderId: string) => void;
  onDeleteFile: (file: FileSystemItem) => Promise<void>;
  onShareFile: (file: FileSystemItem) => void;
  onAssignFolder: (file: FileSystemItem) => void;
}

// File System State Types
export interface FileSystemState {
  files: FileSystemItem[];
  isLoading: boolean;
  selectedFile: FileSystemItem | null;
  showShareDialog: boolean;
  showAssignFolderModal: boolean;
  viewMode: 'grid' | 'list';
  searchQuery: string;
  folderPath: Array<{ id: string; name: string }>;
}

// File System Hook Types
export interface UseFileSystemReturn {
  state: FileSystemState;
  actions: FileActionHandlers;
  utils: {
    formatFileSize: (bytes?: number) => string;
    isFolder: (file: FileSystemItem) => boolean;
    isImage: (file: FileSystemItem) => boolean;
    getFileIcon: (file: FileSystemItem) => React.ReactNode;
  };
}

// File System Filter Types
export interface FileSearchFilters {
  query?: string;
  type?: 'file' | 'folder';
  mimeType?: string;
  uploadedBy?: string;
  size?: {
    min?: number;
    max?: number;
  };
  dateRange?: {
    from?: Date;
    to?: Date;
  };
}

export interface FileFilterClause {
  name?: { contains: string; mode: "insensitive" };
  type?: 'file' | 'folder';
  mimeType?: string;
  uploadedBy?: string;
  size?: {
    gte?: number;
    lte?: number;
  };
  createdAt?: {
    gte?: Date;
    lte?: Date;
  };
}

// File System Permission Types
export interface FilePermission {
  id: string;
  userId: string;
  fileId: string;
  permission: 'view' | 'edit';
  grantedBy: string;
  grantedAt: Date;
}

export interface FileShareInfo {
  file: FileSystemItem;
  permissions: FilePermission[];
  sharedWith: Array<{
    id: string;
    name: string;
    email: string;
    avatar?: string;
    role?: RoleEnum;
  }>;
}

// File System Upload Types
export interface FileUploadProgress {
  file: File;
  progress: number;
  status: 'uploading' | 'completed' | 'error';
  error?: string;
}

export interface FileUploadState {
  files: FileUploadProgress[];
  isUploading: boolean;
  totalProgress: number;
}

// File System Context Types
export interface FileSystemContextType {
  state: FileSystemState;
  actions: FileActionHandlers;
  utils: UseFileSystemReturn['utils'];
}

// File System Event Types
export interface FileSystemEvent {
  type: 'file_uploaded' | 'file_deleted' | 'file_shared' | 'folder_created' | 'file_moved';
  payload: {
    file?: FileSystemItem;
    folder?: FileSystemItem;
    user?: {
      id: string;
      name: string;
      email: string;
    };
  };
  timestamp: Date;
}
