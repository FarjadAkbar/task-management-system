"use client"

import { useState } from "react"
import { Edit, MoreVertical, Lock, Globe, Trash2, Calendar } from "lucide-react"
import { format } from "date-fns"
import type { NoteType } from "@/service/notes/type"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import DeleteConfirmationDialog from "@/components/modals/delete-confitmation"

interface NoteCardProps {
  note: NoteType
  openModal: (note: NoteType) => void
  onDelete: (noteId: string) => void
  isShared: boolean
}

export function NoteCard({ note, openModal, onDelete, isShared }: NoteCardProps) {
  const [showFullContent, setShowFullContent] = useState(false)
  const contentPreview =
    note.content.length > 150 && !showFullContent ? `${note.content.substring(0, 150)}...` : note.content

  // Determine card accent color based on note type
  const accentColor =
    note.visibility === "private"
      ? "border-l-purple-700 dark:border-l-purple-500"
      : "border-l-blue-600 dark:border-l-blue-400"

  return (
    <Card className={`overflow-hidden border-l-4 ${accentColor} hover:shadow-lg transition-all duration-300 group`}>
      <CardHeader className="p-4 pb-2 flex flex-row justify-between items-start bg-muted/30">
        <div>
          <CardTitle className="text-xl font-semibold group-hover:text-primary transition-colors duration-300">
            {note.title}
          </CardTitle>
          {/* {note.createdAt && (
            <div className="flex items-center text-xs text-muted-foreground mt-1">
              <Calendar className="h-3 w-3 mr-1" />
              {format(new Date(note.createdAt), "MMM d, yyyy")}
            </div>
          )} */}
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8 opacity-70 hover:opacity-100">
              <MoreVertical className="h-4 w-4" />
              <span className="sr-only">Open menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => openModal(note)}>
              <Edit className="mr-2 h-4 w-4" /> Edit
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-destructive focus:text-destructive" asChild>
              <DeleteConfirmationDialog name={note.id} onDelete={onDelete} />
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardHeader>
      <CardContent className="p-4 pt-3">
        <p className="text-muted-foreground mb-3 whitespace-pre-line">{contentPreview}</p>

        {note.content.length > 150 && (
          <Button
            variant="link"
            onClick={() => setShowFullContent(!showFullContent)}
            className="p-0 h-auto text-primary"
          >
            {showFullContent ? "Show less" : "Read more"}
          </Button>
        )}
      </CardContent>
      <CardFooter className="p-4 pt-0 flex justify-between items-center">
        {isShared && note.authorId && (
          <Badge variant="outline" className="text-xs bg-primary/10 hover:bg-primary/20">
            Shared by: {note.author.name}
          </Badge>
        )}
        <Badge
          variant={note.visibility === "private" ? "secondary" : "default"}
          className={`ml-auto ${note.visibility === "private" ? "bg-purple-100 text-purple-800 hover:bg-purple-200 dark:bg-purple-900 dark:text-purple-300" : "bg-blue-100 text-blue-800 hover:bg-blue-200 dark:bg-blue-900 dark:text-blue-300"}`}
        >
          {note.visibility === "private" ? (
            <>
              <Lock className="mr-1 h-3 w-3" /> Private
            </>
          ) : (
            <>
              <Globe className="mr-1 h-3 w-3" /> Shared
            </>
          )}
        </Badge>
      </CardFooter>
    </Card>
  )
}

