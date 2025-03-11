"use client"

import { useState, useEffect } from "react"
import type { FileType } from "@/service/files/type"
import type { UserType } from "@/service/users/type"
import { useShareFileMutation, useRemoveShareMutation } from "@/service/files"
import { useGetUsersQuery } from "@/service/users"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Loader2, Search, X, Check, UserPlus } from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { toast } from "@/hooks/use-toast"

interface ShareFileDialogProps {
  file: FileType
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ShareFileDialog({ file, open, onOpenChange }: ShareFileDialogProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedUsers, setSelectedUsers] = useState<UserType[]>([])
  const [permissions, setPermissions] = useState("view")

  const { data, isLoading } = useGetUsersQuery({search: searchQuery})
  const { mutate: shareFile, isPending: isSharing } = useShareFileMutation()
  const { mutate: removeShare, isPending: isRemoving } = useRemoveShareMutation()

  // Initialize already shared users
  useEffect(() => {
    if (file.sharedWith && file.sharedWith.length > 0) {
      const sharedUsers = file.sharedWith
        .filter((share) => share.sharedWith)
        .map((share) => ({
          id: share.sharedWith!.id,
          name: share.sharedWith!.name,
          email: share.sharedWith!.email,
          avatar: share.sharedWith!.avatar,
          role: share.sharedWith!.role,
        }))

      setSelectedUsers(sharedUsers)
    }
  }, [file])

  const handleUserSelect = (user: UserType) => {
    const isSelected = selectedUsers.some((u) => u.id === user.id)

    if (isSelected) {
      setSelectedUsers(selectedUsers.filter((u) => u.id !== user.id))
    } else {
      setSelectedUsers([...selectedUsers, user])
    }
  }

  const handleRemoveUser = (userId: string) => {
    removeShare(
      { fileId: file.id, userId },
      {
        onSuccess: () => {
          setSelectedUsers(selectedUsers.filter((u) => u.id !== userId))
          toast({
            title: "User removed",
            description: "User has been removed from shared access",
          })
        },
        onError: () => {
          toast({
            title: "Error",
            description: "Failed to remove user from shared access",
            variant: "destructive",
          })
        },
      },
    )
  }

  const handleShareFile = () => {
    if (selectedUsers.length === 0) {
      toast({
        title: "No users selected",
        description: "Please select at least one user to share with",
        variant: "destructive",
      })
      return
    }

    shareFile(
      {
        fileId: file.id,
        userIds: selectedUsers.map((u) => u.id),
        permissions,
      },
      {
        onSuccess: () => {
          toast({
            title: "File shared",
            description: `File has been shared with ${selectedUsers.length} user(s)`,
          })
          onOpenChange(false)
        },
        onError: () => {
          toast({
            title: "Error",
            description: "Failed to share file",
            variant: "destructive",
          })
        },
      },
    )
  }

  // Filter out users that are already selected
  const filteredUsers = data?.users.filter((user) => !selectedUsers.some((u) => u.id === user.id)) || []

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Share File</DialogTitle>
          <DialogDescription>Share "{file.document_name}" with other users</DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Selected users */}
          {selectedUsers.length > 0 && (
            <div className="space-y-2">
              <Label>Selected Users</Label>
              <div className="flex flex-wrap gap-2">
                {selectedUsers.map((user) => (
                  <Badge key={user.id} variant="secondary" className="flex items-center gap-1 pl-1">
                    <Avatar className="h-5 w-5">
                      <AvatarImage src={user.avatar} />
                      <AvatarFallback>{user.name?.substring(0, 2) || user.email?.substring(0, 2)}</AvatarFallback>
                    </Avatar>
                    <span>{user.name || user.email}</span>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-5 w-5 ml-1 text-muted-foreground hover:text-foreground"
                      onClick={() => handleRemoveUser(user.id)}
                      disabled={isRemoving}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Permissions */}
          <div className="space-y-2">
            <Label>Permissions</Label>
            <RadioGroup value={permissions} onValueChange={setPermissions} className="flex space-x-4">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="view" id="view" />
                <Label htmlFor="view">View only</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="edit" id="edit" />
                <Label htmlFor="edit">Can edit</Label>
              </div>
            </RadioGroup>
          </div>

          {/* Search users */}
          <div className="space-y-2">
            <Label>Add Users</Label>
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search users..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          {/* Users list */}
          <ScrollArea className="h-[200px] border rounded-md">
            {isLoading ? (
              <div className="flex items-center justify-center h-full">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
              </div>
            ) : filteredUsers.length === 0 ? (
              <div className="flex items-center justify-center h-full text-muted-foreground">
                {searchQuery ? "No users found" : "No more users available"}
              </div>
            ) : (
              <div className="p-2 space-y-1">
                {filteredUsers.map((user) => (
                  <div
                    key={user.id}
                    className="flex items-center justify-between p-2 rounded-md hover:bg-muted cursor-pointer"
                    onClick={() => handleUserSelect(user)}
                  >
                    <div className="flex items-center gap-2">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={user.avatar} />
                        <AvatarFallback>{user.name?.substring(0, 2) || user.email?.substring(0, 2)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm font-medium">{user.name}</p>
                        <p className="text-xs text-muted-foreground">{user.email}</p>
                      </div>
                    </div>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <UserPlus className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </ScrollArea>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleShareFile} disabled={isSharing || selectedUsers.length === 0}>
            {isSharing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Sharing...
              </>
            ) : (
              <>
                <Check className="mr-2 h-4 w-4" />
                Share
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

