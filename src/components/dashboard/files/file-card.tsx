"use client"

import { useState } from "react"
import type { FileType } from "@/service/files/type"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import {
  MoreVertical,
  Download,
  Share,
  Trash,
  Eye,
  FileText,
  Image,
  FileArchive,
  FileAudio,
  FileVideo,
  FileIcon,
  Users,
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { format } from "date-fns"
import { formatFileSize } from "@/lib/utils"
import { ShareFileDialog } from "./share-file-dialog"

interface FileCardProps {
  file: FileType
  onDelete?: (fileId: string) => void
  onShare?: (fileId: string) => void
  onView?: (file: FileType) => void
  onDownload?: (file: FileType) => void
  showSharedWith?: boolean
}

export function FileCard({ file, onDelete, onShare, onView, onDownload, showSharedWith = false }: FileCardProps) {
  const [showShareDialog, setShowShareDialog] = useState(false)

  const getFileIcon = () => {
    const mimeType = file.document_file_mimeType.toLowerCase()

    if (mimeType.includes("image")) return <Image className="h-10 w-10 text-blue-500" />
    if (mimeType.includes("pdf")) return <FileText className="h-10 w-10 text-red-500" />
    if (mimeType.includes("zip") || mimeType.includes("rar"))
      return <FileArchive className="h-10 w-10 text-yellow-500" />
    if (mimeType.includes("audio")) return <FileAudio className="h-10 w-10 text-green-500" />
    if (mimeType.includes("video")) return <FileVideo className="h-10 w-10 text-purple-500" />

    return <FileIcon className="h-10 w-10 text-gray-500" />
  }

  const handleDownload = () => {
    if (onDownload) {
      onDownload(file)
    } else {
      window.open(file.document_file_url, "_blank")
    }
  }

  const isImage = file.document_file_mimeType.toLowerCase().includes("image")

  return (
    <>
      <Card className="overflow-hidden hover:shadow-md transition-shadow">
        <CardContent className="p-4">
          <div className="flex justify-between items-start">
            <div className="flex items-center gap-3">
              {getFileIcon()}
              <div>
                <h3 className="font-medium text-sm line-clamp-1" title={file.document_name}>
                  {file.document_name}
                </h3>
                <p className="text-xs text-muted-foreground">
                  {formatFileSize(file.size || 0)} • {format(new Date(file.createdAt), "MMM d, yyyy")}
                </p>
              </div>
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => onView && onView(file)}>
                  <Eye className="mr-2 h-4 w-4" /> View
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleDownload}>
                  <Download className="mr-2 h-4 w-4" /> Download
                </DropdownMenuItem>
                {onShare && (
                  <DropdownMenuItem onClick={() => setShowShareDialog(true)}>
                    <Share className="mr-2 h-4 w-4" /> Share
                  </DropdownMenuItem>
                )}
                {onDelete && (
                  <>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      className="text-destructive focus:text-destructive"
                      onClick={() => onDelete(file.id)}
                    >
                      <Trash className="mr-2 h-4 w-4" /> Delete
                    </DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {isImage && (
            <div className="mt-3 h-32 rounded-md overflow-hidden bg-muted flex items-center justify-center">
              <img
                src={file.document_file_url || "/placeholder.svg"}
                alt={file.document_name}
                className="h-full w-full object-cover"
              />
            </div>
          )}

          {file.description && <p className="mt-2 text-xs text-muted-foreground line-clamp-2">{file.description}</p>}
        </CardContent>

        <CardFooter className="px-4 py-3 bg-muted/30 flex justify-between items-center">
          <div className="flex items-center gap-2">
            {file.created_by && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Avatar className="h-6 w-6">
                      <AvatarImage src={file.created_by.avatar} />
                      <AvatarFallback>
                        {file.created_by.name?.substring(0, 2) || file.created_by.email?.substring(0, 2)}
                      </AvatarFallback>
                    </Avatar>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{file.created_by.name || file.created_by.email}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}

            {showSharedWith && file.sharedWith && file.sharedWith.length > 0 && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="flex items-center gap-1">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <span className="text-xs text-muted-foreground">{file.sharedWith.length}</span>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <div className="space-y-1">
                      <p className="font-medium text-xs">Shared with:</p>
                      <ul className="text-xs space-y-1">
                        {file.sharedWith.map((share) => (
                          <li key={share.id}>{share.sharedWith?.name || share.sharedWith?.email}</li>
                        ))}
                      </ul>
                    </div>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
          </div>

          <Badge variant="outline" className="text-xs">
            {file.document_file_mimeType.split("/")[1]?.toUpperCase() || "FILE"}
          </Badge>
        </CardFooter>
      </Card>

      {showShareDialog && <ShareFileDialog file={file} open={showShareDialog} onOpenChange={setShowShareDialog} />}
    </>
  )
}

