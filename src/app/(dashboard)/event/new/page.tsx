"use client"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import Link from "next/link"
import { z } from "zod"
import axios from "axios"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { useToast } from "@/hooks/use-toast"

const eventTypeSchema = z.object({
  title: z.string().min(1, "Title is required"),
  url: z.string().min(1, "URL is required"),
  description: z.string().optional(),
  duration: z.enum(["15", "30", "45", "60"]),
  videoCallSoftware: z.enum(["Google Meet"]),
})

type EventTypeSchema = z.infer<typeof eventTypeSchema>

const CreateNewEvent = () => {
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<EventTypeSchema>({
    resolver: zodResolver(eventTypeSchema),
    defaultValues: {
      title: "",
      url: "",
      description: "",
      duration: "30",
      videoCallSoftware: "Google Meet",
    },
  })

  const onSubmit = async (data: EventTypeSchema) => {
    setIsSubmitting(true)
    try {
      await axios.post("/api/events", data)
      toast({
        title: "Event created",
        description: "Your new event type has been created successfully.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "An error occurred while creating the event",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Add new appointment type</h1>
        <p className="text-muted-foreground mb-8">Create a new appointment type that allows people to book times.</p>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input placeholder="30 min meeting" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="url"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>URL Slug</FormLabel>
                    <FormControl>
                      <div className="flex rounded-md">
                        <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-input bg-muted text-muted-foreground text-sm">
                          CalMarshal.com/
                        </span>
                        <Input placeholder="example-user-1" className="rounded-l-none" {...field} />
                      </div>
                    </FormControl>
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
                    <Textarea placeholder="Describe your event type" className="h-32" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="duration"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Duration</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select the duration" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="15">15 Mins</SelectItem>
                        <SelectItem value="30">30 Min</SelectItem>
                        <SelectItem value="45">45 Mins</SelectItem>
                        <SelectItem value="60">1 Hour</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="videoCallSoftware"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Video Call Provider</FormLabel>
                    <FormControl>
                      <ToggleGroup
                        type="single"
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="justify-start"
                      >
                        <ToggleGroupItem value="Google Meet" className="w-full md:w-auto">
                          Google Meet
                        </ToggleGroupItem>
                      </ToggleGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex justify-end space-x-4 mt-8">
              <Button variant="outline" asChild>
                <Link href="/dashboard">Cancel</Link>
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Creating..." : "Create Event Type"}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  )
}


export default CreateNewEvent

