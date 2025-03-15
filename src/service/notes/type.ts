
export type NoteType = {
  id: string;
  title: string;
  content: string;
  visibility: "private" | "shared";
  creatorName?: string;
  authorId: string;
};


export type CreateNotePayloadType = {
  title: string;
  content: string;
  visibility: "private" | "shared";
};

// Type for updating a note
export type UpdateNotePayloadType = {
  id: string;
  title?: string;
  content?: string;
  visibility?: "private" | "shared";
};

export type AllNotesPayloadType = {
  keyword?: string;
  category?: string;
  pageSize?: number;
  pageNumber?: number;
};

export type AllNotesResponseType = {
  notes: NoteType[];
  total: number; 
  page: number;
  pageSize: number;
};
