"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { toast } from "@/hooks/use-toast"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { createNewFolder } from "@/actions/filesystem"
import { FolderPlus, Upload, RefreshCw } from "lucide-react"
import { FileUploaderDropzone } from "@/components/ui/file-uploader-dropzone"
import { revalidatePath } from "next/cache"
import { Separator } from "@/components/ui/separator"

interface FileToolbarProps {
  isAdmin: boolean
  currentFolder?: string
  onFilesUploaded?: () => void
}

const folderSchema = z.object({
  name: z.string().min(1, "Folder name is required"),
})

export function FileToolbar({ isAdmin, currentFolder, onFilesUploaded }: FileToolbarProps) {
  const [showNewFolderDialog, setShowNewFolderDialog] = useState(false)
  const [showUploadDialog, setShowUploadDialog] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<z.infer<typeof folderSchema>>({
    resolver: zodResolver(folderSchema),
    defaultValues: {
      name: "",
    },
  })

  const handleCreateFolder = async (values: z.infer<typeof folderSchema>) => {
    setIsSubmitting(true)

    try {
      const result = await createNewFolder({
        name: values.name,
        parentId: currentFolder,
      })

      if (result.error) {
        toast({
          title: "Error",
          description: typeof result.error === "string" ? result.error : "Failed to create folder",
          variant: "destructive",
        })
        return
      }

      toast({
        title: "Success",
        description: "Folder created successfully",
      })

      form.reset()
      setShowNewFolderDialog(false)

      // Refresh the file list
      if (onFilesUploaded) {
        onFilesUploaded()
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Something went wrong",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleUploadSuccess = () => {
    setShowUploadDialog(false)

    // Refresh the file list
    if (onFilesUploaded) {
      onFilesUploaded()
    }
  }

  // const handleSync = async () => {
    
  // };

  return (
    <>
          {isAdmin ? (
      <Card className="p-2">
        <div className="flex flex-wrap items-center gap-2">
            <>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowNewFolderDialog(true)}
                className="bg-black hover:bg-gold text-gold hover:text-black w-full sm:w-auto"
              >
                <FolderPlus className="h-4 w-4 mr-2" />
                New Folder
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowUploadDialog(true)}
                className="bg-black hover:bg-gold text-gold hover:text-black w-full sm:w-auto"
              >
                <Upload className="h-4 w-4 mr-2" />
                Upload Files
              </Button>
            </>

          {/* <Button
            variant="ghost"
            size="sm"
            onClick={handleSync}
            className="w-full sm:w-auto"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button> */}
        </div>
      </Card>
          ) : <Separator className="my-4" />}



      {/* New Folder Dialog */}
      <Dialog open={showNewFolderDialog} onOpenChange={setShowNewFolderDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Folder</DialogTitle>
            <DialogDescription>Enter a name for your new folder</DialogDescription>
          </DialogHeader>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleCreateFolder)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Folder Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter folder name..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowNewFolderDialog(false)}
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Creating..." : "Create Folder"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Upload Files Dialog */}
      <Dialog open={showUploadDialog} onOpenChange={setShowUploadDialog}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Upload Files</DialogTitle>
            <DialogDescription>
              Select files to upload to {currentFolder ? "this folder" : "your drive"}
            </DialogDescription>
          </DialogHeader>

          <div className="py-4">
            <FileUploaderDropzone onUploadSuccess={handleUploadSuccess} folderId={currentFolder} />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setShowUploadDialog(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}

