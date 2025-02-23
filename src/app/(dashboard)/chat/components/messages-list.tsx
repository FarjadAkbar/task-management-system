import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"

interface Message {
  id: string
  content: string
  sender: string
  timestamp: string
  isMe: boolean
  avatar: string
}

interface MessagesListProps {
  messages: Message[]
}

export function MessagesList({ messages }: MessagesListProps) {
  return (
    <div className="space-y-4">
      {messages.map((message) => (
        <div key={message.id} className={cn("flex items-end gap-2", message.isMe && "flex-row-reverse")}>
          <Avatar className="h-8 w-8">
            <AvatarImage src={message.avatar} alt={message.sender} />
            <AvatarFallback>{message.sender[0]}</AvatarFallback>
          </Avatar>
          <div
            className={cn(
              "rounded-lg px-4 py-2",
              message.isMe ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground",
            )}
          >
            <p className="text-sm">{message.content}</p>
            <span className="mt-1 text-xs opacity-75">{message.timestamp}</span>
          </div>
        </div>
      ))}
    </div>
  )
}

