"use client"
import type { FileType } from "@/service/files/type"
import { FileCard } from "./file-card"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { Skeleton } from "@/components/ui/skeleton"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"
import { PaginationType } from "@/types"

interface FilesListProps {
  files: FileType[]
  isLoading: boolean
  isError: boolean
  pagination?: PaginationType
  onPageChange?: (page: number) => void
  onDelete?: (fileId: string) => void
  onShare?: (fileId: string) => void
  onView?: (file: FileType) => void
  onDownload?: (file: FileType) => void
  showSharedWith?: boolean
}

export function FilesList({
  files,
  isLoading,
  isError,
  pagination,
  onPageChange,
  onDelete,
  onShare,
  onView,
  onDownload,
  showSharedWith = false,
}: FilesListProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: 6 }).map((_, index) => (
          <Skeleton key={index} className="h-48 w-full" />
        ))}
      </div>
    )
  }

  if (isError) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>There was an error loading the files. Please try again later.</AlertDescription>
      </Alert>
    )
  }

  if (files.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No files found</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {files.map((file) => (
          <FileCard
            key={file.id}
            file={file}
            onDelete={onDelete}
            onShare={onShare}
            onView={onView}
            onDownload={onDownload}
            showSharedWith={showSharedWith}
          />
        ))}
      </div>

      {pagination && pagination.totalPages > 1 && (
        <Pagination className="mt-6">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                onClick={() => onPageChange && onPageChange(pagination.pageNumber - 1)}
                // disabled={pagination.currentPage === 1}
              />
            </PaginationItem>

            {Array.from({ length: Math.min(5, pagination.totalPages) }).map((_, i) => {
              const page = i + 1
              return (
                <PaginationItem key={page}>
                  <PaginationLink
                    isActive={pagination.pageNumber === page}
                    onClick={() => onPageChange && onPageChange(page)}
                  >
                    {page}
                  </PaginationLink>
                </PaginationItem>
              )
            })}

            {pagination.totalPages > 5 && pagination.pageNumber < pagination.totalPages - 2 && (
              <PaginationItem>
                <PaginationLink>...</PaginationLink>
              </PaginationItem>
            )}

            {pagination.totalPages > 5 && (
              <PaginationItem>
                <PaginationLink
                  isActive={pagination.pageNumber === pagination.totalPages}
                  onClick={() => onPageChange && onPageChange(pagination.totalPages)}
                >
                  {pagination.totalPages}
                </PaginationLink>
              </PaginationItem>
            )}

            <PaginationItem>
              <PaginationNext
                onClick={() => onPageChange && onPageChange(pagination.pageNumber + 1)}
                // disabled={pagination.currentPage === pagination.totalPages}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </div>
  )
}

