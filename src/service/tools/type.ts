import { PaginationType } from "@/types";
import { UserType } from "../users/type";

export type CreateToolPayloadType = {
  name: string;
  username: string;
  password: string;
  department: string;
  documentID: string;
  createdBy: string;
};

export type UpdateToolPayloadType = {
  id: string;
  name?: string;
  username?: string;
  password?: string;
  department?: string;
  documentID?: string;
};

export type AllToolsPayloadType = {
  keyword?: string | null;
  department?: string | null;
  pageNumber?: number | null;
  pageSize?: number | null;
  skip?: boolean;
};

export type ToolType = {
  id: string;
  name: string;
  username: string;
  password: string;
  department: string;
  documentID: string;
  document: {
    id: string;
    name: string;
    document_file_url: string;
  };
  createdBy: UserType;
  createdAt: string;
  updatedAt?: string;
  user: string;
};

export type AllToolsResponseType = {
  message: string;
  tools: ToolType[];
  pagination: PaginationType;
};
