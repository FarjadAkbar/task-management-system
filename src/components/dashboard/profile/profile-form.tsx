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
  firstname: z.string().min(3).max(50),
  lastname: z.string().min(3).max(50),
  email: z.string().email("Invalid email address"),
  username: z.string().min(2).max(50),
  account_name: z.string().min(2).max(50),
  job_title: z.string().nonempty("Job title is required"),
  timezone: z.string().nonempty("Timezone is required"),
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
        timezone: "",
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
        className="space-y-4"
      >
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input disabled={isLoading} placeholder="John@gmail.com" {...field}
                  className="w-full border rounded-md px-3 py-2" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <FormField
              control={form.control}
              name="firstname"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>First name</FormLabel>
                  <FormControl>
                    <Input disabled={isLoading} placeholder="John Doe" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div>
            <FormField
              control={form.control}
              name="lastname"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Last Name</FormLabel>
                  <FormControl>
                    <Input disabled={isLoading} placeholder="jdoe" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
        <FormField
          control={form.control}
          name="account_name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Company</FormLabel>
              <FormControl>
                <Input
                  disabled={isLoading}
                  placeholder=""
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="job_title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Job Title</FormLabel>
              <FormControl>
                <Input
                  disabled={isLoading}
                  placeholder=""
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="timezone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Timezone</FormLabel>
              <FormControl>
                <select
                  {...field}
                  disabled={isLoading}
                  className="w-full border border-gray-300 rounded-md p-2"
                >
                  <option value="">Select a timezone</option>
                </select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />


        <Button className="w-[150px]" type="submit">
          Save Changes
        </Button>
      </form>
    </Form >
  );
}
