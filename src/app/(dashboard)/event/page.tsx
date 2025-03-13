import type { Metadata } from "next"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CalendarView } from "@/components/dashboard/events/calendar-view"
import { AvailabilitySettings } from "@/components/dashboard/events/availability-settings"
import { Button } from "@/components/ui/button"
import { CalendarCheck2 } from "lucide-react"
import { getUser } from "@/lib/get-user"
import { SyncEventsButton } from "@/components/dashboard/events/sync-events-button"

export const metadata: Metadata = {
  title: "Calendar",
  description: "Manage your meetings and availability",
}

export default async function EventPage() {
  const user = await getUser()
  const isConnected = !!user?.googleRefreshToken

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Calendar</h1>
          <p className="text-muted-foreground">Manage your meetings and availability</p>
        </div>

        <div className="flex gap-2">
            <Button asChild>
              <a href="/api/auth/google">
                <CalendarCheck2 className="mr-2 h-4 w-4" />
                {!isConnected ? "Connect Google Calendar" :  "Reconnect Google Calendar"}
              </a>
            </Button>
            <SyncEventsButton />
        </div>
      </div>

      {isConnected ? (
        <Tabs defaultValue="calendar">
          <TabsList>
            <TabsTrigger value="calendar">Calendar</TabsTrigger>
            <TabsTrigger value="availability">Availability</TabsTrigger>
          </TabsList>
          <TabsContent value="calendar" className="mt-6">
            <CalendarView />
          </TabsContent>
          <TabsContent value="availability" className="mt-6">
            <AvailabilitySettings />
          </TabsContent>
        </Tabs>
      ) : (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <CalendarCheck2 className="h-16 w-16 text-muted-foreground mb-4" />
          <h2 className="text-xl font-semibold mb-2">Connect Your Google Calendar</h2>
          <p className="text-muted-foreground max-w-md mb-6">
            Connect your Google Calendar to manage your meetings, schedule events, and set your availability.
          </p>
          <Button asChild>
            <a href="/api/auth/google">
              <CalendarCheck2 className="mr-2 h-4 w-4" />
              Connect Google Calendar
            </a>
          </Button>
        </div>
      )}
    </div>
  )
}

