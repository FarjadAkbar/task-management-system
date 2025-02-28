"use client"

import React from "react"
import FullCalendar from "@fullcalendar/react"
import dayGridPlugin from "@fullcalendar/daygrid"
import timeGridPlugin from "@fullcalendar/timegrid"
import interactionPlugin from "@fullcalendar/interaction"
import { Card } from "@/components/ui/card"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { ViewEvent } from "./ViewEvent"
import { fromUnixTime } from "date-fns"
import { IEventProps } from "@/types/event";

interface CalendarViewProps {
  events: IEventProps[]
}

export function CalendarView({ events }: CalendarViewProps) {
  const [selectedEvent, setSelectedEvent] = React.useState<IEventProps | null>(null)

  // Transform events for FullCalendar
  const calendarEvents = events.map((event) => ({
    id: event.id,
    title: event.title,
    start: fromUnixTime(event.when.startTime),
    end: fromUnixTime(event.when.endTime),
    extendedProps: event,
  }))

  const handleEventClick = (info: any) => {
    setSelectedEvent(info.event.extendedProps)
  }

  return (
    <Card className="p-4">
      <FullCalendar
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
          daysOfWeek: [1, 2, 3, 4, 5], // Monday - Friday
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

