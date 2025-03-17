import API from "@/lib/axios-client";
import {
  CreateNotePayloadType,
  UpdateNotePayloadType,
  AllNotesPayloadType,
  NoteType,
  AllNotesResponseType,
} from "./type";

// Create a Note
export const createNoteMutationFn = async (
  data: CreateNotePayloadType
): Promise<{ message: string; note: NoteType }> => {
  const response = await API.post(`/notes`, data);
  return response.data;
};

// Edit a Note
export const editNoteMutationFn = async (
  data: UpdateNotePayloadType
): Promise<{ message: string; note: NoteType }> => {
  const response = await API.put(`/notes/${data.id}`, data);
  return response.data;
};

// Delete a Note
export const deleteNoteMutationFn = async (
  noteId: string
): Promise<{ message: string }> => {
  const response = await API.delete(`/notes/${noteId}`); 
  return response.data;
};

export const getAllNotesQueryFn = async (): Promise<AllNotesResponseType> => {
    const response = await fetch("/api/notes");
    if (!response.ok) throw new Error("Failed to fetch notes");
    return response.json();
  };

// Get a Single Note by ID
export const getNoteByIdQueryFn = async (
  noteId: string
): Promise<{ message: string; note: NoteType }> => {
  const response = await API.get(`/notes/${noteId}`);
  return response.data;
};

