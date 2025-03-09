"use client"

import { useState } from "react"
import { ChatSidebar } from "./chat-sidebar"
import { ChatWindow } from "./chat-window"
import { User } from "next-auth";

export function ChatLayout({ user }: { user: User }) {
  const [activeRoomId, setActiveRoomId] = useState<string | null>(null)

  return (
    <div className="flex h-[calc(100vh-4rem)] overflow-hidden">
      <ChatSidebar activeRoomId={activeRoomId} onRoomSelect={setActiveRoomId} />
      <ChatWindow roomId={activeRoomId} user={user} key={activeRoomId} />
    </div>
  )
}

