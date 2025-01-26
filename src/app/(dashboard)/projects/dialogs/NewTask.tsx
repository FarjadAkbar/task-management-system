"use client";

import SuspenseLoading from "@/components/loadings/suspense";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTrigger,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
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
import { addChecklistItem, removeChecklistItem, updateChecklistItem } from "@/lib/checklist";
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
};

const NewTaskDialog = ({ users, boards }: Props) => {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [isMounted, setIsMounted] = useState(false);
  const [checklistItems, setChecklistItems] = useState<IChecklistItem[]>([]);

  const router = useRouter();
  const { toast } = useToast();

  const formSchema = z.object({
    title: z.string().min(3).max(255),
    user: z.string().min(3).max(255),
    board: z.string().min(3).max(255),
    priority: z.string().min(3).max(10),
    content: z.string().min(3).max(500),
    checklist: z
      .array(
        z.object({
          id: z.string(),
          text: z.string(),
          checked: z.boolean(),
        })
      )
      .optional(),
    dueDateAt: z.date().default(new Date()),
  });

  type NewAccountFormValues = z.infer<typeof formSchema>;

  const form = useForm<NewAccountFormValues>({
    resolver: zodResolver(formSchema),
  });

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  //Actions
  
  const onSubmit = async (data: NewAccountFormValues) => {
    console.log(data);
    setIsLoading(true);
    try {
      await axios.post(`/api/projects/tasks/create-task`, {
        ...data,
        checklist: checklistItems,
      });
      toast({
        title: "Success",
        description: `New task: ${data.title}, created successfully`,
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error?.response?.data,
      });
    } finally {
      setIsLoading(false);
      setOpen(false);
      form.reset({
        title: "",
        content: "",
        user: "",
        board: "",
        priority: "",
      });
      router.refresh();
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="px-2">Create task</Button>
      </DialogTrigger>
      <DialogContent className="">
        <DialogHeader>
          <DialogTitle className="p-2">Create New Task</DialogTitle>
          <DialogDescription className="p-2">
            Fill out the form below to create a new task.
          </DialogDescription>
        </DialogHeader>
        {isLoading ? (
          <SuspenseLoading />
        ) : (
          <ScrollArea className="flex h-[400px] w-full">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="h-full w-full space-y-3 px-4"
              >
                <div className="flex flex-col space-y-3">
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>New task name</FormLabel>
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
                          {...field}
                          value={field.value ? field.value.toISOString().split('T')[0] : ''}
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
                    name="board"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Choose project</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select tasks board" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {boards.map((board: any) => (
                              <SelectItem key={board.id} value={board.id}>
                                {board.title}
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
                      <div
                        key={item.id}
                        className="flex items-center space-x-2"
                      >
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
                      onClick={() => addChecklistItem({ setChecklistItems, checklistItems })}
                      variant="outline"
                    >
                      Add Checklist Item
                    </Button>
                  </div>
                </div>
                <div className="flex w-full justify-end space-x-2 pt-2">
                  <DialogTrigger asChild>
                    <Button variant={"destructive"}>Cancel</Button>
                  </DialogTrigger>
                  <Button type="submit">Create</Button>
                </div>
              </form>
            </Form>
          </ScrollArea>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default NewTaskDialog;
