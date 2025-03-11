import { PaginationType } from "@/types";

export type CreateNotePayloadType = {
  title: string;
  content: string;
  visibility: string;
  createdBy: string;
};

export type UpdateNotePayloadType = {
  id: string;
  title?: string;
  content?: string;
};

export type AllNotesPayloadType = {
  visibility?: string | null;
  pageNumber?: number | null;
  pageSize?: number | null;
  skip?: boolean;
};

export type NoteType = {
  id: string;
  title: string;
  content: string;
  visibility: string;
  createdBy: {
    id: string;
    name: string;
  };
  createdAt: string;
  updatedAt?: string;
  user: string;
};

export type AllNotesResponseType = {
  message: string;
  tools: NoteType[];
  pagination: PaginationType;
};
