"use client"

import { FilesFilter } from "@/components/dashboard/files/files-filter"
import { FilesList } from "@/components/dashboard/files/files-list"
import { useGetFilesSharedWithMeQuery } from "@/service/files"
import { useState } from "react"

export default function SharedWithMePage() {
  const [filters, setFilters] = useState({
    search: "",
    type: "",
    sortBy: "createdAt",
    sortOrder: "desc" as "asc" | "desc",
    page: 1,
  })

  const { data, isLoading, isError } = useGetFilesSharedWithMeQuery({
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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Files Shared With Me</h2>
      </div>

      <FilesFilter onFilterChange={handleFilterChange} />

      <FilesList
        files={data?.files || []}
        isLoading={isLoading}
        isError={isError}
        pagination={data?.pagination}
        onPageChange={handlePageChange}
        onView={(file) => window.open(file.document_file_url, "_blank")}
      />
    </div>
  )
}

