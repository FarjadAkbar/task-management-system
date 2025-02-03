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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { Icons } from "@/components/ui/icons";

const roles = ["Developer", "Animator", "SEO", "Content Writer", "Designer", "Manager", "Marketer", "Lead"];
const FormSchema = z.object({
  name: z.string().min(3).max(50),
  email: z.string().email(),
  role: z.enum(roles as [string, ...string[]])
});

export function InviteForm() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const router = useRouter();

  const { toast } = useToast();

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  });

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    setIsLoading(true);
    try {
      const response = await axios.post("/api/user/inviteuser", data);

      if (response.data.error) {
        toast({
          variant: "destructive",
          title: "Error",
          description: response.data.error,
        });
      } else {
        toast({
          title: "Success!",
          description: "User invited successfully.",
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Something went wrong while inviting the user.",
      });
    } finally {
      form.reset({
        name: "",
        email: "",
        role: roles[0]
      });
      router.refresh();
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
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input disabled={isLoading} placeholder="jdoe" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem className="w-1/3">
              <FormLabel>E-main</FormLabel>
              <FormControl>
                <Input
                  disabled={isLoading}
                  placeholder="name@domain.com"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
       <FormField
        control={form.control}
        name="role"
        render={({ field }) => (
          <FormItem className="w-1/3">
            <FormLabel>Role</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value} disabled={isLoading}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select a role" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {roles.map((role) => (
                  <SelectItem key={role} value={role}>
                    {role.charAt(0).toUpperCase() + role.slice(1).toLowerCase()}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
        <Button className="w-[150px]" type="submit" disabled={isLoading}>
          {isLoading ? (
            <Icons.spinner className="animate-spin" />
          ) : (
            "Invite user"
          )}
        </Button>
      </form>
    </Form>
  );
}
