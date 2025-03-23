"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter, usePathname, useSearchParams } from "next/navigation"
import { FileGrid } from "@/components/dashboard/filesystem/file-grid"
import { FileList } from "@/components/dashboard/filesystem/file-list"
import { FolderBreadcrumb } from "@/components/dashboard/filesystem/folder-breadcrumb"
import { FileToolbar } from "@/components/dashboard/filesystem/file-toolbar"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { toast } from "@/hooks/use-toast"
import { Search, Grid, List } from "lucide-react"
import { listFiles } from "@/actions/filesystem"

interface FileExplorerProps {
  isAdmin: boolean
}

export function FileExplorer({ isAdmin }: FileExplorerProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [isLoading, setIsLoading] = useState(true)
  const [files, setFiles] = useState<any[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [currentFolder, setCurrentFolder] = useState<string | undefined>(undefined)
  const [folderPath, setFolderPath] = useState<Array<{ id: string; name: string }>>([])

  // Get current folder from URL
  useEffect(() => {
    const folder = searchParams.get("folder")
    setCurrentFolder(folder || undefined)
  }, [searchParams])

  // Load files
  useEffect(() => {
    const loadFiles = async () => {
      setIsLoading(true)
      try {
        const result = await listFiles(currentFolder, searchQuery || undefined)

        if (result.error) {
          toast({
            title: "Error",
            description: result.error,
            variant: "destructive",
          })
          return
        }

        if (result.success) {
          setFiles(result.files || [])
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
  }, [currentFolder, searchQuery])

  // Update folder path breadcrumb
  useEffect(() => {
    const updateFolderPath = async () => {
      if (!currentFolder) {
        setFolderPath([{ id: "", name: "Root" }])
        return
      }

      // TODO: Implement folder path traversal
      // For now, just show current folder
      setFolderPath([
        { id: "", name: "Root" },
        { id: currentFolder, name: "Current Folder" },
      ])
    }

    updateFolderPath()
  }, [currentFolder])

  // Handle folder navigation
  const handleFolderClick = (folderId: string) => {
    const params = new URLSearchParams(searchParams)
    params.set("folder", folderId)
    router.push(`${pathname}?${params.toString()}`)
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
      const params = new URLSearchParams(searchParams)
      params.delete("folder")
      router.push(`${pathname}?${params.toString()}`)
    } else {
      // Navigate to specific folder
      const params = new URLSearchParams(searchParams)
      params.set("folder", folderId)
      router.push(`${pathname}?${params.toString()}`)
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
        currentFolder={currentFolder}
        onFilesUploaded={() => {
          // Refresh files after upload
          listFiles(currentFolder).then((result) => {
            if (result.success) {
              setFiles(result.files || [])
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

