"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useQueryState } from "nuqs"
import { Search, Grid, List } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Skeleton } from "@/components/ui/skeleton"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { toast } from "@/hooks/use-toast"

import { FileGrid } from "@/components/dashboard/filesystem/file-grid"
import { FileList } from "@/components/dashboard/filesystem/file-list"
import { FolderBreadcrumb } from "@/components/dashboard/filesystem/folder-breadcrumb"
import { FileToolbar } from "@/components/dashboard/filesystem/file-toolbar"
import { listFiles } from "@/actions/filesystem"
import { FileSystemItem, ListFilesResult, FileExplorerProps } from "@/types/filesystem"

export function FileExplorer({ isAdmin }: FileExplorerProps) {
  // Use nuqs for folder parameter
  const [folder, setFolder] = useQueryState("folder")

  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [isLoading, setIsLoading] = useState(true)
  const [files, setFiles] = useState<FileSystemItem[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [debouncedQuery, setDebouncedQuery] = useState("")
  const [folderPath, setFolderPath] = useState<Array<{ id: string; name: string }>>([])

  // Load files
  useEffect(() => {
    const loadFiles = async () => {
      setIsLoading(true)
      try {
        const result = await listFiles(folder || undefined, searchQuery || undefined)

        if ('error' in result) {
          toast({
            title: "Error",
            description: result.error,
            variant: "destructive",
          })
          return
        }

        if ('success' in result && result.success) {
          // Filter out null values and cast to proper type
          const validFiles = (result.files || []).filter(file => file !== null) as any[]
          setFiles(validFiles)
        }
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load files",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    loadFiles()
  }, [folder, searchQuery])

  // Update folder path breadcrumb
  useEffect(() => {
    const updateFolderPath = async () => {
      if (!folder) {
        setFolderPath([{ id: "", name: "Root" }])
        return
      }

      // TODO: Implement folder path traversal
      // For now, just show current folder
      setFolderPath([
        { id: "", name: "Root" },
        { id: folder, name: "Current Folder" },
      ])
    }

    updateFolderPath()
  }, [folder])
  
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(searchQuery)
    }, 300) // 300ms debounce

    return () => clearTimeout(handler)
  }, [searchQuery])

  // Handle folder navigation
  const handleFolderClick = (folderId: string) => {
    setFolder(folderId)
  }

  // Handle search
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    // The search is handled by the useEffect above
  }

  // Handle breadcrumb navigation
  const handleBreadcrumbClick = (folderId: string) => {
    if (!folderId) {
      // Navigate to root
      setFolder(null)
    } else {
      // Navigate to specific folder
      setFolder(folderId)
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <FolderBreadcrumb path={folderPath} onFolderClick={handleBreadcrumbClick} />

        <div className="flex items-center gap-2">
          <form onSubmit={handleSearch} className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search files..."
              className="pl-8 w-[200px] md:w-[300px]"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </form>

          <Tabs defaultValue={viewMode} onValueChange={(v) => setViewMode(v as "grid" | "list")}>
            <TabsList>
              <TabsTrigger value="grid">
                <Grid className="h-4 w-4" />
              </TabsTrigger>
              <TabsTrigger value="list">
                <List className="h-4 w-4" />
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>

      <FileToolbar
        isAdmin={isAdmin}
        currentFolder={folder || undefined}
        onFilesUploaded={() => {
          // Refresh files after upload
          listFiles(folder || undefined).then((result) => {
            if ('success' in result && result.success) {
              // Filter out null values and cast to proper type
              const validFiles = (result.files || []).filter(file => file !== null) as any[]
              setFiles(validFiles)
            }
          })
        }}
      />

      {isLoading ? (
        <Card>
          <CardContent className="p-6">
            <div className="space-y-4">
              {viewMode === "grid" ? (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                    <Skeleton key={i} className="h-[150px] w-full" />
                  ))}
                </div>
              ) : (
                <div className="space-y-2">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Skeleton key={i} className="h-12 w-full" />
                  ))}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      ) : files.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <h3 className="text-lg font-medium mb-2">No files found</h3>
            <p className="text-muted-foreground mb-4">
              {searchQuery ? "No files match your search query" : "This folder is empty"}
            </p>
            {isAdmin && <Button onClick={() => document.getElementById("file-upload")?.click()}>Upload Files</Button>}
          </CardContent>
        </Card>
      ) : (
        <>
          {viewMode === "grid" ? (
            <FileGrid files={files} onFolderClick={handleFolderClick} isAdmin={isAdmin} />
          ) : (
            <FileList files={files} onFolderClick={handleFolderClick} isAdmin={isAdmin} />
          )}
        </>
      )}
    </div>
  )
}

