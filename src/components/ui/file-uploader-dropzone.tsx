"use client"

import type React from "react"

import { useState, useCallback } from "react"
import { useRouter } from "next/navigation"
import { uploadFile } from "@/actions/upload"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { toast } from "@/hooks/use-toast"
import { Loader2, Upload, File, X } from "lucide-react"

interface Props {
  onUploadSuccess?: (files: { id: string; name: string; url: string }[]) => void
  folderId?: string
}

export function FileUploaderDropzone({ onUploadSuccess, folderId }: Props) {
  const router = useRouter()
  const [isDragging, setIsDragging] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
  }, [])

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const newFiles = Array.from(e.dataTransfer.files)
      setSelectedFiles((prev) => [...prev, ...newFiles])
    }
  }, [])

  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files)
      setSelectedFiles((prev) => [...prev, ...newFiles])
    }
  }, [])

  const handleRemoveFile = useCallback((index: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index))
  }, [])

  const handleUpload = useCallback(async () => {
    if (selectedFiles.length === 0) return

    setIsUploading(true)
    const uploadedFiles = []
    try {
      for (const file of selectedFiles) {
        const formData = new FormData()
        formData.append("file", file)
        if (folderId) formData.append("folderId", folderId)

        const result = await uploadFile(formData)

        if (result.error) {
          toast({
            title: "Upload Error",
            description: `Failed to upload ${file.name}: ${result.error}`,
            variant: "destructive",
          })
        } else if (result.success && result.file) {
          uploadedFiles.push(result.file)
        }
      }

      if (uploadedFiles.length > 0) {
        toast({
          title: "Upload Complete",
          description: `Successfully uploaded ${uploadedFiles.length} file(s)`,
        })

        if (onUploadSuccess) {
          onUploadSuccess(uploadedFiles)
        }

        setSelectedFiles([])
        router.refresh()
      }
    } catch (error) {
      toast({
        title: "Upload Error",
        description: "An unexpected error occurred during upload",
        variant: "destructive",
      })
    } finally {
      setIsUploading(false)
    }
  }, [selectedFiles, folderId, onUploadSuccess, router])

  return (
    <div className="w-full">
      <Card
        className={`border-2 border-dashed p-6 text-center ${
          isDragging ? "border-primary bg-primary/5" : "border-muted-foreground/25"
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <div className="flex flex-col items-center justify-center space-y-4">
          <Upload className="h-10 w-10 text-muted-foreground" />
          <div className="space-y-2">
            <h3 className="text-lg font-semibold">Drag & drop files here</h3>
            <p className="text-sm text-muted-foreground">or click to browse (max 10 files, up to 64MB each)</p>
          </div>
          <input
            type="file"
            id="file-upload"
            className="hidden"
            multiple
            onChange={handleFileChange}
            disabled={isUploading}
          />
          <Button
            variant="outline"
            type="button"
            onClick={() => document.getElementById("file-upload")?.click()}
            disabled={isUploading}
          >
            Select Files
          </Button>
        </div>
      </Card>

      {selectedFiles.length > 0 && (
        <div className="mt-4 space-y-4">
          <div className="space-y-2">
            {selectedFiles.map((file, index) => (
              <div key={`${file.name}-${index}`} className="flex items-center justify-between rounded-md border p-3">
                <div className="flex items-center space-x-2">
                  <File className="h-5 w-5 text-muted-foreground" />
                  <span className="text-sm font-medium">{file.name}</span>
                  <span className="text-xs text-muted-foreground">({(file.size / 1024 / 1024).toFixed(2)} MB)</span>
                </div>
                <Button variant="ghost" size="icon" onClick={() => handleRemoveFile(index)} disabled={isUploading}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
          <Button onClick={handleUpload} disabled={isUploading} className="w-full">
            {isUploading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Uploading...
              </>
            ) : (
              `Upload ${selectedFiles.length} file${selectedFiles.length > 1 ? "s" : ""}`
            )}
          </Button>
        </div>
      )}
    </div>
  )
}

