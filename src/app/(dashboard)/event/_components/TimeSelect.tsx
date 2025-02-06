import type React from "react"
import { Button } from "@/components/ui/button"

interface TimeSelectProps {
  selectedTime: string
  onChange: (time: string) => void
  duration: number
}

const generateTimeSlots = (duration: number) => {
  const slots = []
  const start = 9 * 60 // 9:00 AM in minutes
  const end = 17 * 60 + 30 // 5:30 PM in minutes

  for (let i = start; i <= end; i += duration) {
    const hours = Math.floor(i / 60)
    const minutes = i % 60
    slots.push(`${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}`)
  }

  return slots
}

export const TimeSelect: React.FC<TimeSelectProps> = ({ selectedTime, onChange, duration }) => {
  const timeSlots = generateTimeSlots(duration)

  return (
    <div className="grid grid-cols-3 gap-2">
      {timeSlots.map((time) => (
        <Button
          key={time}
          type="button"
          variant={selectedTime === time ? "default" : "outline"}
          onClick={() => onChange(time)}
          className="w-full"
        >
          {time}
        </Button>
      ))}
    </div>
  )
}

