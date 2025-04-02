"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { useState } from "react";
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
import { Loader, X } from "lucide-react";
import { FileUploaderDropzone } from "@/components/ui/file-uploader-dropzone";
import { getUser } from "@/lib/get-user";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTrigger,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { useCreateToolMutation } from "@/service/tools";
import { useDeleteFileMutation } from "@/service/files";
import AdminWrapper from "../admin-wrapper";

export default function NewToolDialog({ userId }: { userId: string }) {
  const [open, setOpen] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<
    Array<{ id: string; name: string; url: string }>
  >([]);


  const { mutate, isPending } = useCreateToolMutation();
  const { mutate: fileMutate } = useDeleteFileMutation();

  const formSchema = z.object({
    name: z.string().min(2, "Tool name must be at least 2 characters."),
    username: z.string().email("Enter a valid email."),
    password: z.string().min(6, "Password must be at least 6 characters."),
    department: z.string().nonempty("Department is required."),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      username: "",
      password: "",
      department: "",
    },
  });
  const handleFileUpload = (
    files: Array<{ id: string; name: string; url: string }>
  ) => {
    setUploadedFiles([...files]);
    console.log(files, "files");
  };
  const removeFile = async (fileId: string) => {
    try {
      setUploadedFiles((prevFiles) =>
        prevFiles.filter((file) => file.id !== fileId)
      );
      fileMutate(fileId, {
        onSuccess: () => {
          toast({
            title: "Success",
            description: "File deleted successfully",
          });
        },
      });
    } catch (error) {
      console.error("Error removing file:", error);
    }
  };

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    if (isPending) return;
    const payload = {
      ...values,
      documentID: uploadedFiles[0]?.id || "",
      createdBy: userId,
    };
    mutate(payload, {
      onSuccess: (data) => {
        const tool = data.tool;
        form.reset();
        toast({
          title: "Success",
          description: "Tool created successfully",
        });
        setUploadedFiles([]);
        setTimeout(() => setOpen(false), 500);
      },
      onError: (error) => {
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive",
        });
      },
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <AdminWrapper>
          <Button className="bg-black text-gold font-bold hover:bg-gold hover:text-black px-5 py-2 rounded-lg shadow-lg hover:scale-105 transition duration-300">+ New Tool</Button>
        </AdminWrapper>
      </DialogTrigger>
      <DialogContent className="w-[600px] max-h-[80vh] overflow-y-auto bg-white shadow-xl rounded-none">
        <DialogHeader>
          <DialogTitle className="p-2">New Tool</DialogTitle>
          <DialogDescription className="p-2">
            Fill in the form to add a new tool
          </DialogDescription>
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
                        className="w-full py-1 bg-white text-black rounded-md focus:border-gold  focus-visible:ring-transparent focus-visible:ring-offset-0"
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
                        className="w-full py-1 bg-white text-black rounded-md focus:border-gold  focus-visible:ring-transparent focus-visible:ring-offset-0"
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
                        className="w-full py-1 bg-white text-black rounded-md focus:border-gold  focus-visible:ring-transparent focus-visible:ring-offset-0"
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
                    <Select onValueChange={field.onChange}>
                      <FormControl>
                        <SelectTrigger className="w-full py-1 bg-white text-black rounded-md focus:border-gold  focus-visible:ring-transparent focus-visible:ring-offset-0">
                          <SelectValue placeholder="Select department" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Web Developer">
                          Web Developer
                        </SelectItem>
                        <SelectItem value="Graphic Designer">
                          Graphic Designer
                        </SelectItem>
                        <SelectItem value="SEO Content Writer">
                          SEO Content Writer
                        </SelectItem>
                        <SelectItem value="SEO Specialist">
                          SEO Specialist
                        </SelectItem>
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
                    <p>Uploaded files:</p>
                    <ul className="list-disc pl-5">
                      {uploadedFiles.map((file) => (
                        <li
                          key={file.id}
                          className="flex items-center justify-between"
                        >
                          <span>{file.name}</span>
                          <Button
                            type="button"
                            onClick={() => removeFile(file.id)}
                            variant="ghost"
                            size="sm"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
              <div className="flex w-full justify-end space-x-2 pt-2">
                <DialogTrigger asChild>
                  <Button variant={"destructive"}>Cancel</Button>
                </DialogTrigger>
                <Button
                  disabled={isPending}
                  className="flex place-self-end  h-[40px] text-white font-semibold"
                  type="submit"
                >
                  {isPending && <Loader className="animate-spin" />}
                  Add Tool
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
