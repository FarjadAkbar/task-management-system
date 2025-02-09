"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import Link from "next/link"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { X } from "lucide-react"
import axios from "axios"
import { DatePicker } from "@/components/ui/date-picker"
import { TimeSelect } from "./TimeSelect"
import { useRouter } from "next/navigation"


const eventTypeSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  duration: z.enum(["15", "30", "45", "60"]),
  participants: z.array(z.string()).min(1, "At least one participant must be selected"),
  eventDate: z.date({ required_error: "Please select a date" }),
  eventTime: z.string({ required_error: "Please select a time slot" }),
})

type EventTypeSchema = z.infer<typeof eventTypeSchema>

interface EventFormProps {
  employees: any[]
  eventData?: EventTypeSchema
  isEditMode: boolean
  nylasEventId?: nylasEventId;
}

export const EventForm: React.FC<EventFormProps> = ({ employees, eventData, isEditMode, nylasEventId }) => {
  const router = useRouter()
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<EventTypeSchema>({
    resolver: zodResolver(eventTypeSchema),
    defaultValues: eventData ? {
      title: eventData.title,
      description: eventData.description,
      duration: (eventData.duration.toString() as "15" | "30" | "45" | "60") ?? "30",
      participants: eventData.participants.map((participant) => participant.userId),
      eventDate: eventData.eventDate, // Ensure it's a Date object
      eventTime: eventData.eventTime,
    } : {
      title: "",
      description: "",
      duration: "30",
      participants: [],
      eventDate: undefined,
      eventTime: "",
    },
  })

  const onSubmit = async (data: EventTypeSchema) => {
    setIsSubmitting(true)
    try {
      const url = isEditMode ? `/api/events/update/${eventData?.id}` : "/api/events/create"
      const method = isEditMode ? "put" : "post"
      const postData = nylasEventId ? { ...data, nylasEventId } : data;
      const response = await axios[method](url, postData)
      if (response.status === 200 || response.status === 201) {
        toast({
          title: isEditMode ? "Event Updated" : "Event Created",
          description: isEditMode
            ? "Your event type has been updated successfully."
            : "Your new event type has been created successfully.",
        })
        router.push("/event")
      } else {
        toast({
          title: "Unexpected Response",
          description: "The server returned an unexpected status code.",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description:
          error instanceof Error
            ? error.message
            : `An error occurred while ${isEditMode ? "updating" : "creating"} the event`,
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardContent className="p-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Event Title</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter event title" {...field} />
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
                    <Textarea placeholder="Enter event description" {...field} />
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
                        <SelectValue placeholder="Select employees" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {employees.map((employee: any) => (
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
                            className="ml-2 h-auto p-0 text-muted-foreground"
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

            <FormField
              control={form.control}
              name="eventDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Event Date</FormLabel>
                  <FormControl>
                    <DatePicker selected={field.value} onSelect={(date) => field.onChange(date)} />
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
                      onChange={(time) => field.onChange(time)}
                      duration={Number.parseInt(form.watch("duration"))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end space-x-4 mt-8">
              <Button variant="outline" asChild>
                <Link href="/event">Cancel</Link>
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting
                  ? isEditMode
                    ? "Updating..."
                    : "Creating..."
                  : isEditMode
                    ? "Update Event Type"
                    : "Create Event Type"}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}


