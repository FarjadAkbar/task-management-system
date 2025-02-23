"use client"

import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { MessagesHeader } from "./messages-header"
import { MessagesList } from "./messages-list"
import { MessageInput } from "./message-input"
import { ConversationSidebar } from "./conversation-sidebar"

// Sample data - replace with your actual data
const conversations = [
  {
    id: "1",
    name: "Alice Smith",
    lastMessage: "Hey, how's the project going?",
    timestamp: "2:30 PM",
    unread: 2,
    online: true,
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: "2",
    name: "Bob Johnson",
    lastMessage: "Can you review the documents?",
    timestamp: "Yesterday",
    unread: 0,
    online: false,
    avatar: "/placeholder.svg?height=40&width=40",
  },
  // Add more conversations as needed
]

const messages = [
  {
    id: "1",
    content: "Hey, how's the project going?",
    sender: "Alice Smith",
    timestamp: "2:30 PM",
    isMe: false,
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: "2",
    content: "It's going well! I've completed the initial designs.",
    sender: "Me",
    timestamp: "2:31 PM",
    isMe: true,
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: "3",
    content: "That's great! Can you share them with me?",
    sender: "Alice Smith",
    timestamp: "2:32 PM",
    isMe: false,
    avatar: "/placeholder.svg?height=40&width=40",
  },
  // Add more messages as needed
]

export function MessagesView() {
  return (
    <div className="flex h-[calc(100vh-4rem)] overflow-hidden">
      <ConversationSidebar conversations={conversations} />
      <Separator orientation="vertical" />
      <div className="flex flex-1 flex-col">
        <MessagesHeader name="Alice Smith" online={true} avatar="/placeholder.svg?height=40&width=40" />
        <Separator />
        <ScrollArea className="flex-1 p-4">
          <MessagesList messages={messages} />
        </ScrollArea>
        <Separator />
        <MessageInput />
      </div>
    </div>
  )
}

