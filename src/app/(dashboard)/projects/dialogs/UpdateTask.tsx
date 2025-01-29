"use client";

import ModalDropzone from "@/components/modals/modal-dropzone";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Icons } from "@/components/ui/icons";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import {
  addChecklistItem,
  removeChecklistItem,
  updateChecklistItem,
} from "@/lib/checklist";
import { cn } from "@/lib/utils";
import { IChecklistItem } from "@/types/checklist";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";

import { format } from "date-fns";
import { CalendarIcon, X } from "lucide-react";
import { useRouter } from "next/navigation";

import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

type Props = {
  users: any;
  boards: any;
  boardId?: string;
  initialData: any;
  onDone?: () => void;
};

const UpdateTaskDialog = ({
  users,
  boards,
  boardId,
  initialData,
  onDone,
}: Props) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [checklistItems, setChecklistItems] = useState<IChecklistItem[]>(
    initialData.checklist
  );

  const router = useRouter();
  const { toast } = useToast();

  const formSchema = z.object({
    title: z.string().min(3).max(255),
    user: z.string().min(3).max(255),
    dueDateAt: z.date(),
    priority: z.string().min(3).max(10),
    content: z.string().min(3).max(500),
    boardId: z.string().min(3).max(255),
  });

  type UpdatedTaskForm = z.infer<typeof formSchema>;

  const form = useForm<UpdatedTaskForm>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: initialData.title,
      user: initialData.user,
      dueDateAt: initialData.dueDateAt,
      priority: initialData.priority,
      content: initialData.content,
      boardId: boardId,
    },
  });

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  //Actions
  console.log("BoardId:", boardId);

  const onSubmit = async (data: UpdatedTaskForm) => {
    setIsLoading(true);
    try {
      await axios.put(
        `/api/projects/tasks/update-task/${initialData.id}`,
        data
      );
      toast({
        title: "Success",
        description: `Task: ${data.title}, updated successfully`,
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error?.response?.data,
      });
    } finally {
      setIsLoading(false);
      onDone && onDone();
      router.refresh();
    }
  };

  return (
    <div className="flex flex-col space-y-2 w-full ">
      <ScrollArea className="flex h-screen w-full">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="h-full w-full space-y-3"
        >
          <div className="flex flex-col space-y-3">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Task - Id: {initialData.id}</FormLabel>
                  <FormControl>
                    <Input
                      disabled={isLoading}
                      placeholder="Enter task name"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Task description</FormLabel>
                  <FormControl>
                    <Textarea
                      disabled={isLoading}
                      placeholder="Enter task description"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="dueDateAt"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Due date</FormLabel>
                  <FormControl>
                    <Input
                      type="date"
                      disabled={isLoading}
                      placeholder="Enter date"
                      min={new Date().toISOString().split("T")[0]}
                      {...field}
                      value={
                        field.value
                          ? field.value.toISOString().split("T")[0]
                          : ""
                      }
                      onChange={(e) => field.onChange(new Date(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="user"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Assigned to</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select assigned user" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="h-56 overflow-y-auto">
                      {users.map((user: any) => (
                        <SelectItem key={user.id} value={user.id}>
                          {user.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="priority"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Choose task priority</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select tasks priority" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="critical">Critical</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="space-y-2">
              <Label>Checklist &nbsp;</Label>
              {checklistItems.map((item) => (
                <div key={item.id} className="flex items-center space-x-2">
                  <Input
                    value={item.text}
                    onChange={(e) =>
                      updateChecklistItem({
                        setChecklistItems,
                        checklistItems,
                        id: item.id,
                        text: e.target.value,
                      })
                    }
                  />
                  <Button
                    type="button"
                    onClick={() =>
                      removeChecklistItem({
                        setChecklistItems,
                        checklistItems,
                        id: item.id,
                      })
                    }
                    variant="ghost"
                    size="icon"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              <Button
                type="button"
                onClick={() =>
                  addChecklistItem({ setChecklistItems, checklistItems })
                }
                variant="outline"
              >
                Add Checklist Item
              </Button>
            </div>
          </div>
          <div className="flex w-full justify-end space-x-2 pt-2">
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <Icons.spinner className="animate-spin" />
              ) : (
                "Update"
              )}
            </Button>
          </div>
        </form>
      </Form>
      </ScrollArea>
    </div>
  );
};

export default UpdateTaskDialog;
