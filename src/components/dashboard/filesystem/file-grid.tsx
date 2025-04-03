"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { FileContextMenu } from "@/components/dashboard/filesystem/file-context-menu"
import { ShareFileDialog } from "@/components/dashboard/filesystem/share-file-dialog"
import { toast } from "@/hooks/use-toast"
import { deleteFile } from "@/actions/filesystem"
import { File, Folder, MoreVertical, Download, Share2, Trash, Edit } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import Image from "next/image"

interface FileGridProps {
  files: Array<{
    id: string
    name: string
    mimeType: string
    size?: number
    webViewLink?: string
    createdTime?: string
    modifiedTime?: string
    dbId?: string
    permission?: string
  }>
  onFolderClick: (folderId: string) => void
  isAdmin: boolean
}

export function FileGrid({ files, onFolderClick, isAdmin }: FileGridProps) {
  const [selectedFile, setSelectedFile] = useState<any>(null)
  const [showShareDialog, setShowShareDialog] = useState(false)

  const handleFileClick = (file: any) => {
    if (file.mimeType === "application/vnd.google-apps.folder") {
      onFolderClick(file.id)
    } else if (file.webViewLink) {
      window.open(file.webViewLink, "_blank")
    }
  }

  const handleDeleteFile = async (file: any) => {
    try {
      const result = await deleteFile(file.id)

      if (result.error) {
        toast({
          title: "Error",
          description: result.error,
          variant: "destructive",
        })
        return
      }

      toast({
        title: "Success",
        description: `${file.name} has been deleted`,
      })

      // Refresh the file list
      window.location.reload()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete file",
        variant: "destructive",
      })
    }
  }

  const formatFileSize = (bytes?: number) => {
    if (!bytes) return "Unknown size"

    const units = ["B", "KB", "MB", "GB", "TB"]
    let size = bytes
    let unitIndex = 0

    while (size >= 1024 && unitIndex < units.length - 1) {
      size /= 1024
      unitIndex++
    }

    return `${size.toFixed(1)} ${units[unitIndex]}`
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {files.map((file) => (
          <Card
            key={file.id}
            className="cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => handleFileClick(file)}
          >
            <CardContent className="p-4 flex flex-col items-center">
              <div className="relative w-full">
                <div className="absolute top-0 right-0">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreVertical className="h-4 w-4" />
                        <span className="sr-only">Open menu</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      {file.webViewLink && (
                        <DropdownMenuItem asChild>
                          <a href={file.webViewLink} target="_blank" rel="noopener noreferrer">
                            <Download className="h-4 w-4 mr-2" />
                            Open
                          </a>
                        </DropdownMenuItem>
                      )}

                      {(isAdmin || file.permission === "edit") && (
                        <DropdownMenuItem
                          onClick={(e) => {
                            e.stopPropagation()
                            // TODO: Implement rename functionality
                            toast({
                              title: "Coming Soon",
                              description: "Rename functionality is coming soon",
                            })
                          }}
                        >
                          <Edit className="h-4 w-4 mr-2" />
                          Rename
                        </DropdownMenuItem>
                      )}

                      {isAdmin && file.dbId && (
                        <>
                          <DropdownMenuItem
                            onClick={(e) => {
                              e.stopPropagation()
                              setSelectedFile(file)
                              setShowShareDialog(true)
                            }}
                          >
                            <Share2 className="h-4 w-4 mr-2" />
                            Share
                          </DropdownMenuItem>

                          <DropdownMenuSeparator />

                          <DropdownMenuItem
                            className="text-destructive"
                            onClick={(e) => {
                              e.stopPropagation()
                              handleDeleteFile(file)
                            }}
                          >
                            <Trash className="h-4 w-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                <div className="flex flex-col items-center pt-4 pb-2 ">
                  {file.mimeType === "application/vnd.google-apps.folder" ? (
                    <Folder className="h-16 w-16 text-blue-500" />
                  ) : file.mimeType.startsWith("image/") ? (
                    <div className="h-16 w-16 bg-gray-100 flex items-center justify-center rounded overflow-hidden">
                      {file.id ? (
                        <Image
                          src={`https://drive.google.com/uc?export=download&id=${file.id}` || "/placeholder.svg"}
                          alt={file.name}
                          width={70}
                          height={70}
                        />
                      ) : (
                        <File className="h-10 w-10 text-gray-400" />
                      )}
                    </div>
                  ) : (
                    <File className="h-16 w-16 text-gray-400" />
                  )}
                </div>
              </div>

              <div className="mt-2 text-center">
                <h3 className="text-sm font-medium truncate w-full" title={file.name}>
                  {file.name}
                </h3>
                <p className="text-xs text-muted-foreground mt-1">
                  {file.size !== undefined ? formatFileSize(file.size) : ""}
                </p>
                {file.modifiedTime && (
                  <p className="text-xs text-muted-foreground">
                    {formatDistanceToNow(new Date(file.modifiedTime), { addSuffix: true })}
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {selectedFile && showShareDialog && (
        <ShareFileDialog file={selectedFile} isOpen={showShareDialog} onClose={() => setShowShareDialog(false)} />
      )}

      <FileContextMenu isAdmin={isAdmin} />
    </>
  )
}

