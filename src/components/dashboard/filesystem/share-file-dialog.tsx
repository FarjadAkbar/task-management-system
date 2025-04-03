"use client"

import { useState, useEffect } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { toast } from "@/hooks/use-toast"
import { shareFile, getFileShares, removeSharing } from "@/actions/filesystem"
import { Loader2, X } from "lucide-react"

interface ShareFileDialogProps {
  file: {
    id: string
    name: string
    dbId?: string
  }
  isOpen: boolean
  onClose: () => void
}

export function ShareFileDialog({ file, isOpen, onClose }: ShareFileDialogProps) {
  const [users, setUsers] = useState<any[]>([])
  const [selectedUser, setSelectedUser] = useState<string>("")
  const [permission, setPermission] = useState<"view" | "edit">("view")
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [shares, setShares] = useState<any[]>([])

  // Load users and current shares
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true)

      try {
        // Load users
        const usersResponse = await fetch("/api/users")
        const usersData = await usersResponse.json()
        setUsers(usersData.users || [])

        // Load current shares
        if (file.dbId) {
          const sharesResult = await getFileShares(file.dbId)
          if (sharesResult.success) {
            setShares(sharesResult.shares || [])
          }
        }
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load users",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    if (isOpen) {
      loadData()
    }
  }, [isOpen, file.dbId])

  const handleShare = async () => {
    if (!selectedUser || !file.dbId) return

    setIsSubmitting(true)

    try {
      const result = await shareFile({
        fileId: file.dbId,
        userId: selectedUser,
        permission,
      })

      if (result.error) {
        toast({
          title: "Error",
          description: typeof result.error === "string" ? result.error : "Failed to share file",
          variant: "destructive",
        })
        return
      }

      toast({
        title: "Success",
        description: "File shared successfully",
      })

      // Refresh shares
      const sharesResult = await getFileShares(file.dbId)
      if (sharesResult.success) {
        setShares(sharesResult.shares || [])
      }

      // Reset form
      setSelectedUser("")
    } catch (error) {
      toast({
        title: "Error",
        description: "Something went wrong",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleRemoveShare = async (shareId: string) => {
    try {
      const result = await removeSharing(shareId)

      if (result.error) {
        toast({
          title: "Error",
          description: result.error,
          variant: "destructive",
        })
        return
      }

      toast({
        title: "Success",
        description: "Sharing removed successfully",
      })

      // Update shares list
      setShares(shares.filter((share) => share.id !== shareId))
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to remove sharing",
        variant: "destructive",
      })
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Share "{file.name}"</DialogTitle>
          <DialogDescription>Share this file with other users in your organization</DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <h3 className="text-sm font-medium">Add people</h3>
            <div className="flex gap-2">
              <Select value={selectedUser} onValueChange={setSelectedUser}>
                <SelectTrigger className="flex-1">
                  <SelectValue placeholder="Select a user" />
                </SelectTrigger>
                <SelectContent>
                  {users.map((user) => (
                    <SelectItem key={user.id} value={user.id}>
                      <div className="flex items-center gap-2">
                        <Avatar className="h-6 w-6">
                          <AvatarImage src={user.avatar} />
                          <AvatarFallback>{user.name?.charAt(0) || user.email?.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <span>{user.name || user.email}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={permission} onValueChange={(value) => setPermission(value as "view" | "edit")}>
                <SelectTrigger className="w-[100px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="view">View</SelectItem>
                  <SelectItem value="edit">Edit</SelectItem>
                </SelectContent>
              </Select>

              <Button onClick={handleShare} disabled={!selectedUser || isSubmitting}>
                {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : "Share"}
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <h3 className="text-sm font-medium">People with access</h3>

            {isLoading ? (
              <div className="flex justify-center py-4">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
              </div>
            ) : shares.length === 0 ? (
              <p className="text-sm text-muted-foreground py-2">No one has access yet</p>
            ) : (
              <div className="space-y-2">
                {shares.map((share) => (
                  <div key={share.id} className="flex items-center justify-between p-2 rounded-md border">
                    <div className="flex items-center gap-2">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={share.sharedWith.avatar} />
                        <AvatarFallback>
                          {share.sharedWith.name?.charAt(0) || share.sharedWith.email?.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm font-medium">{share.sharedWith.name || share.sharedWith.email}</p>
                        <p className="text-xs text-muted-foreground">
                          {share.permissions === "edit" ? "Can edit" : "Can view"}
                        </p>
                      </div>
                    </div>
                    <Button variant="ghost" size="icon" onClick={() => handleRemoveShare(share.id)}>
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

