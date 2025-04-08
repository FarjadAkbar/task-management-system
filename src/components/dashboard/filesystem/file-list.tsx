"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { ShareFileDialog } from "@/components/dashboard/filesystem/share-file-dialog"
import { toast } from "@/hooks/use-toast"
import { deleteFile } from "@/actions/filesystem"
import { File, Folder, MoreVertical, Download, Share2, Trash, Edit, User } from "lucide-react"
import { format } from "date-fns"
import Image from "next/image"
import { AssignFolderModal } from "./assign-folder-modal"

interface FileListProps {
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

export function FileList({ files, onFolderClick, isAdmin }: FileListProps) {
  const [selectedFile, setSelectedFile] = useState<any>(null)
  const [showShareDialog, setShowShareDialog] = useState(false)
  const [showAssignFolderModal, setShowAssignFolderModal] = useState(false)


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
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[400px]">Name</TableHead>
              <TableHead>Size</TableHead>
              <TableHead>Modified</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {files.map((file) => (
              <>
              
                  <TableRow key={file.id} className="cursor-pointer" onClick={() => handleFileClick(file)}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {file.mimeType === "application/vnd.google-apps.folder" ? (
                          <Folder className="h-5 w-5 text-blue-500" />
                        ) : file.mimeType.startsWith("image/") ? (
                          <div className="h-5 w-5 bg-gray-100 flex items-center justify-center rounded overflow-hidden">
                            {file.id ? (
                              <Image
                                src={`https://drive.google.com/uc?export=download&id=${file.id}` || "/placeholder.svg"}
                                alt={file.name}
                                width={70}
                                height={70}
                              />
                            ) : (
                              <File className="h-4 w-4 text-gray-400" />
                            )}
                          </div>
                        ) : (
                          <File className="h-5 w-5 text-gray-400" />
                        )}
                        <span className="font-medium w-24 overflow-hidden whitespace-nowrap">{file.name}</span>
                      </div>
                    </TableCell>
                    <TableCell>{file.size !== undefined ? formatFileSize(file.size) : "-"}</TableCell>
                    <TableCell>{file.modifiedTime ? format(new Date(file.modifiedTime), "MMM d, yyyy") : "-"}</TableCell>
                    <TableCell className="text-right">
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
                            <>
                            {/* <DropdownMenuItem
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
                            </DropdownMenuItem> */}

{file.mimeType === "application/vnd.google-apps.folder" && (
  <DropdownMenuItem
    onClick={(e) => {
      e.stopPropagation();
      setShowAssignFolderModal(true);
    }}
  >
    <User className="h-4 w-4 mr-2" />
    Assign Folder
  </DropdownMenuItem>
)}
                            </>
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
                    </TableCell>
                  </TableRow>

                  <AssignFolderModal
                                open={showAssignFolderModal}
                                onOpenChange={setShowAssignFolderModal}
                                folderId={file.id}
                                folderName={file.name}
                              />
              </>
                ))}
          </TableBody>
        </Table>
      </div>

      
      {selectedFile && showShareDialog && (
        <ShareFileDialog file={selectedFile} isOpen={showShareDialog} onClose={() => setShowShareDialog(false)} />
      )}
    </>
  )
}

