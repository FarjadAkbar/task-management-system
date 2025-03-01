"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Paperclip, Send, Smile } from "lucide-react"
import { useState } from "react"

export function MessageInput() {
  const [message, setMessage] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (message.trim()) {
      // Handle message submission
      setMessage("")
    }
  }

  return (
    <form onSubmit={handleSubmit} className="p-4">
      <div className="flex gap-2">
        <Button type="button" variant="ghost" size="icon">
          <Paperclip className="h-5 w-5" />
        </Button>
        <Textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type a message..."
          className="min-h-[2.5rem] max-h-32 resize-none"
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault()
              handleSubmit(e)
            }
          }}
        />
        <Button type="button" variant="ghost" size="icon">
          <Smile className="h-5 w-5" />
        </Button>
        <Button type="submit" size="icon" disabled={!message.trim()}>
          <Send className="h-5 w-5" />
        </Button>
      </div>
    </form>
  )
}

