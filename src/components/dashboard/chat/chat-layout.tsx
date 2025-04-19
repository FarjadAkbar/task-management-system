"use client";

import { useState } from "react";
import { ChatSidebar } from "./chat-sidebar";
import { ChatWindow } from "./chat-window";
import { User } from "next-auth";
import { CallProvider } from "@/context/call-context";
import { CallManager } from "./call/call-manager";

export function ChatLayout({ user }: { user: User }) {
  const [activeRoomId, setActiveRoomId] = useState<string | null>(null);

  return (
    <CallProvider user={user} apiKey={process.env.NEXT_PUBLIC_VONAGE_API_KEY!}>
      <div className="flex h-[calc(100vh-4rem)] overflow-hidden">
        <ChatSidebar activeRoomId={activeRoomId} onRoomSelect={setActiveRoomId} />
        <ChatWindow roomId={activeRoomId} user={user} key={activeRoomId} />
        <CallManager />
      </div>
    </CallProvider>
  );
}