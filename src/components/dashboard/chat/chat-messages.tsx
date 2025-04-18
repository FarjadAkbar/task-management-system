"use client"

import { useRef, useEffect } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { FileIcon, FileTextIcon, ImageIcon } from "lucide-react"
import { ChatMessageType } from "@/service/chats/type"


interface ChatMessagesProps {
  messages: ChatMessageType[]
  currentUserId: string
}

export function ChatMessages({ messages, currentUserId }: ChatMessagesProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" })
    }
  }, [messages])

  if (messages.length === 0) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-sm text-muted-foreground">No messages yet</p>
      </div>
    )
  }

  // Group messages by date
  const groupedMessages: { [date: string]: ChatMessageType[] } = {}

  messages.forEach((message) => {
    const date = new Date(message.createdAt).toDateString()
    if (!groupedMessages[date]) {
      groupedMessages[date] = []
    }
    groupedMessages[date].push(message)
  })

  const getFileIcon = (mimeType: string) => {
    if (mimeType.startsWith("image/")) {
      return <ImageIcon className="h-4 w-4" />
    } else if (mimeType.startsWith("text/")) {
      return <FileTextIcon className="h-4 w-4" />
    } else {
      return <FileIcon className="h-4 w-4" />
    }
  }

  const formatFileSize = (bytes?: number) => {
    if (!bytes) return "Unknown size"
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
  }

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
            const isCurrentUser = message.senderId === currentUserId
            const showAvatar = index === 0 || dateMessages[index - 1].senderId !== message.senderId

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
                    <AvatarFallback className="bg-gray-300">
                      {message.sender.name?.substring(0, 2) || message.sender.email?.substring(0, 2) || "U"}
                    </AvatarFallback>
                  </Avatar>
                ) : (
                  !isCurrentUser && <div className="w-8" />
                )}

                <div
                  className={cn("max-w-[70%] rounded-lg px-3 py-2 text-sm", {
                    "bg-[#dcf8c6] text-black rounded-2xl rounded-br-none": isCurrentUser, // WhatsApp green
                    "bg-white text-black rounded-2xl rounded-bl-none": !isCurrentUser,
                  })}
                >
                  {!isCurrentUser && showAvatar && <p className="text-xs font-medium mb-1">{message.sender.name}</p>}

                  {message.content && <p>{message.content}</p>}

                  {message.attachments && message.attachments.length > 0 && (
                    <div className={cn("mt-2", { "mt-0": !message.content })}>
                      {message.attachments.map((attachment) => (
                        <a
                          key={attachment.id}
                          href={attachment.document.document_file_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 p-2 bg-black/5 rounded-md mt-1 hover:bg-black/10 transition"
                        >
                          {getFileIcon(attachment.document.document_file_mimeType)}
                          <div className="overflow-hidden">
                            <p className="text-xs font-medium truncate">{attachment.document.document_name}</p>
                            <p className="text-xs text-muted-foreground">{formatFileSize(attachment.document.size)}</p>
                          </div>
                        </a>
                      ))}
                    </div>
                  )}

                  <p className="text-xs opacity-70 text-right mt-1">{format(new Date(message.createdAt), "h:mm a")}</p>
                </div>
              </div>
            )
          })}
        </div>
      ))}
      <div ref={messagesEndRef} />
    </div>
  )
}

