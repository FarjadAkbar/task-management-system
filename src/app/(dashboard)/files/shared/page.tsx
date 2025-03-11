"use client"

import { useState } from "react"
import axios from "axios"
import { useGetSharedFilesQuery } from "@/service/files"
import { toast } from "@/hooks/use-toast"
import { FilesFilter } from "@/components/dashboard/files/files-filter"
import { FilesList } from "@/components/dashboard/files/files-list"

export default function SharedFilesPage() {
  const [filters, setFilters] = useState({
    search: "",
    type: "",
    sortBy: "createdAt",
    sortOrder: "desc" as "asc" | "desc",
    page: 1,
  })

  const { data, isLoading, isError, refetch } = useGetSharedFilesQuery({
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

  const handleRemoveShare = async (fileId: string, userId: string) => {
    try {
      await axios.delete(`/api/files/share?fileId=${fileId}&userId=${userId}`)
      toast({
        title: "Share removed",
        description: "The file is no longer shared with this user",
      })
      refetch()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to remove share",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Shared Files</h2>
      </div>

      <FilesFilter onFilterChange={handleFilterChange} />

      <FilesList
        files={data?.files || []}
        isLoading={isLoading}
        isError={isError}
        pagination={data?.pagination}
        onPageChange={handlePageChange}
        onShare={(fileId) => console.log("Share file:", fileId)}
        onView={(file) => window.open(file.document_file_url, "_blank")}
        showSharedWith={true}
      />
    </div>
  )
}

