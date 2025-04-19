import { PaginationType } from "@/types";

export type CreateRoomPayloadType = {
  name?: string;
  isGroup?: boolean;
  participants: string[];
};

export type GetRoomPayloadType = {
  roomId: string;
  limit: number;
  before?: string;
};

export type AllChatRoomPayloadType = {
  keyword?: string | null;
  pageNumber?: number | null;
  pageSize?: number | null;
  skip?: boolean;
};

export type ChatRoomType = {
  id: string;
  name: string;
  isGroup: boolean;
  lastMessage: string;
  unreadCount: number;
  participants: {
    id: string;
    name: string;
  }[];
  messages?: ChatMessageType[];
  updatedAt: string;
};

export type TypingUserType = {
  userId: string;
  username: string;
};

export type AllChatRoomResponseType = {
  message: string;
  rooms: ChatRoomType[];
  pagination: PaginationType;
};

export type RoomResponseType = {
  message: string;
  room: ChatRoomType;
};

export type ChatMessageType = {
  id: string;
  content: string;
  senderId: string;
  roomId: string;
  createdAt: Date;
  isRead: boolean;

  sender: {
    id: string;
    name: string;
  };

  room: ChatRoomType;
};


export type SendMessagePayloadType = {
  content: string;
  roomId: string;
};


export type ChatMessagesResponseType = {
  message: string;
  chatMessage: ChatMessageType[];
};

// Vonage-specific types
export type VonageSessionPayloadType = {
  roomId: string;
};

export type VonageSessionResponseType = {
  message: string;
  sessionId: string;
  token: string;
};