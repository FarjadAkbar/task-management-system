"use client"
import React from 'react'
import { Download, Eye, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getFileIcon, previewFile } from "@/lib/utils";
import axios from "axios";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

export default function DocumentsPerview({ taskDocuments }: { taskDocuments: any}) {
    
  const removeFile = async (fileId: string) => {
    try {
      await axios.delete(`/api/uploadthing/${fileId}`)
    } catch (error) {
      console.error("Error removing file:", error)
    }
  }
  return (
    <div className="grid grid-cols-1 gap-2">
    {taskDocuments.map((file:any) => {
      const FileIcon = getFileIcon(file.document_file_mimeType)
      return (
        <div key={file.id} className="flex items-center justify-between p-2 bg-gray-100 rounded-md">
          <div className="flex items-center">
            <div className="flex-shrink-0 mr-2">
              {file.document_file_mimeType.startsWith("image/") ? (
                <img
                  src={file.document_file_url || "/placeholder.svg"}
                  alt={file.document_name}
                  className="w-10 h-10 object-cover rounded"
                />
              ) : (
                <FileIcon className="w-10 h-10 text-gray-500" />
              )}
            </div>
            <div className="flex-grow min-w-0">
              <p className="text-sm font-medium truncate">{file.document_name}</p>
              {/* <p className="text-xs text-gray-500">{formatFileSize(file.size)}</p> */}
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button type="button" onClick={() => previewFile(file)} variant="ghost" size="sm">
                    <Eye className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Preview</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    type="button"
                    onClick={() => window.open(file.document_file_url, "_blank")}
                    variant="ghost"
                    size="sm"
                  >
                    <Download className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Download</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button type="button" onClick={() => removeFile(file.id)} variant="ghost" size="sm">
                    <X className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Remove</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
      )
    })}
  </div>
  )
}
