"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
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
import { toast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { Icons } from "@/components/ui/icons";
import { useInviteUserMutation } from "@/service/users";
import { RoleEnum } from "@prisma/client";

const formSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
  firstName: z.string().min(1, { message: "First name is required" }),
  lastName: z.string().min(1, { message: "Last name is required" }),
  webmailEmail: z.string().email({ message: "Please enter a valid email address" }),
  webmailPassword: z.string().min(1, { message: "Webmail password is required" }),
  clockinUsername: z.string().min(1, { message: "Please enter a valid email address" }),
  clockinPassword: z.string().min(1, { message: "Clockin password is required" }),
  role: z.enum([
    RoleEnum.ADMIN,
    RoleEnum.DEVELOPER,
    RoleEnum.DESIGNER,
    RoleEnum.ANIMATOR,
    RoleEnum.SEO,
    RoleEnum.CONTENT_WRITER,
    RoleEnum.MANAGER,
    RoleEnum.MARKETER,
    RoleEnum.LEAD,
    RoleEnum.IT,
    RoleEnum.OPERATION,
  ]),
});

export function InviteForm() {
  const { mutate, isPending } = useInviteUserMutation();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      firstName: "",
      lastName: "",
      webmailEmail: "",
      webmailPassword: "",
      clockinUsername: "",
      clockinPassword: "",
      role: RoleEnum.DEVELOPER,
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    if (isPending) return;

    mutate(values, {
      onSuccess: (data) => {
        toast({
          title: "Invitation sent",
          description: `An invitation has been sent to ${values.email}`,
        });
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
    <div className="relative bg-white backdrop-blur-md rounded-2xl p-6 shadow-[0_8px_28px_rgba(0,0,0,0.1)] border border-gold/25 hover:shadow-[0_12px_40px_rgba(255,215,0,0.2)] transition-all duration-500 w-full mx-auto">
      <h4 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4 transition-colors duration-400 hover:text-gold">
        Invite New User
      </h4>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="grid grid-cols-4 gap-4 w-full relative z-10"
        >
          <FormField
            control={form.control}
            name="firstName"
            render={({ field }) => (
              <FormItem className="w-full md:w-auto">
                <FormLabel className="text-gray-900 font-semibold">First Name</FormLabel>
                <FormControl>
                  <Input
                    placeholder="John"
                    {...field}
                    className="bg-white/30 border-gold/50 text-gray-900 placeholder:text-gray-500 focus:border-gold focus:ring-2 focus:ring-gold/40 transition-all duration-300 rounded-lg"
                  />
                </FormControl>
                <FormMessage className="text-gold/80" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="lastName"
            render={({ field }) => (
              <FormItem className="w-full md:w-auto">
                <FormLabel className="text-gray-900 font-semibold">Last Name</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Doe"
                    {...field}
                    className="bg-white/30 border-gold/50 text-gray-900 placeholder:text-gray-500 focus:border-gold focus:ring-2 focus:ring-gold/40 transition-all duration-300 rounded-lg"
                  />
                </FormControl>
                <FormMessage className="text-gold/80" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem className="w-full md:w-auto">
                <FormLabel className="text-gray-900 font-semibold">E-mail</FormLabel>
                <FormControl>
                  <Input
                    placeholder="name@domain.com"
                    {...field}
                    className="bg-white/30 border-gold/50 text-gray-900 placeholder:text-gray-500 focus:border-gold focus:ring-2 focus:ring-gold/40 transition-all duration-300 rounded-lg"
                  />
                </FormControl>
                <FormMessage className="text-gold/80" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="role"
            render={({ field }) => (
              <FormItem className="w-full md:w-auto">
                <FormLabel className="text-gray-900 font-semibold">Role</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger className="w-full bg-white/30 border-gold/50 text-gray-900 focus:border-gold focus:ring-2 focus:ring-gold/40 transition-all duration-300 rounded-lg">
                      <SelectValue placeholder="Select a role" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent className="bg-white/95 border-gold/50 text-gray-900 rounded-lg">
                    <SelectItem value={RoleEnum.ADMIN}>Admin</SelectItem>
                    <SelectItem value={RoleEnum.DEVELOPER}>Developer</SelectItem>
                    <SelectItem value={RoleEnum.DESIGNER}>Designer</SelectItem>
                    <SelectItem value={RoleEnum.ANIMATOR}>Animator</SelectItem>
                    <SelectItem value={RoleEnum.SEO}>SEO</SelectItem>
                    <SelectItem value={RoleEnum.CONTENT_WRITER}>
                      Content Writer
                    </SelectItem>
                    <SelectItem value={RoleEnum.MANAGER}>Manager</SelectItem>
                    <SelectItem value={RoleEnum.MARKETER}>Marketer</SelectItem>
                    <SelectItem value={RoleEnum.LEAD}>Lead</SelectItem>
                    <SelectItem value={RoleEnum.IT}>IT</SelectItem>
                    <SelectItem value={RoleEnum.OPERATION}>Operation</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage className="text-gold/80" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="webmailEmail"
            render={({ field }) => (
              <FormItem className="w-full md:w-auto">
                <FormLabel className="text-gray-900 font-semibold">Webmail Email</FormLabel>
                <FormControl>
                  <Input
                    placeholder="name@domain.com"
                    {...field}
                    className="bg-white/30 border-gold/50 text-gray-900 placeholder:text-gray-500 focus:border-gold focus:ring-2 focus:ring-gold/40 transition-all duration-300 rounded-lg"
                  />
                </FormControl>
                <FormMessage className="text-gold/80" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="webmailPassword"
            render={({ field }) => (
              <FormItem className="w-full md:w-auto">
                <FormLabel className="text-gray-900 font-semibold">Webmail Password</FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    placeholder="*****"
                    {...field}
                    className="bg-white/30 border-gold/50 text-gray-900 placeholder:text-gray-500 focus:border-gold focus:ring-2 focus:ring-gold/40 transition-all duration-300 rounded-lg"
                  />
                </FormControl>
                <FormMessage className="text-gold/80" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="clockinUsername"
            render={({ field }) => (
              <FormItem className="w-full md:w-auto">
                <FormLabel className="text-gray-900 font-semibold">Clockin Username</FormLabel>
                <FormControl>
                  <Input
                    placeholder="John"
                    {...field}
                    className="bg-white/30 border-gold/50 text-gray-900 placeholder:text-gray-500 focus:border-gold focus:ring-2 focus:ring-gold/40 transition-all duration-300 rounded-lg"
                  />
                </FormControl>
                <FormMessage className="text-gold/80" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="clockinPassword"
            render={({ field }) => (
              <FormItem className="w-full md:w-auto">
                <FormLabel className="text-gray-900 font-semibold">Clockin Password</FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    placeholder="*****"
                    {...field}
                    className="bg-white/30 border-gold/50 text-gray-900 placeholder:text-gray-500 focus:border-gold focus:ring-2 focus:ring-gold/40 transition-all duration-300 rounded-lg"
                  />
                </FormControl>
                <FormMessage className="text-gold/80" />
              </FormItem>
            )}
          />

          <Button
            className="w-full md:w-[150px] bg-black border border-gold/30 text-gold hover:bg-gold hover:text-black font-semibold rounded-lg transition-all duration-300 mt-2 hover:scale-105"
            type="submit"
            disabled={isPending}
          >
            {isPending ? (
              <Icons.spinner className="animate-spin h-5 w-5" />
            ) : (
              "Invite User"
            )}
          </Button>
        </form>
      </Form>
    </div>
  );
}
