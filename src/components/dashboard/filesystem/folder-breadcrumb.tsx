"use client"

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { ChevronRight, Home } from "lucide-react"

interface FolderBreadcrumbProps {
  path: Array<{ id: string; name: string }>
  onFolderClick: (folderId: string) => void
}

export function FolderBreadcrumb({ path, onFolderClick }: FolderBreadcrumbProps) {
  return (
    <Breadcrumb>
      <BreadcrumbList>
        {path.map((folder, index) => (
          <BreadcrumbItem key={folder.id || index}>
            {index === 0 ? (
              <BreadcrumbLink href="#" onClick={() => onFolderClick("")}>
                <Home className="h-4 w-4 mr-1" />
                {folder.name}
              </BreadcrumbLink>
            ) : (
              <BreadcrumbLink href="#" onClick={() => onFolderClick(folder.id)}>
                {folder.name}
              </BreadcrumbLink>
            )}
            {index < path.length - 1 && (
              <BreadcrumbSeparator>
                <ChevronRight className="h-4 w-4" />
              </BreadcrumbSeparator>
            )}
          </BreadcrumbItem>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  )
}

