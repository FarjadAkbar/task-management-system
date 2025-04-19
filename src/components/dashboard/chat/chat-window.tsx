"use client";

import { useEffect, useRef, useState } from "react";
import { ChatHeader } from "./chat-header";
import { ChatMessages } from "./chat-messages";
import { ChatInput } from "./chat-input";
import { Loader2 } from "lucide-react";
import { useGetChatRoomQuery, useSendMessageMutation } from "@/service/chats";
import { User } from "next-auth";

interface ChatWindowProps {
  roomId: string | null;
  user: User;
}

export function ChatWindow({ roomId, user }: ChatWindowProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [message, setMessage] = useState("");
  const { data, isLoading } = useGetChatRoomQuery({ roomId: roomId || "", limit: 50 });
  const { mutate: sendMessage, isPending: isSending } = useSendMessageMutation(roomId || "");

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [data?.room?.messages]);

  const handleSendMessage = () => {
    if (!roomId || !message.trim() || isSending) return;

    sendMessage({
      content: message.trim(),
      roomId,
    });

    setMessage("");
  };

  const handleInputChange = (value: string) => {
    setMessage(value);
  };

  if (!roomId) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <h3 className="text-lg font-medium">Select a chat to start messaging</h3>
          <p className="text-sm text-muted-foreground mt-1">Choose an existing conversation or start a new one</p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col h-full">
      <ChatHeader room={data?.room} currentUserId={user.id} />
      <div className="flex-1 overflow-y-auto p-4">
        <ChatMessages messages={data?.room?.messages || []} currentUserId={user.id} />
        <div ref={messagesEndRef} />
      </div>
      <ChatInput
        value={message}
        onChange={handleInputChange}
        onSend={handleSendMessage}
        isLoading={isSending}
        disabled={!roomId}
      />
    </div>
  );
}