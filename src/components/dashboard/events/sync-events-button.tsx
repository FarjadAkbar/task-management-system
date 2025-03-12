"use client"
import { Button } from "@/components/ui/button"
import { toast } from "@/hooks/use-toast"
import { useSyncEvents } from "@/service/events"
import { RefreshCw } from "lucide-react"

export function SyncEventsButton() {
  const { mutate: syncEvents, isPending } = useSyncEvents()

  const handleSync = () => {
    syncEvents(undefined, {
      onSuccess: () => {
        toast({
          title: "Calendar synced",
          description: "Your calendar has been synced with Google Calendar",
        })
      },
      onError: () => {
        toast({
          title: "Sync failed",
          description: "Failed to sync with Google Calendar",
          variant: "destructive",
        })
      },
    })
  }

  return (
    <Button onClick={handleSync} disabled={isPending} variant="outline">
      <RefreshCw className={`mr-2 h-4 w-4 ${isPending ? "animate-spin" : ""}`} />
      {isPending ? "Syncing..." : "Sync Calendar"}
    </Button>
  )
}

