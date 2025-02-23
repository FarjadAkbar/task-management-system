import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Phone, Video } from "lucide-react"

interface MessagesHeaderProps {
  name: string
  online?: boolean
  avatar: string
}

export function MessagesHeader({ name, online, avatar }: MessagesHeaderProps) {
  return (
    <div className="flex h-16 items-center justify-between px-4">
      <div className="flex items-center gap-3">
        <div className="relative">
          <Avatar>
            <AvatarImage src={avatar} alt={name} />
            <AvatarFallback>{name[0]}</AvatarFallback>
          </Avatar>
          {online && (
            <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-background bg-green-500" />
          )}
        </div>
        <div>
          <h2 className="text-sm font-semibold">{name}</h2>
          {online && <p className="text-xs text-muted-foreground">Online</p>}
        </div>
      </div>
      <div className="flex gap-2">
        <Button variant="ghost" size="icon">
          <Phone className="h-5 w-5" />
        </Button>
        <Button variant="ghost" size="icon">
          <Video className="h-5 w-5" />
        </Button>
      </div>
    </div>
  )
}

