"use client";
import * as React from "react";
import { z } from "zod";
import { FieldValues, Path, useForm, DefaultValues } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";
import { PasswordInput } from "@/components/ui/password-input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import Link from "next/link";

type LoginFormProps<T extends FieldValues> = {
  schema: z.ZodSchema<T>;
  defaultValues: DefaultValues<T>;
  onSubmit: (data: T) => void;
  fields: Array<{
    name: Path<T>;
    placeholder: string;
    type: "text" | "email" | "password";
    icon: React.ElementType;
  }>;
  buttonProps: React.ButtonHTMLAttributes<HTMLButtonElement>;
};

function LoginForm<T extends FieldValues>({
  schema,
  defaultValues,
  onSubmit,
  fields,
  buttonProps,
}: LoginFormProps<T>) {
  const form = useForm<T>({
    resolver: zodResolver(schema),
    defaultValues,
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
        {fields.map((field) => (
          <FormField
            key={field.name as string}
            control={form.control}
            name={field.name}
            render={({ field: inputField }) => (
              <FormItem>
                <FormControl>
                  <div className="relative">
                    <field.icon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
                    {field.type === "password" ? (
                      <PasswordInput
                        className="pl-10"
                        placeholder={field.placeholder}
                        autoComplete="new-password"
                        {...inputField}
                      />
                    ) : (
                      <Input
                        className="pl-10"
                        placeholder={field.placeholder}
                        type={field.type}
                        {...inputField}
                      />
                    )}
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        ))}

        {form.getValues("rememberMe" as Path<T>) !== undefined && (
          <div className="flex items-center justify-between pt-1 pb-2">
            <FormField
              control={form.control}
              name={"rememberMe" as Path<T>}
              render={({ field }) => (
                <FormItem className="flex gap-2 items-center space-y-0">
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      className={`w-10 h-5 bg-gray-200 rounded-full relative ${field.value ? "bg-black" : "bg-gray-400"
                        }`}
                    />
                  </FormControl>
                  <FormLabel className="text-base mt-0">Remember Me</FormLabel>
                </FormItem>
              )}
            />
            <Link href="/reset-password">Forgot Password?</Link>
          </div>
        )}

        {form.getValues("type" as Path<T>) !== undefined && (
          <FormField
            control={form.control}
            name={"type" as Path<T>}
            render={({ field }) => (
              <FormItem>
                <FormLabel>What kind of user are you?</FormLabel>
                <FormControl>
                  <RadioGroup
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    className="grid grid-cols-1 sm:grid-cols-3 gap-4"
                  >
                    {[
                      { value: "musician", label: "Musician" },
                      { value: "venue", label: "Venue Owner" },
                      { value: "consumer", label: "Consumer" },
                    ].map((option) => (
                      <FormItem key={option.value}>
                        <FormLabel
                          htmlFor={option.value}
                          className={`flex items-center justify-center rounded-lg p-4 border cursor-pointer transition-colors ${field.value === option.value
                            ? "bg-blue-50 border-blue-500 text-blue-700"
                            : "bg-gray-50 border-gray-200 hover:bg-gray-100"
                            }`}
                        >
                          <FormControl>
                            <RadioGroupItem
                              value={option.value}
                              id={option.value}
                              className="sr-only"
                            />
                          </FormControl>
                          <span className="text-base font-medium">{option.label}</span>
                        </FormLabel>
                      </FormItem>
                    ))}
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}
        <Button
          type="submit"
          className="w-full py-3 bg-black text-white font-bold rounded-md hover:bg-gold hover:text-black transform transition hover:scale-105" {...buttonProps}
        >
          {buttonProps?.children}
        </Button>
      </form>
    </Form>
  );
}

export default LoginForm;
