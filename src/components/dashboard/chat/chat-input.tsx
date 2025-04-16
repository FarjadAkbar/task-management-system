"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Paperclip, Send, Smile, X } from "lucide-react"
import { FileUploaderDropzone } from "@/components/ui/file-uploader-dropzone"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

interface ChatInputProps {
  value: string
  onChange: (value: string) => void
  onSend: (files?: Array<{ id: string; name: string; url: string }>) => void
  isLoading: boolean
  disabled?: boolean
}

export function ChatInput({ value, onChange, onSend, isLoading, disabled }: ChatInputProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const [isFocused, setIsFocused] = useState(false)
  // Add state to track uploaded files
  const [uploadedFiles, setUploadedFiles] = useState<Array<{ id: string; name: string; url: string }>>([])

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "0px"
      const scrollHeight = textareaRef.current.scrollHeight
      textareaRef.current.style.height = `${scrollHeight}px`
    }
  }, [value])

  // Handle Enter key to send message
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  // Update the handleFileUpload function to store uploaded files
  const handleFileUpload = (files: Array<{ id: string; name: string; url: string }>) => {
    console.log(files)
    setUploadedFiles((prev) => [...prev, ...files])
  }

  // Remove a file from the uploaded files
  const removeFile = (fileId: string) => {
    setUploadedFiles((prev) => prev.filter((file) => file.id !== fileId))
  }

  // Update the send function to include files
  const handleSend = () => {
    if ((!value.trim() && uploadedFiles.length === 0) || isLoading || disabled) return

    // Pass files to onSend if there are any
    onSend(uploadedFiles.length > 0 ? uploadedFiles : undefined)

    // Clear uploaded files after sending
    setUploadedFiles([])
  }

  return (
    <div className={`border-t p-4 ${isFocused ? "bg-muted/50" : ""}`}>
      {/* Display uploaded files */}
      {uploadedFiles.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-2">
          {uploadedFiles.map((file) => (
            <div key={file.id} className="flex items-center bg-muted rounded-md p-1 pr-2">
              <Button variant="ghost" size="icon" className="h-5 w-5 mr-1" onClick={() => removeFile(file.id)}>
                <X className="h-3 w-3" />
              </Button>
              <span className="text-xs truncate max-w-[150px]">{file.name}</span>
            </div>
          ))}
        </div>
      )}

      <div className="flex items-end gap-2">
        <Dialog>
          <DialogTrigger>
          <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0">
            <Paperclip className="h-4 w-4" />
          </Button>

          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Attachments</DialogTitle>
              <DialogDescription>Add files to this chat.</DialogDescription>
            </DialogHeader>

            {/* File uploader dropzone */}
            <FileUploaderDropzone onUploadSuccess={handleFileUpload} />
          </DialogContent>
        </Dialog>

        <div className="relative flex-1">
          <Textarea
            ref={textareaRef}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onKeyDown={handleKeyDown}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder="Type a message..."
            className="min-h-[40px] max-h-[120px] resize-none pr-10"
            disabled={disabled || isLoading}
          />
          <Button variant="ghost" size="icon" className="absolute right-2 bottom-1 h-8 w-8">
            <Smile className="h-4 w-4" />
          </Button>
        </div>

        <Button
          size="icon"
          className="h-10 w-10 shrink-0 bg-green-500 hover:bg-green-600 text-white rounded-full"
          onClick={handleSend}
          // Enable the button if there's text or files
          disabled={(value.trim() === "" && uploadedFiles.length === 0) || isLoading || disabled}
        >
          <Send className="h-6 w-6" />
        </Button>
      </div>
    </div>
  )
}

