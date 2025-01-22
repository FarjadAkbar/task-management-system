"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { toast } from "react-toastify";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

interface ProfileFormProps {
  data: any;
}

const FormSchema = z.object({
  id: z.string(),
  name: z.string().min(3).max(50),
  username: z.string().min(2).max(50),
  account_name: z.string().min(2).max(50),
});

export function ProfileForm({ data }: ProfileFormProps) {
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const router = useRouter();

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: data
      ? { ...data }
      : {
          name: "",
          username: "",
          account_name: "",
        },
  });

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    try {
      setIsLoading(true);
      await axios.put(`/api/user/${data.id}/updateprofile`, data);
      //TODO: send data to the server
      toast.success("Profile updated successfully");
      router.refresh();
    } catch (error) {
        toast.error("Error updating profile");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex space-x-5 w-full p-5 items-end"
      >
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem className="w-1/3">
              <FormLabel>Full name</FormLabel>
              <FormControl>
                <Input disabled={isLoading} placeholder="John Doe" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem className="w-1/3">
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input disabled={isLoading} placeholder="jdoe" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="account_name"
          render={({ field }) => (
            <FormItem className="w-1/3">
              <FormLabel>Company</FormLabel>
              <FormControl>
                <Input
                  disabled={isLoading}
                  placeholder="Tesla Inc.,"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button className="w-[150px]" type="submit">
          Update
        </Button>
      </form>
    </Form>
  );
}
