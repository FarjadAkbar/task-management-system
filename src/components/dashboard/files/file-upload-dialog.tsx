"use client"

import type React from "react"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Loader2, Upload } from "lucide-react"
import axios from "axios"
import { toast } from "@/hooks/use-toast"
import { FileUploaderDropzone } from "@/components/ui/file-uploader-dropzone"

interface FileUploadDialogProps {
  onUploadSuccess?: () => void
  trigger?: React.ReactNode
}

export function FileUploadDialog({ onUploadSuccess, trigger }: FileUploadDialogProps) {
  const [open, setOpen] = useState(false)
  const [fileName, setFileName] = useState("")
  const [description, setDescription] = useState("")
  const [uploadedFiles, setUploadedFiles] = useState<Array<{ id: string; name: string; url: string }>>([])
  const [isUploading, setIsUploading] = useState(false)

  const handleFileUpload = (files: Array<{ id: string; name: string; url: string }>) => {
    setUploadedFiles(files)
    if (files.length > 0 && !fileName) {
      setFileName(files[0].name)
    }
  }

  const handleSubmit = async () => {
    if (!fileName.trim()) {
      toast({
        title: "File name required",
        description: "Please enter a name for the file",
        variant: "destructive",
      })
      return
    }

    if (uploadedFiles.length === 0) {
      toast({
        title: "No file selected",
        description: "Please upload a file",
        variant: "destructive",
      })
      return
    }

    setIsUploading(true)

    try {
      // Assuming you have an API endpoint to save the file metadata
      await axios.post("/api/files", {
        document_name: fileName,
        description: description,
        documentID: uploadedFiles[0].id,
        document_file_url: uploadedFiles[0].url,
      })

      toast({
        title: "File uploaded",
        description: "Your file has been uploaded successfully",
      })

      setOpen(false)
      setFileName("")
      setDescription("")
      setUploadedFiles([])

      if (onUploadSuccess) {
        onUploadSuccess()
      }
    } catch (error) {
      console.error("Error uploading file:", error)
      toast({
        title: "Upload failed",
        description: "There was an error uploading your file",
        variant: "destructive",
      })
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {trigger ? (
        <DialogTrigger asChild>{trigger}</DialogTrigger>
      ) : (
        <DialogTrigger asChild>
          <Button>
            <Upload className="mr-2 h-4 w-4" />
            Upload File
          </Button>
        </DialogTrigger>
      )}

      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Upload File</DialogTitle>
          <DialogDescription>Upload a file to your private storage</DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="file">File</Label>
            <FileUploaderDropzone onUploadSuccess={handleFileUpload} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="name">File Name</Label>
            <Input
              id="name"
              value={fileName}
              onChange={(e) => setFileName(e.target.value)}
              placeholder="Enter file name"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description (Optional)</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter file description"
              rows={3}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={isUploading || uploadedFiles.length === 0}>
            {isUploading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Uploading...
              </>
            ) : (
              <>
                <Upload className="mr-2 h-4 w-4" />
                Upload
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

