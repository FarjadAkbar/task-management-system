"use client"

import { useState } from "react"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Plus, Search, StickyNote } from "lucide-react"
import { useDeleteNoteMutation, useGetAllNotesQuery } from "@/service/notes"
import { AddNoteForm } from "@/components/dashboard/databases/add-note-form"
import { NoteCard } from "@/components/dashboard/databases/note-card"
import { EditNoteDialog } from "@/components/dashboard/databases/edit-note-dialog"
// import { getUser } from "@/lib/get-user"
import { NoteType } from "@/service/notes/type"

export default function NotesPage() {
  // const user = getUser()
  const [activeTab, setActiveTab] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [showAddNote, setShowAddNote] = useState(false)
  const [selectedNote, setSelectedNote] = useState<NoteType | null>(null)
  const [showEditDialog, setShowEditDialog] = useState(false)

  const { data: notesData, isLoading } = useGetAllNotesQuery()
  const { mutate: deleteNote } = useDeleteNoteMutation()

  const notes = notesData?.notes || []

  // Filter notes by search query
  const filteredNotes = notes.filter((note) => {
    if (!searchQuery) return true
    return (
      note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.content.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })

  const handleEditNote = (note: NoteType) => {
    setSelectedNote(note)
    setShowEditDialog(true)
  }

  const handleDeleteNote = (noteId: string) => {
    deleteNote(noteId)
  }

  return (
    <div className="container mx-auto py-6 space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Notes</h1>
          <p className="text-muted-foreground">Create and manage your personal and shared notes</p>
        </div>
        <Button onClick={() => setShowAddNote(!showAddNote)}>
          {showAddNote ? (
            "Cancel"
          ) : (
            <>
              <Plus className="mr-2 h-4 w-4" />
              New Note
            </>
          )}
        </Button>
      </div>

      {showAddNote && (
        <Card>
          <CardHeader>
            <CardTitle>Create New Note</CardTitle>
            <CardDescription>Add a new note to your collection</CardDescription>
          </CardHeader>
          <CardContent>
            <AddNoteForm />
          </CardContent>
        </Card>
      )}

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="w-full md:w-auto">
          <TabsList>
            <TabsTrigger value="all">All Notes</TabsTrigger>
            <TabsTrigger value="shared">Shared</TabsTrigger>
            <TabsTrigger value="private">Private</TabsTrigger>
          </TabsList>
        </Tabs>
        <div className="relative w-full md:w-64">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search notes..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Card key={i} className="h-[200px]">
              <CardHeader className="pb-2">
                <Skeleton className="h-5 w-3/4" />
              </CardHeader>
              <CardContent className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-2/3" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : filteredNotes.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <StickyNote className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">No notes found</h3>
            <p className="text-muted-foreground mb-4">
              {searchQuery
                ? "No notes match your search query"
                : activeTab === "all"
                  ? "You haven't created any notes yet"
                  : activeTab === "shared"
                    ? "You haven't shared any notes yet"
                    : "You haven't created any private notes yet"}
            </p>
            <Button onClick={() => setShowAddNote(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Create Note
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredNotes.map((note) => (
            <NoteCard
              key={note.id}
              note={note}
              isOwner={activeTab === "shared" ? !note.is_public : note.is_public}
              onEdit={handleEditNote}
              onDelete={handleDeleteNote}
            />
          ))}
        </div>
      )}

      <EditNoteDialog note={selectedNote} isOpen={showEditDialog} onClose={() => setShowEditDialog(false)} />
    </div>
  )
}

