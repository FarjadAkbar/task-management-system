"use client"

import { useState } from "react"
import { ChatSidebar } from "./chat-sidebar"
import { ChatWindow } from "./chat-window"
import { User } from "next-auth";
import { CallProvider } from "@/context/call-context";
import { useChatSocket } from "@/service/chats";

export function ChatLayout({ user }: { user: User }) {
  const [activeRoomId, setActiveRoomId] = useState<string | null>(null)
  const { socket } = useChatSocket(user, activeRoomId || undefined);
  
  return (
    <CallProvider user={user} socket={socket}>
    <div className="flex h-[calc(100vh-4rem)] overflow-hidden">
      <ChatSidebar activeRoomId={activeRoomId} onRoomSelect={setActiveRoomId} />
      <ChatWindow roomId={activeRoomId} user={user} key={activeRoomId} />
    </div>
    </CallProvider>
  )
}

