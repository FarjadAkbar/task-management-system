"use client"

import { useState } from "react"
import { PlusCircle, Search } from 'lucide-react'
import { useDeleteNoteMutation, useGetAllNotesQuery } from "@/service/notes"
import { NoteType } from "@/service/notes/type"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import SuspenseLoading from "@/components/loadings/suspense"
import { EditNoteDialog } from "./edit-note"
import { NoteCard } from "./note-card"
import { EmptyState } from "./empty-state"
import { AddNoteDialog } from "./add-note"

export function Notes() {
  const { data, isLoading, error } = useGetAllNotesQuery()
  const { mutate: deleteNote } = useDeleteNoteMutation()
  const [activeTab, setActiveTab] = useState<"shared" | "private">("shared")
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedNote, setSelectedNote] = useState<NoteType | null>(null)
  const [searchQuery, setSearchQuery] = useState("")

  const openModal = (note: NoteType) => {
    setSelectedNote(note)
    setIsModalOpen(true)
  }

  const onDelete = (noteId: string) => {
    deleteNote(noteId)
  }


  if (isLoading) {
    return <SuspenseLoading />
  }


  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-destructive">Error loading notes. Please try again later.</p>
      </div>
    )
  }
  const filteredNotes: NoteType[] = data?.notes.filter((note) => {
    const matchesSearch = 
      note.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
      note.content.toLowerCase().includes(searchQuery.toLowerCase())
    
    const matchesTab = activeTab === "shared" 
      ? note.is_public !== true
      : note.is_public === true
    
    return matchesSearch && matchesTab
  }) ?? [];


  return (
    <>
      <div className="mx-auto p-3">
        <div className="flex flex-col gap-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search notes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-background/80 backdrop-blur-sm"
            />
          </div>

          <Tabs defaultValue="shared" value={activeTab} onValueChange={(value) => setActiveTab(value as "shared" | "private")} className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger
                value="shared"
              >
                Shared Notes
              </TabsTrigger>
              <TabsTrigger
                value="private"
              >
                Private Notes
              </TabsTrigger>
            </TabsList>

            <TabsContent value="shared" className="mt-0 space-y-4">
              {filteredNotes.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-in fade-in-50 duration-300">
                  {filteredNotes.map((note) => (
                    <NoteCard 
                      key={note.id} 
                      note={note} 
                      openModal={openModal} 
                      onDelete={onDelete} 
                      isShared={true} 
                    />
                  ))}
                </div>
              ) : (
                <EmptyState 
                  title="No shared notes found" 
                  description={searchQuery ? "Try a different search term" : "Create a new note to get started"} 
                  action={
                    <AddNoteDialog />
                  }
                />
              )}
            </TabsContent>

            <TabsContent value="private" className="mt-0 space-y-4">
              {filteredNotes.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-in fade-in-50 duration-300">
                  {filteredNotes.map((note) => (
                    <NoteCard 
                      key={note.id} 
                      note={note} 
                      openModal={openModal} 
                      onDelete={onDelete} 
                      isShared={false} 
                    />
                  ))}
                </div>
              ) : (
                <EmptyState 
                  title="No private notes found" 
                  description={searchQuery ? "Try a different search term" : "Create a new private note to get started"} 
                  action={
                    <AddNoteDialog />
                  }
                />
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {selectedNote && (
        <EditNoteDialog
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          note={selectedNote}
        />
      )}
    </>
  )
}
