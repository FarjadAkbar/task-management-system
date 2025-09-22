import { PaginationType } from "@/types";
import { UserType } from "../users/type";

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
  lastMessage: {
    sender: UserType;
    content: string;
  };
  unreadCount: number;
  participants: UserType[];
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

export type ChatAttachment = {
  id: string
  document: {
    id: string
    document_name: string
    document_file_url: string
    document_file_mimeType: string
    size?: number
  }
}

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
    avatar: string;
    email: string;
  };
  attachments: ChatAttachment[];
  room: ChatRoomType;
};


export type SendMessagePayloadType = {
  content: string;
  roomId: string;
  files?: Array<{ id: string; name: string; url: string }>
};


export type ChatMessagesResponseType = {
  message: string;
  chatMessage: ChatMessageType[];
};

