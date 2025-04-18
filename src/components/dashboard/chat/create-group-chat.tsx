"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Users } from "lucide-react"
import { useGetUsersQuery } from "@/service/users"
import { useCreateChatRoomMutation } from "@/service/chats"

interface CreateGroupChatProps {
  onGroupCreated: (roomId: string) => void
}

export function CreateGroupChat({ onGroupCreated }: CreateGroupChatProps) {
  const [open, setOpen] = useState(false)
  const [groupName, setGroupName] = useState("")
  const [selectedUsers, setSelectedUsers] = useState<string[]>([])
  const [search, setSearch] = useState("")

  const { data, isLoading } = useGetUsersQuery({ search })
  const { mutate: createRoom, isPending } = useCreateChatRoomMutation()

  const handleUserToggle = (userId: string) => {
    setSelectedUsers((prev) => (prev.includes(userId) ? prev.filter((id) => id !== userId) : [...prev, userId]))
  }

  const handleCreateGroup = () => {
    if (groupName.trim() && selectedUsers.length > 0) {
      createRoom(
        {
          name: groupName.trim(),
          participants: selectedUsers,
          isGroup: true,
        },
        {
          onSuccess: (data) => {
            onGroupCreated(data.room.id)
            setOpen(false)
            resetForm()
          },
        },
      )
    }
  }

  const resetForm = () => {
    setGroupName("")
    setSelectedUsers([])
    setSearch("")
  }

  function stringToColor(str: string) {
    let hash = 0
    for (let i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash)
    }
    let color = "#"
    for (let i = 0; i < 3; i++) {
      const value = (hash >> (i * 8)) & 0xff
      color += ("00" + value.toString(16)).substr(-2)
    }
    return color
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(newOpen) => {
        setOpen(newOpen)
        if (!newOpen) resetForm()
      }}
    >
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Users className="h-4 w-4" />
          <span>New Group</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Create Group Chat</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div>
            <Input
              placeholder="Group Name"
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              className="mb-4"
            />

            <Input
              placeholder="Search users..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="mb-2"
            />
          </div>

          <div className="max-h-[300px] overflow-y-auto border rounded-md">
            {isLoading ? (
              <div className="p-4 text-center">Loading users...</div>
            ) : data?.users && data.users.length > 0 ? (
              <div className="space-y-1 p-2">
                {data.users.map((user) => (
                  <div
                    key={user.id}
                    className="flex items-center gap-3 p-2 rounded-md hover:bg-muted transition-colors"
                  >
                    <Checkbox
                      id={`user-${user.id}`}
                      checked={selectedUsers.includes(user.id)}
                      onCheckedChange={() => handleUserToggle(user.id)}
                    />

                    <label htmlFor={`user-${user.id}`} className="flex items-center gap-3 cursor-pointer flex-1">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={user.avatar || "/placeholder.svg"} />
                        <AvatarFallback style={{ backgroundColor: stringToColor(user.id), color: "#fff" }}>
                          {user.name?.substring(0, 2) || user.email?.substring(0, 2) || "U"}
                        </AvatarFallback>
                      </Avatar>

                      <div>
                        <p className="text-sm font-medium">{user.name}</p>
                        <p className="text-xs text-muted-foreground">{user.email}</p>
                      </div>
                    </label>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-4 text-center">No users found</div>
            )}
          </div>

          <div className="flex justify-between items-center">
            <p className="text-sm text-muted-foreground">
              {selectedUsers.length} user{selectedUsers.length !== 1 ? "s" : ""} selected
            </p>
            <Button onClick={handleCreateGroup} disabled={!groupName.trim() || selectedUsers.length === 0 || isPending}>
              {isPending ? "Creating..." : "Create Group"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
