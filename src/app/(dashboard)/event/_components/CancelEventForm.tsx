"use client"

import { useState } from "react"
import { format, fromUnixTime } from "date-fns"
import { Video } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"

const formSchema = z.object({
  eventId: z.string(),
})

interface CancelEventFormProps {
  item: {
    id: string
    title: string
    when: {
      startTime: number
      endTime: number
    }
    conferencing: {
      details: {
        url: string
      }
    }
    participants: {
      name: string
    }[]
  }
}

export function CancelEventForm({ item }: CancelEventFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      eventId: item.id,
    },
  })

  async function onSubmit(data: z.infer<typeof formSchema>) {
    try {
      setIsLoading(true)

      const response = await fetch("/api/events/cancel", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || "Failed to cancel event")
      }

      toast({
        title: "Event Cancelled",
        description: "The event has been successfully cancelled.",
      })

      // Optionally refresh the page or update the UI
      window.location.reload()
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to cancel event",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="grid grid-cols-3 justify-between items-center">
          <div>
            <p className="text-muted-foreground text-sm">{format(fromUnixTime(item.when.startTime), "EEE, dd MMM")}</p>
            <p className="text-muted-foreground text-xs pt-1">
              {format(fromUnixTime(item.when.startTime), "hh:mm a")} -{" "}
              {format(fromUnixTime(item.when.endTime), "hh:mm a")}
            </p>
            <div className="flex items-center mt-1">
              <Video className="size-4 mr-2 text-primary" />
              <a
                className="text-xs text-primary underline underline-offset-4"
                target="_blank"
                href={item.conferencing.details.url}
                rel="noopener noreferrer"
              >
                Join Meeting
              </a>
            </div>
          </div>
          <div className="flex flex-col items-start">
            <h2 className="text-sm font-medium">{item.title}</h2>
            <p className="text-sm text-muted-foreground">You and {item.participants[0].name}</p>
          </div>
          <FormField
            control={form.control}
            name="eventId"
            render={() => (
              <FormItem>
                <FormControl>
                  <Button type="submit" variant="destructive" disabled={isLoading}>
                    {isLoading ? "Cancelling..." : "Cancel"}
                  </Button>
                </FormControl>
              </FormItem>
            )}
          />
        </div>
        <Separator className="my-3" />
      </form>
    </Form>
  )
}

