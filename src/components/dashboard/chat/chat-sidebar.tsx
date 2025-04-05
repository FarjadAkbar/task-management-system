"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { ChatRoomsList } from "./chat-rooms-list"
import { ChatUsersList } from "./chat-users-list"
import { Search, MessageSquare, Users } from "lucide-react"

interface ChatSidebarProps {
  activeRoomId: string | null
  onRoomSelect: (roomId: string) => void
}

export function ChatSidebar({ activeRoomId, onRoomSelect }: ChatSidebarProps) {
  const [activeTab, setActiveTab] = useState("chats")
  const [searchQuery, setSearchQuery] = useState("")

  return (
    <div className="w-80 border-r flex flex-col h-full">
      <div className="p-4 border-b">
        <h2 className="text-xl font-semibold mb-4">Messages</h2>
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search..."
            className="pl-8 border-0 border-b-2 border-gold focus:border-black focus:outline-none rounded-0 focus-visible:ring-transparent focus-visible:ring-offset-0"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <Tabs defaultValue="chats" className="flex-1 flex flex-col" onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-2 mx-4 mt-2 bg-black">
          <TabsTrigger value="chats" className="flex items-center gap-2 text-gold">
            <MessageSquare className="h-4 w-4" />
            <span>Chats</span>
          </TabsTrigger>
          <TabsTrigger value="users" className="flex items-center gap-2 text-gold">
            <Users className="h-4 w-4" />
            <span>Users</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="chats" className="flex-1 pt-2">
          <ScrollArea className="h-full">
            <ChatRoomsList search={searchQuery} activeRoomId={activeRoomId} onRoomSelect={onRoomSelect} />
          </ScrollArea>
        </TabsContent>

        <TabsContent value="users" className="flex-1 pt-2">
          <ScrollArea className="h-full">
            <ChatUsersList
              search={searchQuery}
              onUserSelect={(userId) => {
                // Create or open a direct message chat
                console.log("Selected user:", userId)
                setActiveTab("chats")
              }}
            />
          </ScrollArea>
        </TabsContent>
      </Tabs>
    </div>
  )
}

