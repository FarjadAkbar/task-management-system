
export type NoteType = {
  id: string;
  title: string;
  content: string;
  visibility: "private" | "shared";
  creatorName?: string;
  // createdAt: string;
  // updatedAt: string;
  // authorId: string;
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

// Response type when fetching multiple notes
export type AllNotesResponseType = {
  notes: NoteType[];
  total: number; // Total number of notes for pagination
  page: number;
  pageSize: number;
};
