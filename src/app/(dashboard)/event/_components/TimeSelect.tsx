"use client"

import * as React from "react"
import { Clock } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface TimeSelectProps {
  selectedTime: string
  onChange: (time: string) => void
  duration: number
}

export function TimeSelect({ selectedTime, onChange, duration }: TimeSelectProps) {
  // Generate time slots from 9 AM to 5 PM
  const timeSlots = React.useMemo(() => {
    const slots = []
    const startHour = 9
    const endHour = 17
    const interval = duration

    for (let hour = startHour; hour < endHour; hour++) {
      for (let minute = 0; minute < 60; minute += interval) {
        const time = `${hour.toString().padStart(2, "0")}:${minute.toString().padStart(2, "0")}`
        slots.push(time)
      }
    }
    return slots
  }, [duration])

  return (
    <Select value={selectedTime} onValueChange={onChange}>
      <SelectTrigger className="w-full">
        <SelectValue placeholder="Select a time slot">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            <span>{selectedTime || "Select time"}</span>
          </div>
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        {timeSlots.map((time) => (
          <SelectItem key={time} value={time}>
            {time}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}

