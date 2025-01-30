"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { RoleEnum, EventType } from "@prisma/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import UserSearch from "./UserSearch"

export default function MeetingSchedulerForm() {
  const { register, handleSubmit, watch, setValue } = useForm()
  const [isLoading, setIsLoading] = useState(false)
  const [selectedUser, setSelectedUser] = useState(null)

  const meetingType = watch("meetingType")

  const onSubmit = async (data) => {
    setIsLoading(true)
    try {
      const response = await fetch("/api/schedule-meeting", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...data,
          selectedUserId: selectedUser?.id,
        }),
      })
      if (response.ok) {
        // Handle success (e.g., show a success message, reset form)
        console.log("Meeting scheduled successfully")
      } else {
        // Handle error
        console.error("Failed to schedule meeting")
      }
    } catch (error) {
      console.error("Error scheduling meeting:", error)
    }
    setIsLoading(false)
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div>
        <Label>Meeting Type</Label>
        <RadioGroup defaultValue="role" onValueChange={(value) => setValue("meetingType", value)}>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="role" id="role" />
            <Label htmlFor="role">Role-based</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="individual" id="individual" />
            <Label htmlFor="individual">One-on-one</Label>
          </div>
        </RadioGroup>
      </div>

      {meetingType === "role" && (
        <Select onValueChange={(value) => setValue("role", value)}>
          <SelectTrigger>
            <SelectValue placeholder="Select a role" />
          </SelectTrigger>
          <SelectContent>
            {Object.values(RoleEnum).map((role) => (
              <SelectItem key={role} value={role}>
                {role}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}

      {meetingType === "individual" && <UserSearch onSelectUser={(user) => setSelectedUser(user)} />}

      <Input {...register("title", { required: true })} placeholder="Meeting Title" />

      <Textarea {...register("description")} placeholder="Meeting Description" />

      <Select onValueChange={(value) => setValue("eventType", value)}>
        <SelectTrigger>
          <SelectValue placeholder="Select event type" />
        </SelectTrigger>
        <SelectContent>
          {Object.values(EventType).map((type) => (
            <SelectItem key={type} value={type}>
              {type}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Input {...register("startTime", { required: true })} type="datetime-local" />

      <Input {...register("endTime", { required: true })} type="datetime-local" />

      <Button type="submit" disabled={isLoading}>
        {isLoading ? "Scheduling..." : "Schedule Meeting"}
      </Button>
    </form>
  )
}

