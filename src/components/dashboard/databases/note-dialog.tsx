"use client"

import { format } from "date-fns"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Globe, Lock } from "lucide-react"
import { NoteType } from "@/service/notes/type"

interface NoteDialogProps {
  note: NoteType
  isOpen: boolean
  onClose: () => void
}

export function NoteDialog({ note, isOpen, onClose }: NoteDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <div className="flex justify-between items-center">
            <DialogTitle className="text-xl font-semibold">{note.title}</DialogTitle>
            <Badge variant={note.visibility === "shared"  ? "default" : "outline"}>
              {note.visibility === "shared" ? (
                <>
                  <Globe className="h-3 w-3 mr-1" /> Shared
                </>
              ) : (
                <>
                  <Lock className="h-3 w-3 mr-1" /> Private
                </>
              )}
            </Badge>
          </div>
          <DialogDescription className="flex items-center gap-2 mt-2">
            <Avatar className="h-6 w-6">
              <AvatarImage src={note.author.avatar} />
              <AvatarFallback>{note.author.name?.charAt(0) || note.author.email?.charAt(0)}</AvatarFallback>
            </Avatar>
            <span>{note.author.name || note.author.email}</span>
            <span className="text-muted-foreground">•</span>
            <span className="text-muted-foreground">{format(new Date(note.updatedAt), "MMM d, yyyy")}</span>
          </DialogDescription>
        </DialogHeader>
        <div className="mt-4 prose prose-sm max-w-none">
          <p className="whitespace-pre-wrap">{note.content}</p>
        </div>
      </DialogContent>
    </Dialog>
  )
}

