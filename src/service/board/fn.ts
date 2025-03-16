// api.ts
import API from "@/lib/axios-client";
import type { BoardWithSectionsType, BoardPayloadType, SectionPayloadType } from "./type";
import type { Boards, Sections } from "@prisma/client";

export const fetchBoards = async (projectId: string): Promise<BoardWithSectionsType[]> => {
  const response = await API.get<{ boards: BoardWithSectionsType[] }>(`/projects/${projectId}/boards`);
  return response.data.boards;
};

export const fetchBoard = async (boardId: string): Promise<BoardWithSectionsType> => {
  const response = await API.get<{ board: BoardWithSectionsType }>(`/boards/${boardId}`);
  return response.data.board;
};

export const fetchSections = async (boardId: string): Promise<Sections[]> => {
  const response = await API.get<{ sections: Sections[] }>(`/boards/${boardId}/sections`);
  return response.data.sections;
};

export const createBoard = async (data: BoardPayloadType): Promise<Boards> => {
  const response = await API.post<{ board: Boards }>("/boards", data);
  return response.data.board;
};

export const updateBoard = async (
  boardId: string,
  data: Partial<BoardPayloadType>
): Promise<Boards> => {
  const response = await API.put<{ board: Boards }>(`/boards/${boardId}`, data);
  return response.data.board;
};

export const deleteBoard = async (boardId: string): Promise<void> => {
  await API.delete(`/boards/${boardId}`);
};

export const createSection = async (
  boardId: string,
  data: SectionPayloadType
): Promise<Sections> => {
  const response = await API.post<{ section: Sections }>(`/boards/${boardId}/sections`, data);
  return response.data.section;
};

export const updateSection = async (
  sectionId: string,
  data: Partial<SectionPayloadType>
): Promise<Sections> => {
  const response = await API.put<{ section: Sections }>(`/sections/${sectionId}`, data);
  return response.data.section;
};

export const deleteSection = async (sectionId: string): Promise<void> => {
  await API.delete(`/sections/${sectionId}`);
};
