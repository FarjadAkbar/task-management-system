"use client";

import SuspenseLoading from "@/components/loadings/suspense";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTrigger,
  DialogTitle,
  DialogDescription,
  DialogFooter,
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { useRouter } from "next/navigation";

import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { DatePicker } from "../_components/DatePicker";
import { TimeSelect } from "../_components/TimeSelect";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";
import { requireUser } from "@/lib/user";
import { getUsers } from "@/actions/events/get-users";

const NewEventDialog = async () => {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [isMounted, setIsMounted] = useState(false);

  const router = useRouter();
  const { toast } = useToast();

  const formSchema = z.object({
     title: z.string().min(1, "Title is required"),
      description: z.string().optional(),
      duration: z.enum(["15", "30", "45", "60"]),
      participants: z.array(z.string()).min(1, "At least one participant must be selected"),
      eventDate: z.date({ required_error: "Please select a date" }),
      eventTime: z.string({ required_error: "Please select a time slot" }),
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
  const user = await requireUser()
  const employees = await getUsers(user.id);

  const onSubmit = async (data: NewAccountFormValues) => {
    console.log(data);
    setIsLoading(true);
    try {
      await axios.post("/api/events/", data);
      toast({
        title: "Success",
        description: `New project: ${data.title}, created successfully`,
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
      router.refresh();
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="px-2">New event</Button>
      </DialogTrigger>
      <DialogContent className="">
        <DialogHeader>
          <DialogTitle className="p-2">New Event</DialogTitle>
          <DialogDescription className="p-2">
            Fill out the form below to create a new event.
          </DialogDescription>
        </DialogHeader>
        {isLoading ? (
          <SuspenseLoading />
        ) : (
          <div className="flex w-full ">
            <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid gap-6">
              <div className="grid gap-4 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Event Title</FormLabel>
                      <FormControl>
                        <Input placeholder="Quick Meeting" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="duration"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Duration</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select duration" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="15">15 minutes</SelectItem>
                          <SelectItem value="30">30 minutes</SelectItem>
                          <SelectItem value="45">45 minutes</SelectItem>
                          <SelectItem value="60">60 minutes</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Write a summary and any details your invitee should know about the event"
                        className="min-h-[100px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="participants"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Participants</FormLabel>
                    <Select
                      onValueChange={(value) => {
                        if (!field.value.includes(value)) {
                          field.onChange([...field.value, value])
                        }
                      }}
                      value={undefined}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Add team members" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {employees.map((employee) => (
                          <SelectItem key={employee.id} value={employee.id}>
                            {employee.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {field.value.map((participantId) => {
                        const participant = employees.find((e) => e.id === participantId)
                        return (
                          <Badge key={participantId} variant="secondary">
                            {participant?.name}
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              className="ml-2 h-auto p-0 text-muted-foreground hover:text-foreground"
                              onClick={() => {
                                field.onChange(field.value.filter((id) => id !== participantId))
                              }}
                            >
                              <X className="h-3 w-3" />
                            </Button>
                          </Badge>
                        )
                      })}
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid gap-4 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="eventDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Event Date</FormLabel>
                      <FormControl>
                        <DatePicker selected={field.value} onSelect={(date: Date | undefined) => field.onChange(date)} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="eventTime"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Event Time</FormLabel>
                      <FormControl>
                        <TimeSelect
                          selectedTime={field.value}
                          onChange={(time: string) => field.onChange(time)}
                          duration={Number(form.watch("duration"))}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
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
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default NewEventDialog;
