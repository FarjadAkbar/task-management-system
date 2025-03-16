"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { FileText, Image, FileArchive, FileAudio, FileVideo, FileIcon, Download, ExternalLink } from "lucide-react"
import { formatFileSize } from "@/lib/utils"
import { FileUploadDialog } from "../files/file-upload-dialog"
import { toast } from "@/hooks/use-toast"

interface TaskAttachmentsProps {
  taskId: string
  attachments: any[]
}

export function TaskAttachments({ taskId, attachments = [] }: TaskAttachmentsProps) {
  const [showUploadDialog, setShowUploadDialog] = useState(false)

  const getFileIcon = (mimeType: string) => {
    const type = mimeType.toLowerCase()

    if (type.includes("image")) return <Image className="h-10 w-10 text-blue-500" />
    if (type.includes("pdf")) return <FileText className="h-10 w-10 text-red-500" />
    if (type.includes("zip") || type.includes("rar")) return <FileArchive className="h-10 w-10 text-yellow-500" />
    if (type.includes("audio")) return <FileAudio className="h-10 w-10 text-green-500" />
    if (type.includes("video")) return <FileVideo className="h-10 w-10 text-purple-500" />

    return <FileIcon className="h-10 w-10 text-gray-500" />
  }

  const handleDownload = (url: string) => {
    window.open(url, "_blank")
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <FileUploadDialog
          onUploadSuccess={() => {
            toast({
              title: "File uploaded",
              description: "The file has been attached to this task",
            })
          }}
          trigger={<Button onClick={() => setShowUploadDialog(true)}>Attach File</Button>}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {attachments.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-4 col-span-2">
            No attachments yet. Add files to this task.
          </p>
        ) : (
          attachments.map((file) => (
            <Card key={file.id} className="overflow-hidden">
              <CardContent className="p-4">
                <div className="flex gap-3">
                  {getFileIcon(file.document_file_mimeType)}
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-sm truncate">{file.document_name}</h4>
                    <p className="text-xs text-muted-foreground">{formatFileSize(file.size || 0)}</p>
                    <div className="flex gap-2 mt-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-7"
                        onClick={() => handleDownload(file.document_file_url)}
                      >
                        <Download className="h-3.5 w-3.5 mr-1" />
                        Download
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-7"
                        onClick={() => window.open(file.document_file_url, "_blank")}
                      >
                        <ExternalLink className="h-3.5 w-3.5 mr-1" />
                        View
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}

