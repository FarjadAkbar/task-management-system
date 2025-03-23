"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Bell, ChevronDown, LogOut, Settings, User } from "lucide-react"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

type AvatarDropdownProps = {
  avatar: string
  userId: string
  name: string
  email: string
}

export function AvatarDropdown({ avatar, userId, name, email }: AvatarDropdownProps) {
  const [notificationCount, setNotificationCount] = useState(3)

  return (
    <div className="flex items-center gap-4">
      {/* <Button variant="ghost" size="icon" className="relative">
        <Bell className="h-5 w-5 text-white" />
        {notificationCount > 0 && (
          <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center bg-amber-400 text-black">
            {notificationCount}
          </Badge>
        )}
      </Button> */}

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="flex items-center gap-2 p-1 hover:bg-white/10 rounded-full">
            <div className="relative h-8 w-8 rounded-full overflow-hidden border-2 border-amber-400">
              <Image src={avatar || "/placeholder.svg?height=32&width=32"} alt={name} fill className="object-cover" />
            </div>
            <span className="text-sm font-medium hidden md:inline-block  text-white">{name}</span>
            <ChevronDown className="h-4 w-4 text-white/70" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <div className="flex items-center gap-2 p-2">
            <div className="relative h-10 w-10 rounded-full overflow-hidden">
              <Image src={avatar || "/placeholder.svg?height=40&width=40"} alt={name} fill className="object-cover" />
            </div>
            <div className="flex flex-col">
              <span className="font-medium">{name}</span>
              <span className="text-xs text-muted-foreground">{email}</span>
            </div>
          </div>
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild>
            <Link href={`/profile`} className="cursor-pointer">
              <User className="mr-2 h-4 w-4" />
              <span>Profile</span>
            </Link>
          </DropdownMenuItem>
          {/* <DropdownMenuItem asChild>
            <Link href="/settings" className="cursor-pointer">
              <Settings className="mr-2 h-4 w-4" />
              <span>Settings</span>
            </Link>
          </DropdownMenuItem> */}
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild>
            <Link href="/logout" className="cursor-pointer text-destructive">
              <LogOut className="mr-2 h-4 w-4" />
              <span>Logout</span>
            </Link>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}

