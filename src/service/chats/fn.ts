import API from "@/lib/axios-client";
import {
  AllChatRoomPayloadType,
  AllChatRoomResponseType,
  ChatMessagesResponseType,
  ChatMessageType,
  ChatRoomType,
  CreateRoomPayloadType,
  GetRoomPayloadType,
  RoomResponseType,
  SendMessagePayloadType,
} from "./type";

// CHAT ROOM
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

// MESSAGES
export const sendMessageFn = async (
  data: SendMessagePayloadType
): Promise<ChatMessagesResponseType> => {
  const response = await API.post(`/chat/messages`, data);
  return response.data;
};




// Add members to a group
export const addMembersToGroupFn = async ({
  roomId,
  userIds,
}: {
  roomId: string
  userIds: string[]
}): Promise<RoomResponseType> => {
  const response = await API.post(`/chat/rooms/${roomId}/members`, { userIds })
  return response.data
}

// Remove a member from a group
export const removeMemberFromGroupFn = async ({
  roomId,
  memberId,
}: {
  roomId: string
  memberId: string
}): Promise<RoomResponseType> => {
  const response = await API.delete(`/chat/rooms/${roomId}/members`, {
    data: { memberId },
  })
  return response.data
}

// Leave a group
export const leaveGroupFn = async (roomId: string): Promise<{ message: string }> => {
  const response = await API.post(`/chat/rooms/${roomId}`)
  return response.data
}
