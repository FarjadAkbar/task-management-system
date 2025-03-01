"use client"

import React from "react"
import dynamic from "next/dynamic"
import { Card } from "@/components/ui/card"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { ViewEvent } from "./ViewEvent"
import { fromUnixTime } from "date-fns"
import type { IEventProps } from "@/types/event"
import { CalendarSkeleton } from "./CalendarSkeleton"
import dayGridPlugin from "@fullcalendar/daygrid"
import timeGridPlugin from "@fullcalendar/timegrid"
import interactionPlugin from "@fullcalendar/interaction"

// Dynamically import only the FullCalendar component
// Move the dynamic import to a separate variable
const FullCalendarComponent = dynamic(
  () =>
    import("@fullcalendar/react").then((mod) => {
      return { default: mod.default }
    }),
  {
    ssr: false,
    loading: () => <CalendarSkeleton />,
  },
)

interface CalendarViewProps {
  events: IEventProps[]
}

export function CalendarView({ events }: CalendarViewProps) {
  const [selectedEvent, setSelectedEvent] = React.useState<IEventProps | null>(null)

  // Memoize calendar events transformation
  const calendarEvents = React.useMemo(
    () =>
      events.map((event) => ({
        id: event.id,
        title: event.title,
        start: fromUnixTime(event.when.startTime),
        end: fromUnixTime(event.when.endTime),
        extendedProps: event,
      })),
    [events],
  )

  const handleEventClick = React.useCallback((info: any) => {
    setSelectedEvent(info.event.extendedProps)
  }, [])

  return (
    <Card className="p-4">
      <FullCalendarComponent
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView="timeGridWeek"
        headerToolbar={{
          left: "prev,next today",
          center: "title",
          right: "dayGridMonth,timeGridWeek,timeGridDay",
        }}
        events={calendarEvents}
        eventClick={handleEventClick}
        height="auto"
        slotMinTime="09:00:00"
        slotMaxTime="17:00:00"
        allDaySlot={false}
        slotDuration="00:15:00"
        expandRows={true}
        stickyHeaderDates={true}
        dayMaxEvents={true}
        eventTimeFormat={{
          hour: "numeric",
          minute: "2-digit",
          meridiem: "short",
        }}
        slotLabelFormat={{
          hour: "numeric",
          minute: "2-digit",
          meridiem: "short",
        }}
        nowIndicator={true}
        selectMirror={true}
        businessHours={{
          daysOfWeek: [1, 2, 3, 4, 5],
          startTime: "09:00",
          endTime: "17:00",
        }}
      />

      <Dialog open={!!selectedEvent} onOpenChange={() => setSelectedEvent(null)}>
        <DialogContent className="max-w-3xl">{selectedEvent && <ViewEvent event={selectedEvent} />}</DialogContent>
      </Dialog>
    </Card>
  )
}

