"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Info, Phone, Video } from "lucide-react"

interface TypingUser {
  userId: string
  username: string
}

interface ChatHeaderProps {
  room: any
  typingUsers: TypingUser[]
}

export function ChatHeader({ room, typingUsers }: ChatHeaderProps) {
  if (!room) return null

  const otherParticipants = room.participants.slice(0, 3)
  const hasMoreParticipants = room.participants.length > 3

  return (
    <div className="border-b p-4 flex items-center justify-between">
      <div className="flex items-center gap-3">
        {room.isGroup ? (
          <Avatar className="h-10 w-10">
            <AvatarFallback>{room.name?.substring(0, 2) || "GR"}</AvatarFallback>
          </Avatar>
        ) : (
          <Avatar className="h-10 w-10">
            <AvatarImage src={otherParticipants[0]?.avatar} />
            <AvatarFallback>
              {otherParticipants[0]?.name?.substring(0, 2) || otherParticipants[0]?.email?.substring(0, 2) || "DM"}
            </AvatarFallback>
          </Avatar>
        )}

        <div>
          <h3 className="font-medium">{room.name}</h3>
          <p className="text-xs text-muted-foreground">
            {typingUsers.length > 0 ? (
              <span className="text-primary animate-pulse">
                {typingUsers.length === 1
                  ? `${typingUsers[0].username} is typing...`
                  : `${typingUsers.length} people are typing...`}
              </span>
            ) : (
              <>{room.isGroup ? `${room.participants.length} participants` : "Online"}</>
            )}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-1">
        <Button variant="ghost" size="icon">
          <Phone className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon">
          <Video className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon">
          <Info className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}

