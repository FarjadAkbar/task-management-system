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
import { useRouter } from "next/navigation"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import Link from "next/link"
import { CancelEventFormProps } from "@/types/cancel-event"

const formSchema = z.object({
  eventId: z.string(),
})



export function CancelEventForm({ item }: CancelEventFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [showCancelConfirmation, setShowCancelConfirmation] = useState(false)
  const { toast } = useToast()
  const router = useRouter()

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
      setShowCancelConfirmation(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="grid grid-cols-5 justify-between items-center">
          <div className="col-span-2">
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
          <div className="col-span-2 flex justify-end space-x-2">
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="secondary">View</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>{item.title}</DialogTitle>
                </DialogHeader>
                <div className="mt-4">
                  <p>
                    <strong>Date:</strong> {format(fromUnixTime(item.when.startTime), "EEEE, MMMM d, yyyy")}
                  </p>
                  <p>
                    <strong>Time:</strong> {format(fromUnixTime(item.when.startTime), "h:mm a")} -{" "}
                    {format(fromUnixTime(item.when.endTime), "h:mm a")}
                  </p>
                  <p>
                    <strong>Participants:</strong> You and {item.participants[0].name}
                  </p>
                  <p>
                    <strong>Meeting Link:</strong>{" "}
                    <a
                      href={item.conferencing.details.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary underline"
                    >
                      {item.conferencing.details.url}
                    </a>
                  </p>
                </div>
              </DialogContent>
            </Dialog>
            <Button type="button" asChild>
              <Link href={`/event/${item.metadata.eventId}`}>Edit</Link>
            </Button>
            <FormField
              control={form.control}
              name="eventId"
              render={() => (
                <FormItem>
                  <FormControl>
                    <Dialog open={showCancelConfirmation} onOpenChange={setShowCancelConfirmation}>
                      <DialogTrigger asChild>
                        <Button variant="destructive">Cancel Event</Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Cancel Event</DialogTitle>
                          <DialogDescription>
                            Are you sure you want to cancel this event? This action cannot be undone.
                          </DialogDescription>
                        </DialogHeader>
                        <DialogFooter>
                          <Button variant="outline" onClick={() => setShowCancelConfirmation(false)}>
                            No, keep event
                          </Button>
                          <Button
                            type="submit"
                            variant="destructive"
                            disabled={isLoading}
                            onClick={form.handleSubmit(onSubmit)}
                          >
                            {isLoading ? "Cancelling..." : "Yes, cancel event"}
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </FormControl>
                </FormItem>
              )}
            />
          </div>
        </div>
        <Separator className="my-3" />
      </form>
    </Form>
  )
}

