"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"

export default function PersonalNotes() {
  const [notes, setNotes] = useState([])
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const router = useRouter()

  useEffect(() => {
    fetchNotes()
  }, [])

  const fetchNotes = async () => {
    const res = await fetch("/api/notes?userId=user123") // Replace with actual user ID
    const data = await res.json()
    setNotes(data)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const res = await fetch("/api/notes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, content, userId: "user123" }), // Replace with actual user ID
    })
    if (res.ok) {
      setTitle("")
      setContent("")
      fetchNotes()
    }
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Personal Notes</h1>
      <form onSubmit={handleSubmit} className="mb-4">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Title"
          className="w-full p-2 mb-2 border rounded"
        />
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Content"
          className="w-full p-2 mb-2 border rounded"
        />
        <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded">
          Add Note
        </button>
      </form>
      <div>
        {notes.map((note: any) => (
          <div key={note.id} className="bg-white p-4 mb-4 rounded shadow">
            <h2 className="text-xl font-bold">{note.title}</h2>
            <p>{note.content}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

