"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { toast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Form,
  FormField,
  FormItem,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Edit, Loader, X } from "lucide-react";
import { FileUploaderDropzone } from "@/components/ui/file-uploader-dropzone";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTrigger,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { useUpdateToolMutation } from "@/service/tools";
import { useDeleteFileMutation } from "@/service/files";
import { ToolType } from "@/service/tools/type";

interface EditToolDialogProps {
  tool: ToolType;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}


export default function EditToolDialog({ tool, open, onOpenChange }: EditToolDialogProps) {
  // const [open, setOpen] = useState(false)
  const [uploadedFiles, setUploadedFiles] = useState<Array<{ id: string; name: string; url: string }>>([
    {
      id: tool.document.id,
      name: tool.document?.name || "Document",
      url: tool.document?.document_file_url || "",
    }
  ])

  const { mutate, isPending } = useUpdateToolMutation()
  const { mutate: fileMutate } = useDeleteFileMutation()

  const formSchema = z.object({
    name: z.string().min(2, "Tool name must be at least 2 characters."),
    username: z.string().email("Enter a valid email."),
    password: z.string().min(6, "Password must be at least 6 characters."),
    department: z.string().nonempty("Department is required."),
  })

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: tool.name,
      username: tool.username,
      password: tool.password,
      department: tool.department,
    },
  })

  const handleFileUpload = (files: Array<{ id: string; name: string; url: string }>) => {
    setUploadedFiles([...files])
  }

  const removeFile = async (fileId: string) => {
    try {
      setUploadedFiles((prevFiles) => prevFiles.filter((file) => file.id !== fileId))
      fileMutate(fileId, {
        onSuccess: () => {
          toast({
            title: "Success",
            description: "File deleted successfully",
          })
        },
      })
    } catch (error) {
      console.error("Error removing file:", error)
    }
  }

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    if (isPending) return

    const payload = {
      id: tool.id,
      ...values,
      documentID: uploadedFiles[0]?.id,
      userId: tool.user,
    }

    mutate(payload, {
      onSuccess: () => {
        toast({
          title: "Success",
          description: "Tool updated successfully",
        })
        onOpenChange(false);
      },
      onError: (error: any) => {
        toast({
          title: "Error",
          description: error.message || "Failed to update tool",
          variant: "destructive",
        })
      },
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {/* <DialogTrigger asChild>
        <Button variant="link" className="p-0" size="sm" onClick={() => setOpen(true)}>
          <Edit /> Edit
        </Button>
      </DialogTrigger> */}
      <DialogContent className="max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="p-2">Edit Tool</DialogTitle>
          <DialogDescription className="p-2">Update the tool information</DialogDescription>
        </DialogHeader>

        <div className="w-full">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <Label>Tool Name</Label>
                    <FormControl>
                      <Input
                        placeholder="Enter tool name"
                        {...field}
                        className="w-full py-1 bg-white text-black rounded-md focus:border-gold focus-visible:ring-transparent focus-visible:ring-offset-0"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <Label>Username</Label>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="Enter email"
                        {...field}
                        className="w-full py-1 bg-white text-black rounded-md focus:border-gold focus-visible:ring-transparent focus-visible:ring-offset-0"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <Label>Password</Label>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="Enter password"
                        {...field}
                        className="w-full py-1 bg-white text-black rounded-md focus:border-gold focus-visible:ring-transparent focus-visible:ring-offset-0"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="department"
                render={({ field }) => (
                  <FormItem>
                    <Label>Department</Label>
                    <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value}>
                      <FormControl>
                        <SelectTrigger className="w-full py-1 bg-white text-black rounded-md focus:border-gold focus-visible:ring-transparent focus-visible:ring-offset-0">
                          <SelectValue placeholder="Select department" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Web Developer">Web Developer</SelectItem>
                        <SelectItem value="Graphic Designer">Graphic Designer</SelectItem>
                        <SelectItem value="SEO Content Writer">SEO Content Writer</SelectItem>
                        <SelectItem value="SEO Specialist">SEO Specialist</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="space-y-2">
                <Label>Attachments</Label>
                <FileUploaderDropzone onUploadSuccess={handleFileUpload} />
                {uploadedFiles.length > 0 && (
                  <div className="mt-2">
                    <p className="text-sm font-medium">Uploaded files:</p>
                    <ul className="mt-2 space-y-2">
                      {uploadedFiles.map((file, index) => {
                        return (
                          <li key={file.id || index} className="flex items-center justify-between rounded-md border p-2">
                            <span className="text-sm truncate max-w-[200px]">{file.name}</span>
                            <Button type="button" onClick={() => removeFile(file.id)} variant="ghost" size="sm">
                              <X className="h-4 w-4" />
                            </Button>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                )}
              </div>

              <div className="flex w-full justify-end space-x-2 pt-4">
                <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                  Cancel
                </Button>
                <Button disabled={isPending} type="submit">
                  {isPending ? (
                    <>
                      <Loader className="mr-2 h-4 w-4 animate-spin" />
                      Updating...
                    </>
                  ) : (
                    "Update Tool"
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog >
  )
}





// setTimeout(() => setOpen(false), 500)