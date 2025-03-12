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
import { toast } from "@/hooks/use-toast"
import { FileUploaderDropzone } from "@/components/ui/file-uploader-dropzone"

interface FileUploadDialogProps {
  onUploadSuccess?: () => void
  trigger?: React.ReactNode
}

export function FileUploadDialog({ onUploadSuccess, trigger }: FileUploadDialogProps) {
  const [open, setOpen] = useState(false)
  // const [fileName, setFileName] = useState("")
  const [uploadedFiles, setUploadedFiles] = useState<Array<{ id: string; name: string; url: string }>>([])

  const handleFileUpload = (files: Array<{ id: string; name: string; url: string }>) => {
    setUploadedFiles(files)
    onUploadSuccess && onUploadSuccess()
    setOpen(false)
    // if (files.length > 0 && !fileName) {
    //   setFileName(files[0].name)
    // }
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

        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

