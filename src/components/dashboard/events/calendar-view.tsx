"use client"

import { useState } from "react"
import FullCalendar from "@fullcalendar/react"
import dayGridPlugin from "@fullcalendar/daygrid"
import timeGridPlugin from "@fullcalendar/timegrid"
import interactionPlugin from "@fullcalendar/interaction"
import { Card } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import type { EventClickArg, DateSelectArg } from "@fullcalendar/core"
import { CreateEventDialog } from "./create-event-dialog"
import { ViewEventDialog } from "./view-event-dialog"
import { CalendarViewRangeType } from "@/service/events/type"
import { useEvents } from "@/service/events"

export function CalendarView() {
  const [viewRange, setViewRange] = useState<CalendarViewRangeType>({
    start: new Date(new Date().setDate(1)), // First day of current month
    end: new Date(new Date().setMonth(new Date().getMonth() + 1, 0)), // Last day of current month
  })

  const [selectedEventId, setSelectedEventId] = useState<string | null>(null)
  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const [selectedDates, setSelectedDates] = useState<DateSelectArg | null>(null)

  const { data: events, isLoading, isError } = useEvents(viewRange)

  // Handle date range change
  const handleDatesSet = (dateInfo: any) => {
    setViewRange({
      start: dateInfo.start,
      end: dateInfo.end,
    })
  }

  // Handle event click
  const handleEventClick = (clickInfo: EventClickArg) => {
    setSelectedEventId(clickInfo.event.id)
  }

  // Handle date select
  const handleDateSelect = (selectInfo: DateSelectArg) => {
    setSelectedDates(selectInfo)
    setShowCreateDialog(true)
  }

  // Format events for FullCalendar
  const formattedEvents =
    events?.map((event) => ({
      id: event.id,
      title: event.title,
      start: event.startTime,
      end: event.endTime,
      allDay: event.allDay,
      extendedProps: {
        description: event.description,
        location: event.location,
        meetingUrl: event.meetingRoom?.meetingUrl,
      },
    })) || []

  if (isLoading) {
    return (
      <Card className="p-4">
        <Skeleton className="h-[600px] w-full" />
      </Card>
    )
  }

  if (isError) {
    return (
      <Card className="p-4">
        <div className="flex items-center justify-center h-[600px]">
          <p className="text-destructive">Failed to load calendar events</p>
        </div>
      </Card>
    )
  }

  return (
    <>
      <Card className="p-4 w-full max-w-full overflow-x-auto">
        <FullCalendar
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          headerToolbar={{
            left: "prev,next today",
            center: "title",
            right: "dayGridMonth,timeGridWeek,timeGridDay",
          }}
          buttonText={{
            today: "Today",
            month: "Month",
            week: "Week",
            day: "Day",
          }}
          dayCellDidMount={(info) => {
            if (info.isToday) {
              info.el.classList.add("font-bold");
            }
          }}
          events={formattedEvents}
          eventClick={handleEventClick}
          select={handleDateSelect}
          selectable={true}
          selectMirror={true}
          dayMaxEvents={true}
          weekends={true}
          datesSet={handleDatesSet}
          height="auto"
          aspectRatio={1.8}
        />
      </Card>

      {selectedEventId && (
        <ViewEventDialog
          eventId={selectedEventId}
          open={!!selectedEventId}
          onOpenChange={(open) => {
            if (!open) setSelectedEventId(null)
          }}
        />
      )}

      {showCreateDialog && selectedDates && (
        <CreateEventDialog
          defaultValues={{
            startTime: selectedDates.start,
            endTime: selectedDates.end,
            allDay: selectedDates.allDay,
          }}
          open={showCreateDialog}
          onOpenChange={setShowCreateDialog}
        />
      )}
    </>
  )
}

