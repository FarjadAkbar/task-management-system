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
import { toast } from "@/hooks/use-toast";
import { useTicketMutation } from "@/service/tickets";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const formSchema = z.object({
  title: z.string().min(3).max(255),
  description: z.string().min(3).max(500),
  priority: z.string().min(3).max(255),
});

type FormValues = z.infer<typeof formSchema>


export function CreateTicketDialog() {
  const { mutate, isPending } = useTicketMutation();
  const [openDialog, setOpenDialog] = useState(false);

    const form = useForm<FormValues>({
      resolver: zodResolver(formSchema),
      defaultValues: {
        title: "",
        description: "",
        priority: "LOW",
      },
    });

 const onSubmit = (values: z.infer<typeof formSchema>) => {
     if (isPending) return;
 
     mutate(values, {
       onSuccess: (data) => {
         toast({
           title: "Ticket Created",
           description: `Ticket created successfully`,
         });
         setOpenDialog(false);
         form.reset();
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
    <Dialog open={openDialog} onOpenChange={setOpenDialog}>
      <DialogTrigger asChild>
        <Button className="px-2 bg-black hover:bg-gold text-gold hover:text-black">New ticket</Button>
      </DialogTrigger>
      <DialogContent className="">
        <DialogHeader>
          <DialogTitle className="p-2">New Ticket</DialogTitle>
          <DialogDescription className="p-2">
            Fill out the form below to create a new ticket.
          </DialogDescription>
        </DialogHeader>
        <div className="flex w-full ">
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
                      <FormLabel>Title</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter title"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Enter description"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="priority"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Priority</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select priority" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value={"LOW"}>{`Low`}</SelectItem>
                          <SelectItem value={"MEDIUM"}>{`Medium`}</SelectItem>
                          <SelectItem value={"HIGH"}>{`High`}</SelectItem>
                          <SelectItem value={"URGENT"}>{`Urgent`}</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="flex w-full justify-end space-x-2 pt-2">
                <DialogTrigger asChild>
                  <Button variant={"destructive"}>Cancel</Button>
                </DialogTrigger>
                <Button type="submit" disabled={isPending}>
                {isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating...
                  </>
                ) : (
                  "Create Ticket"
                )}
              </Button>
              </div>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
};

