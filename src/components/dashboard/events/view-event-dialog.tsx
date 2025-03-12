"use client"

import { useState } from "react"
import { format } from "date-fns"
import { CalendarIcon, MapPin, Video, ExternalLink, Edit, Trash } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { EditEventDialog } from "./edit-event-dialog"
import { useDeleteEvent, useEvent } from "@/service/events"
import { toast } from "@/hooks/use-toast"

interface ViewEventDialogProps {
  eventId: string
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ViewEventDialog({ eventId, open, onOpenChange }: ViewEventDialogProps) {
  const { data: event, isLoading, isError } = useEvent(eventId)
  const { mutate: deleteEvent, isPending: isDeleting } = useDeleteEvent()
  const [showEditDialog, setShowEditDialog] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)

  const handleDelete = () => {
    deleteEvent(eventId, {
      onSuccess: () => {
        toast({
          title: "Event deleted",
          description: "Your event has been deleted successfully",
        })
        onOpenChange(false)
      },
      onError: (error) => {
        toast({
          title: "Failed to delete event",
          description: error.message,
          variant: "destructive",
        })
      },
    })
  }

  if (isLoading) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent>
          <DialogHeader>
            <Skeleton className="h-8 w-3/4" />
          </DialogHeader>
          <div className="space-y-4">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  if (isError || !event) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Error</DialogTitle>
            <DialogDescription>Failed to load event details. Please try again.</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button onClick={() => onOpenChange(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[550px]">
          <DialogHeader>
            <DialogTitle>{event.title}</DialogTitle>
            {event.description && <DialogDescription>{event.description}</DialogDescription>}
          </DialogHeader>

          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <CalendarIcon className="h-4 w-4 text-muted-foreground" />
              <span>
                {event.allDay ? (
                  format(new Date(event.startTime), "EEEE, MMMM d, yyyy")
                ) : (
                  <>
                    {format(new Date(event.startTime), "EEEE, MMMM d, yyyy")}
                    {" · "}
                    {format(new Date(event.startTime), "h:mm a")} - {format(new Date(event.endTime), "h:mm a")}
                  </>
                )}
              </span>
            </div>

            {event.location && (
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <span>{event.location}</span>
              </div>
            )}

            {event.meetingRoom && (
              <div className="flex items-center gap-2">
                <Video className="h-4 w-4 text-muted-foreground" />
                <span>Google Meet</span>
                <a
                  href={event.meetingRoom.meetingUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="ml-auto inline-flex items-center gap-1 text-sm text-primary hover:underline"
                >
                  Join meeting <ExternalLink className="h-3 w-3" />
                </a>
              </div>
            )}

            {event.attendees.length > 0 && (
              <>
                <Separator />
                <div>
                  <h4 className="mb-2 text-sm font-medium">Attendees</h4>
                  <div className="space-y-2">
                    {event.attendees.map((attendee) => (
                      <div key={attendee.id} className="flex items-center gap-2">
                        <Avatar className="h-6 w-6">
                          <AvatarFallback>{attendee.name?.[0] || attendee.email[0]}</AvatarFallback>
                        </Avatar>
                        <span className="text-sm">{attendee.name || attendee.email}</span>
                        <Badge
                          variant={
                            attendee.responseStatus === "ACCEPTED"
                              ? "default"
                              : attendee.responseStatus === "TENTATIVE"
                                ? "outline"
                                : attendee.responseStatus === "DECLINED"
                                  ? "destructive"
                                  : "secondary"
                          }
                          className="ml-auto text-xs"
                        >
                          {attendee.responseStatus === "ACCEPTED"
                            ? "Going"
                            : attendee.responseStatus === "TENTATIVE"
                              ? "Maybe"
                              : attendee.responseStatus === "DECLINED"
                                ? "Declined"
                                : "Pending"}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>

          <DialogFooter>
            <div className="flex w-full justify-between">
              <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive" disabled={isDeleting}>
                    <Trash className="mr-2 h-4 w-4" />
                    Delete
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Delete Event</AlertDialogTitle>
                    <AlertDialogDescription>
                      Are you sure you want to delete this event? This action cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleDelete} disabled={isDeleting}>
                      {isDeleting ? "Deleting..." : "Delete"}
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>

              <div className="flex gap-2">
                <Button variant="outline" onClick={() => onOpenChange(false)}>
                  Close
                </Button>
                <Button onClick={() => setShowEditDialog(true)}>
                  <Edit className="mr-2 h-4 w-4" />
                  Edit
                </Button>
              </div>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {showEditDialog && (
        <EditEventDialog
          eventId={eventId}
          open={showEditDialog}
          onOpenChange={(open) => {
            setShowEditDialog(open)
            if (!open) {
              // Refresh the event data when edit dialog is closed
              // This is handled automatically by React Query
            }
          }}
        />
      )}
    </>
  )
}

