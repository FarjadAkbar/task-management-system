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
      <div className="flex flex-col sm:flex-row items-center sm:items-start justify-between w-full gap-4">
        {/* Left Side - Heading */}
        <div className="text-center sm:text-left flex-1">
          <h1 className="text-2xl sm:text-3xl font-bold mb-2">Calendar</h1>
          <p className="text-muted-foreground text-sm sm:text-base mb-3">Manage your meetings and availability</p>
        </div>

        {/* Right Side - Buttons */}
        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto sm:justify-end sm:items-center">
          <Button asChild className="bg-black text-gold hover:text-black hover:bg-gold w-full sm:w-auto">
            <a href="/api/auth/google" className="flex items-center justify-center">
              <CalendarCheck2 className="mr-2 h-4 w-4" />
              {!isConnected ? "Connect Google Calendar" : "Reconnect Google Calendar"}
            </a>
          </Button>
          <SyncEventsButton />
        </div>
      </div>

      {isConnected ? (
        <Tabs defaultValue="calendar">
          <TabsList className="bg-black">
            <TabsTrigger value="calendar" className="text-gold px-4 py-2">Calendar</TabsTrigger>
            <TabsTrigger value="availability" className="text-gold px-4 py-2">Availability</TabsTrigger>
          </TabsList>
          <TabsContent value="calendar" className="mt-6">
            <CalendarView />
          </TabsContent>
          <TabsContent value="availability" className="mt-6">
            <AvailabilitySettings />
          </TabsContent>
        </Tabs>
      ) : (
        <div className="flex flex-col items-center justify-center py-12 text-center px-4">
          <CalendarCheck2 className="h-16 w-16 text-muted-foreground mb-4" />
          <h2 className="text-xl sm:text-2xl font-semibold mb-2">Connect Your Google Calendar</h2>
          <p className="text-muted-foreground max-w-md text-sm sm:text-base mb-6">
            Connect your Google Calendar to manage your meetings, schedule events, and set your availability.
          </p>
          <Button asChild className="w-full sm:w-auto">
            <a href="/api/auth/google" className="flex items-center justify-center">
              <CalendarCheck2 className="mr-2 h-4 w-4" />
              Connect Google Calendar
            </a>
          </Button>
        </div>
      )}
    </div>
  )
}

