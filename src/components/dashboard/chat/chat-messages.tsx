"use client";

import { useRef, useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { ChatMessageType } from "@/service/chats/type";

interface ChatMessagesProps {
  messages: ChatMessageType[];
  currentUserId: string;
}

export function ChatMessages({ messages, currentUserId }: ChatMessagesProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  if (messages.length === 0) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-sm text-muted-foreground">No messages yet</p>
      </div>
    );
  }

  function stringToColor(str: string) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    let color = "#";
    for (let i = 0; i < 3; i++) {
      const value = (hash >> (i * 8)) & 0xff;
      color += ("00" + value.toString(16)).substr(-2);
    }
    return color;
  }

  const groupedMessages: { [date: string]: ChatMessageType[] } = {};

  messages.forEach((message) => {
    const date = new Date(message.createdAt).toDateString();
    if (!groupedMessages[date]) {
      groupedMessages[date] = [];
    }
    groupedMessages[date].push(message);
  });

  return (
    <div className="space-y-6">
      {Object.entries(groupedMessages).map(([date, dateMessages]) => (
        <div key={date} className="space-y-4">
          <div className="flex justify-center">
            <div className="bg-muted px-3 py-1 rounded-full text-xs text-muted-foreground bg-white">
              {format(new Date(date), "MMMM d, yyyy")}
            </div>
          </div>

          {dateMessages.map((message, index) => {
            const isCurrentUser = message.senderId === currentUserId;
            const showAvatar = index === 0 || dateMessages[index - 1].senderId !== message.senderId;

            return (
              <div
                key={message.id}
                className={cn("flex items-end gap-2", {
                  "justify-end": isCurrentUser,
                })}
              >
                {!isCurrentUser && showAvatar ? (
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={message.sender.avatar || "/placeholder.svg"} />
                    <AvatarFallback style={{ backgroundColor: stringToColor(message.sender.id), color: "#fff" }}>
                      {message.sender.name?.substring(0, 2) || "U"}
                    </AvatarFallback>
                  </Avatar>
                ) : (
                  !isCurrentUser && <div className="w-8" />
                )}

                <div
                  className={cn("max-w-[70%] rounded-lg px-3 py-2 text-sm", {
                    "bg-[#dcf8c6] text-black rounded-2xl rounded-br-none": isCurrentUser,
                    "bg-white text-black rounded-2xl rounded-bl-none": !isCurrentUser,
                  })}
                >
                  {!isCurrentUser && showAvatar && <p className="text-xs font-medium mb-1">{message.sender.name}</p>}
                  <p>{message.content}</p>
                  <p className="text-xs opacity-70 text-right mt-1">{format(new Date(message.createdAt), "h:mm a")}</p>
                </div>
              </div>
            );
          })}
        </div>
      ))}
      <div ref={messagesEndRef} />
    </div>
  );
}