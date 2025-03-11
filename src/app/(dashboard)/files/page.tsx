"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Upload } from "lucide-react"
import axios from "axios"
import { useGetPrivateFilesQuery } from "@/service/files"
import { FileUploadDialog } from "@/components/dashboard/files/file-upload-dialog"
import { FilesFilter } from "@/components/dashboard/files/files-filter"
import { FilesList } from "@/components/dashboard/files/files-list"
import { toast } from "@/hooks/use-toast"

export default function PrivateFilesPage() {
  const [filters, setFilters] = useState({
    search: "",
    type: "",
    sortBy: "createdAt",
    sortOrder: "desc" as "asc" | "desc",
    page: 1,
  })

  const { data, isLoading, isError, refetch } = useGetPrivateFilesQuery({
    search: filters.search,
    type: filters.type,
    sortBy: filters.sortBy,
    sortOrder: filters.sortOrder,
    page: filters.page,
  })

  const handleFilterChange = (newFilters: {
    search: string
    type: string
    sortBy: string
    sortOrder: "asc" | "desc"
  }) => {
    setFilters({ ...newFilters, page: 1 })
  }

  const handlePageChange = (page: number) => {
    setFilters({ ...filters, page })
  }

  const handleDeleteFile = async (fileId: string) => {
    try {
      await axios.delete(`/api/files/${fileId}`)
      toast({
        title: "File deleted",
        description: "The file has been deleted successfully",
      })
      refetch()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete the file",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">My Files</h2>
        <FileUploadDialog
          onUploadSuccess={() => refetch()}
          trigger={
            <Button>
              <Upload className="mr-2 h-4 w-4" />
              Upload File
            </Button>
          }
        />
      </div>

      <FilesFilter onFilterChange={handleFilterChange} />

      <FilesList
        files={data?.files || []}
        isLoading={isLoading}
        isError={isError}
        pagination={data?.pagination}
        onPageChange={handlePageChange}
        onDelete={handleDeleteFile}
        onShare={(fileId) => console.log("Share file:", fileId)}
        onView={(file) => window.open(file.document_file_url, "_blank")}
        showSharedWith={true}
      />
    </div>
  )
}

