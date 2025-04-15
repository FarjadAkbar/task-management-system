"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Users, UserPlus, MoreVertical } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useGetUsersQuery } from "@/service/users"

interface GroupInfoProps {
  room: any
  onAddMembers: (userIds: string[]) => void
  onRemoveMember: (userId: string) => void
  onLeaveGroup: () => void
  currentUserId: string
}

export function GroupInfo({ room, onAddMembers, onRemoveMember, onLeaveGroup, currentUserId }: GroupInfoProps) {
  const [open, setOpen] = useState(false)
  const [addMembersOpen, setAddMembersOpen] = useState(false)
  const [search, setSearch] = useState("")
  const [selectedUsers, setSelectedUsers] = useState<string[]>([])

  const { data, isLoading } = useGetUsersQuery({ search })

  const handleUserToggle = (userId: string) => {
    setSelectedUsers((prev) => (prev.includes(userId) ? prev.filter((id) => id !== userId) : [...prev, userId]))
  }

  const handleAddMembers = () => {
    if (selectedUsers.length > 0) {
      onAddMembers(selectedUsers)
      setAddMembersOpen(false)
      setSelectedUsers([])
    }
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

  const isAdmin = room.createdBy === currentUserId

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className="gap-2">
          <Users className="h-4 w-4" />
          <span>Group Info</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{room.name}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-medium">Members ({room.participants.length})</h3>

            <Dialog open={addMembersOpen} onOpenChange={setAddMembersOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm" className="gap-1">
                  <UserPlus className="h-4 w-4" />
                  <span>Add</span>
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Add Members</DialogTitle>
                </DialogHeader>

                <div className="space-y-4 py-4">
                  <Input placeholder="Search users..." value={search} onChange={(e) => setSearch(e.target.value)} />

                  <div className="max-h-[300px] overflow-y-auto border rounded-md">
                    {isLoading ? (
                      <div className="p-4 text-center">Loading users...</div>
                    ) : data?.users && data.users.length > 0 ? (
                      <div className="space-y-1 p-2">
                        {data.users
                          .filter((user) => !room.participants.some((p: any) => p.id === user.id))
                          .map((user) => (
                            <div
                              key={user.id}
                              className="flex items-center gap-3 p-2 rounded-md hover:bg-muted transition-colors"
                              onClick={() => handleUserToggle(user.id)}
                            >
                              <Avatar className="h-8 w-8">
                                <AvatarImage src={user.avatar || "/placeholder.svg"} />
                                <AvatarFallback style={{ backgroundColor: stringToColor(user.id), color: "#fff" }}>
                                  {user.name?.substring(0, 2) || user.email?.substring(0, 2) || "U"}
                                </AvatarFallback>
                              </Avatar>

                              <div className="flex-1">
                                <p className="text-sm font-medium">{user.name}</p>
                                <p className="text-xs text-muted-foreground">{user.email}</p>
                              </div>

                              <div
                                className={`h-5 w-5 rounded-full border-2 ${
                                  selectedUsers.includes(user.id)
                                    ? "bg-primary border-primary"
                                    : "border-muted-foreground"
                                }`}
                              >
                                {selectedUsers.includes(user.id) && (
                                  <div className="flex items-center justify-center h-full text-white">
                                    <svg
                                      width="15"
                                      height="15"
                                      viewBox="0 0 15 15"
                                      fill="none"
                                      xmlns="http://www.w3.org/2000/svg"
                                    >
                                      <path
                                        d="M11.4669 3.72684C11.7558 3.91574 11.8369 4.30308 11.648 4.59198L7.39799 11.092C7.29783 11.2452 7.13556 11.3467 6.95402 11.3699C6.77247 11.3931 6.58989 11.3355 6.45446 11.2124L3.70446 8.71241C3.44905 8.48022 3.43023 8.08494 3.66242 7.82953C3.89461 7.57412 4.28989 7.55529 4.5453 7.78749L6.75292 9.79441L10.6018 3.90792C10.7907 3.61902 11.178 3.53795 11.4669 3.72684Z"
                                        fill="currentColor"
                                        fillRule="evenodd"
                                        clipRule="evenodd"
                                      ></path>
                                    </svg>
                                  </div>
                                )}
                              </div>
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
                    <Button onClick={handleAddMembers} disabled={selectedUsers.length === 0}>
                      Add to Group
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          <div className="max-h-[300px] overflow-y-auto border rounded-md">
            {room.participants.map((participant: any) => (
              <div
                key={participant.id}
                className="flex items-center justify-between gap-3 p-3 hover:bg-muted transition-colors"
              >
                <div className="flex items-center gap-3">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={participant.avatar || "/placeholder.svg"} />
                    <AvatarFallback style={{ backgroundColor: stringToColor(participant.id), color: "#fff" }}>
                      {participant.name?.substring(0, 2) || participant.email?.substring(0, 2) || "U"}
                    </AvatarFallback>
                  </Avatar>

                  <div>
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium">{participant.name}</p>
                      {participant.id === room.createdBy && (
                        <span className="text-xs bg-muted px-1.5 py-0.5 rounded">Admin</span>
                      )}
                      {participant.id === currentUserId && (
                        <span className="text-xs bg-muted px-1.5 py-0.5 rounded">You</span>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground">{participant.email}</p>
                  </div>
                </div>

                {(isAdmin || participant.id === currentUserId) && participant.id !== room.createdBy && (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      {isAdmin && participant.id !== currentUserId && (
                        <DropdownMenuItem onClick={() => onRemoveMember(participant.id)}>
                          Remove from group
                        </DropdownMenuItem>
                      )}
                      {participant.id === currentUserId && (
                        <DropdownMenuItem onClick={onLeaveGroup} className="text-destructive">
                          Leave group
                        </DropdownMenuItem>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                )}
              </div>
            ))}
          </div>

          {currentUserId !== room.createdBy && (
            <Button variant="destructive" className="w-full" onClick={onLeaveGroup}>
              Leave Group
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
