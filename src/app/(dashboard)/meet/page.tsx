"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { fetchUsersByRole } from "./actions/fetchUsers"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"

interface User {
  id: string
  name: string
  email: string
}

enum EventType{
    MEETING,
    CONFERENCE,
    WORKSHOP,
    WEBINAR,
    SOCIAL
}
enum RoleEnum{
    ADMIN,
    DEVELOPER,
    DESIGNER,
    MANAGER,
    MARKETER,
    LEAD
}
interface MeetingDetails {
  title: string
  description: string
  startTime: string
  endTime: string
  participants: string[]
  eventType: EventType
}

export default function ScheduleMeetingForm() {
  const router = useRouter()
  const [users, setUsers] = useState<User[]>([])
  const [meetingDetails, setMeetingDetails] = useState<MeetingDetails>({
    title: "",
    description: "",
    startTime: "",
    endTime: "",
    participants: [],
    eventType: EventType.MEETING,
  })

  const [selectedRole, setSelectedRole] = useState<RoleEnum | "ONE_ON_ONE">(RoleEnum.ADMIN)

  useEffect(() => {
    const fetchUsers = async () => {
      if (selectedRole !== "ONE_ON_ONE") {
        const usersData = await fetchUsersByRole(selectedRole)
        setUsers(usersData)
      }
    }

    fetchUsers()
  }, [selectedRole])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setMeetingDetails((prev) => ({ ...prev, [name]: value }))
  }

  const handleRoleChange = (value: string) => {
    setSelectedRole(value as RoleEnum | "ONE_ON_ONE")
  }

  const handleParticipantChange = (userId: string, checked: boolean) => {
    setMeetingDetails((prev) => ({
      ...prev,
      participants: checked ? [...prev.participants, userId] : prev.participants.filter((id) => id !== userId),
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const response = await fetch("/api/schedule-meeting", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...meetingDetails,
        meetingType: selectedRole === "ONE_ON_ONE" ? "individual" : "role",
        role: selectedRole === "ONE_ON_ONE" ? undefined : selectedRole,
      }),
    })

    const data = await response.json()
    if (response.ok) {
      router.push(`/events/${data.id}`)
    } else {
      alert("Error creating event: " + data.error)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <Label htmlFor="title">Meeting Title</Label>
        <Input id="title" name="title" value={meetingDetails.title} onChange={handleChange} required />
      </div>
      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea id="description" name="description" value={meetingDetails.description} onChange={handleChange} />
      </div>
      <div>
        <Label htmlFor="startTime">Start Time</Label>
        <Input
          type="datetime-local"
          id="startTime"
          name="startTime"
          value={meetingDetails.startTime}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <Label htmlFor="endTime">End Time</Label>
        <Input
          type="datetime-local"
          id="endTime"
          name="endTime"
          value={meetingDetails.endTime}
          onChange={handleChange}
          required
        />
      </div>

      <div>
        <Label htmlFor="role">Role-based or One-on-One</Label>
        <Select onValueChange={handleRoleChange} value={selectedRole}>
          <SelectTrigger>
            <SelectValue placeholder="Select meeting type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ONE_ON_ONE">One-on-One</SelectItem>
            {Object.values(RoleEnum).map((role) => (
              <SelectItem key={role} value={role}>
                {role}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {selectedRole !== "ONE_ON_ONE" && (
        <div>
          <Label>Select Participants</Label>
          <div className="space-y-2">
            {users.map((user) => (
              <div key={user.id} className="flex items-center space-x-2">
                <Checkbox
                  id={`user-${user.id}`}
                  onCheckedChange={(checked) => handleParticipantChange(user.id, checked as boolean)}
                  checked={meetingDetails.participants.includes(user.id)}
                />
                <Label htmlFor={`user-${user.id}`}>{user.name}</Label>
              </div>
            ))}
          </div>
        </div>
      )}

      {selectedRole === "ONE_ON_ONE" && (
        <div>
          <Label htmlFor="participant">Choose a Participant</Label>
          <Select
            onValueChange={(value) => setMeetingDetails((prev) => ({ ...prev, participants: [value] }))}
            value={meetingDetails.participants[0] || ""}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select user" />
            </SelectTrigger>
            <SelectContent>
              {users.map((user) => (
                <SelectItem key={user.id} value={user.id}>
                  {user.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      <Button type="submit">Schedule Meeting</Button>
    </form>
  )
}

