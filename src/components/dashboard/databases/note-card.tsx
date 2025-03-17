"use client"

import { useState } from "react"
import { format } from "date-fns"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Edit, MoreVertical, Eye, Lock, Globe } from "lucide-react"
import { NoteType } from "@/service/notes/type"
import { NoteDialog } from "./note-dialog"
import { DeleteNoteDialog } from "./delete-note-dialog"

interface NoteCardProps {
  note: NoteType
  isOwner: boolean
  onEdit: (note: NoteType) => void
  onDelete: (noteId: string) => void
}

export function NoteCard({ note, isOwner, onEdit, onDelete }: NoteCardProps) {
  const [showFullContent, setShowFullContent] = useState(false)
  const [showNoteDialog, setShowNoteDialog] = useState(false)

  const truncatedContent = note.content.length > 100 ? `${note.content.substring(0, 100)}...` : note.content

  return (
    <>
      <Card className="h-full flex flex-col hover:shadow-md transition-shadow">
        <CardHeader className="pb-2">
          <div className="flex justify-between items-start">
            <CardTitle className="text-lg font-semibold">{note.title}</CardTitle>
            <div className="flex items-center gap-2">
              <Badge variant={note.visibility === "shared" ? "default" : "outline"}>
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
              {isOwner && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreVertical className="h-4 w-4" />
                      <span className="sr-only">Open menu</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => onEdit(note)}>
                      <Edit className="h-4 w-4 mr-2" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild className="text-destructive">
                      <DeleteNoteDialog noteId={note.id} onDelete={onDelete} />
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent className="flex-1">
          <div className="prose prose-sm max-w-none">
            <p className="text-muted-foreground">{showFullContent ? note.content : truncatedContent}</p>
            {note.content.length > 100 && (
              <Button
                variant="link"
                size="sm"
                className="p-0 h-auto text-xs"
                onClick={() => setShowFullContent(!showFullContent)}
              >
                {showFullContent ? "Show less" : "Read more"}
              </Button>
            )}
          </div>
        </CardContent>
        <CardFooter className="pt-2 flex justify-between items-center text-xs text-muted-foreground">
          <div className="flex items-center gap-2">
            <Avatar className="h-6 w-6">
              <AvatarImage src={note.author?.avatar} />
              <AvatarFallback>{note.author.name?.charAt(0) || note.author.email?.charAt(0)}</AvatarFallback>
            </Avatar>
            <span>{note.author.name || note.author.email}</span>
          </div>
          <div className="flex items-center gap-2">
            <span>{format(new Date(note.updatedAt), "MMM d, yyyy")}</span>
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setShowNoteDialog(true)}>
              <Eye className="h-4 w-4" />
              <span className="sr-only">View note</span>
            </Button>
          </div>
        </CardFooter>
      </Card>

      <NoteDialog note={note} isOpen={showNoteDialog} onClose={() => setShowNoteDialog(false)} />
    </>
  )
}

