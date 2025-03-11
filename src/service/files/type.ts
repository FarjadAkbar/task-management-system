// Types
export type FileType = {
  id: string;
  document_name: string;
  document_file_url: string;
  document_file_mimeType: string;
  description?: string;
  createdAt: string;
  size?: number;
  created_by?: {
    id: string;
    name: string;
    email: string;
    avatar?: string;
  };
  sharedWith?: Array<{
    id: string;
    permissions: string;
    sharedWith?: {
      id: string;
      name: string;
      email: string;
      avatar?: string;
      role?: string;
    };
    sharedBy?: {
      id: string;
      name: string;
      email: string;
      avatar?: string;
    };
  }>;
}

export type FilesResponseType = {
  message: string;
  files: File[];
  pagination: {
    totalCount: number;
    pageSize: number;
    currentPage: number;
    totalPages: number;
  };
}

export type FileQueryParams = {
  search?: string;
  type?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  page?: number;
  limit?: number;
}

export type ShareFilePayload = {
  fileId: string;
  userIds: string[];
  permissions?: string;
}
