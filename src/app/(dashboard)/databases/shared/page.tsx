"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"

interface User {
  id: string
  name: string
  email: string
}

interface Note {
  id: string
  title: string
  content: string
  author: { name: string }
  access: { user: { name: string } }[]
}

export default function SharedNotes() {
  const [notes, setNotes] = useState<Note[]>([])
  const [users, setUsers] = useState<User[]>([])
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [sharedWith, setSharedWith] = useState<string[]>([])
  const router = useRouter()

  useEffect(() => {
    ;(async () => {
      await fetchNotes()
      await fetchUsers()
    })()
  }, [])

  const fetchNotes = async () => {
    const res = await fetch(`/api/shared-note`)
    const data = await res.json()
    setNotes(data)
  }

  const fetchUsers = async () => {
    const res = await fetch("/api/user")
    const data = await res.json()
    setUsers(data)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const res = await fetch("/api/shared-note", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title,
        content,
        sharedWith,
      }),
    })
    if (res.ok) {
      setTitle("")
      setContent("")
      setSharedWith([])
      fetchNotes()
    }
  }

  return (
    <div className="container mx-auto p-4 space-y-8">
      <h1 className="text-3xl font-bold">Shared Notes</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card className="p-6">
          <CardHeader>
            <CardTitle>Create New Shared Note</CardTitle>
            <CardDescription>Share your thoughts with your team</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Note title" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="content">Content</Label>
                <Textarea
                  id="content"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Note content"
                  className="min-h-[100px]"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="shared-with">Share with</Label>
                <Select onValueChange={(value) => setSharedWith((prev) => [...prev, value])}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select users to share with" />
                  </SelectTrigger>
                  <SelectContent>
                    {users.map((user) => (
                      <SelectItem key={user.id} value={user.id}>
                        {user.name} ({user.email})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                {sharedWith.map((userId) => {
                  const user = users.find((u) => u.id === userId)
                  return (
                    <Badge key={userId} variant="secondary" className="px-2 py-1">
                      {user?.name}
                      <button
                        onClick={() => setSharedWith((prev) => prev.filter((id) => id !== userId))}
                        className="ml-2 text-gray-500 hover:text-gray-700"
                      >
                        &times;
                      </button>
                    </Badge>
                  )
                })}
              </div>
              <Button type="submit" className="w-full">
                Add Shared Note
              </Button>
            </form>
          </CardContent>
        </Card>
        <Card className="p-6">
          <CardHeader>
            <CardTitle>Shared Notes</CardTitle>
            <CardDescription>Notes shared with you and by you</CardDescription>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[600px] pr-4">
              <div className="space-y-4">
                {notes.map((note) => (
                  <Card key={note.id} className="p-4">
                    <CardTitle className="text-xl mb-2">{note.title}</CardTitle>
                    <CardDescription className="text-sm text-gray-500 mb-2">Author: {note.author.name}</CardDescription>
                    <p className="text-gray-700 mb-4">{note.content}</p>
                    <div className="flex flex-wrap gap-2">
                      {note.access.map((a, index) => (
                        <Badge key={index} variant="outline">
                          {a.user.name}
                        </Badge>
                      ))}
                    </div>
                  </Card>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

