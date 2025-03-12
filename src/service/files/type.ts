import { PaginationType } from "@/types";
import { UserType } from "../users/type";

// Types
export type FileType = {
  id: string;
  document_name: string;
  document_file_url: string;
  document_file_mimeType: string;
  description?: string;
  createdAt: string;
  size?: number;
  created_by?: UserType;
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
  files: FileType[];
  pagination: PaginationType;
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
