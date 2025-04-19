import API from "@/lib/axios-client";
import {
  AllChatRoomPayloadType,
  AllChatRoomResponseType,
  ChatMessagesResponseType,
  CreateRoomPayloadType,
  GetRoomPayloadType,
  RoomResponseType,
  SendMessagePayloadType,
  VonageSessionPayloadType,
  VonageSessionResponseType,
} from "./type";

export const getChatRoomsFn = async (
  params: AllChatRoomPayloadType
): Promise<AllChatRoomResponseType> => {
  const { keyword, pageSize = 10, pageNumber = 1 } = params;
  const response = await API.get(
    `/chat/rooms?&keyword=${keyword || ""}&pageSize=${pageSize}&pageNumber=${pageNumber}`
  );
  return response.data;
};

export const getRoomFn = async (
  params: GetRoomPayloadType
): Promise<RoomResponseType> => {
  const { roomId, limit, before } = params;
  const response = await API.get(
    `/chat/rooms/${roomId}?limit=${limit}${before ? `&before=${before}` : ""}`
  );
  return response.data;
};

export const createChatMutationFn = async (
  data: CreateRoomPayloadType
): Promise<RoomResponseType> => {
  const response = await API.post(`/chat/rooms`, data);
  return response.data;
};

export const sendMessageFn = async (
  data: SendMessagePayloadType
): Promise<ChatMessagesResponseType> => {
  const response = await API.post(`/chat/messages`, data);
  return response.data;
};

export const createVonageSessionFn = async (
  data: VonageSessionPayloadType
): Promise<VonageSessionResponseType> => {
  const response = await API.post(`/vonage/session`, data);
  return response.data;
};