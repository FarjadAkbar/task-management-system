import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"
import { Search } from "lucide-react"

interface Conversation {
  id: string
  name: string
  lastMessage: string
  timestamp: string
  unread: number
  online: boolean
  avatar: string
}

interface ConversationSidebarProps {
  conversations: Conversation[]
}

export function ConversationSidebar({ conversations }: ConversationSidebarProps) {
  return (
    <div className="flex w-80 flex-col">
      <div className="p-4">
        <div className="relative">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <input
            placeholder="Search messages..."
            className="w-full rounded-md border border-input bg-background pl-9 pr-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          />
        </div>
      </div>
      <ScrollArea className="flex-1">
        <div className="space-y-1 p-2">
          {conversations.map((conversation) => (
            <Button
              key={conversation.id}
              variant="ghost"
              className={cn("w-full justify-start px-2", conversation.unread && "font-semibold")}
            >
              <div className="flex w-full items-center gap-3">
                <div className="relative">
                  <Avatar>
                    <AvatarImage src={conversation.avatar} alt={conversation.name} />
                    <AvatarFallback>{conversation.name[0]}</AvatarFallback>
                  </Avatar>
                  {conversation.online && (
                    <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-background bg-green-500" />
                  )}
                </div>
                <div className="flex flex-1 flex-col items-start gap-1">
                  <div className="flex w-full justify-between">
                    <span className="text-sm">{conversation.name}</span>
                    <span className="text-xs text-muted-foreground">{conversation.timestamp}</span>
                  </div>
                  <div className="flex w-full justify-between">
                    <span className="text-xs text-muted-foreground line-clamp-1">{conversation.lastMessage}</span>
                    {conversation.unread > 0 && (
                      <span className="ml-auto flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">
                        {conversation.unread}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </Button>
          ))}
        </div>
      </ScrollArea>
    </div>
  )
}

