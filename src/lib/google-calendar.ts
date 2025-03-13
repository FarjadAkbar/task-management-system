import { google, type calendar_v3 } from "googleapis"
import { getAuthenticatedClient, getPrimaryCalendarId } from "./google-auth"
import { prismadb } from "@/lib/prisma"
import { CreateEventInputType, EventWithRelationsType, UpdateEventInputType } from "@/service/events/type"

// Convert our event to Google Calendar event format
function toGoogleEvent(event: CreateEventInputType): calendar_v3.Schema$Event {
  const googleEvent: calendar_v3.Schema$Event = {
    summary: event.title,
    description: event.description,
    location: event.location,
    start: {
      dateTime: event.allDay ? undefined : event.startTime.toISOString(),
      date: event.allDay ? event.startTime.toISOString().split("T")[0] : undefined,
      timeZone: "UTC",
    },
    end: {
      dateTime: event.allDay ? undefined : event.endTime.toISOString(),
      date: event.allDay ? event.endTime.toISOString().split("T")[0] : undefined,
      timeZone: "UTC",
    },
    recurrence: event.recurrence,
  }

  if (event.attendees && event.attendees.length > 0) {
    googleEvent.attendees = event.attendees.map((attendee) => ({
      email: attendee.email,
      displayName: attendee.name,
      optional: attendee.optional,
    }))
  }

  if (event.createMeeting) {
    googleEvent.conferenceData = {
      createRequest: {
        requestId: `meeting-${Date.now()}`,
        conferenceSolutionKey: {
          type: "hangoutsMeet",
        },
      },
    }
  }

  return googleEvent
}

// Create a new event in Google Calendar and our database
export async function createEvent(userId: string, eventData: CreateEventInputType): Promise<EventWithRelationsType> {
  const auth = await getAuthenticatedClient(userId)
  const calendar = google.calendar({ version: "v3", auth })

  // Get primary calendar ID if not already stored
  const user = await prismadb.users.findUnique({
    where: { id: userId },
    select: { googleCalendarId: true },
  })

  let calendarId = user?.googleCalendarId
  if (!calendarId) {
    calendarId = await getPrimaryCalendarId(userId)
    await prismadb.users.update({
      where: { id: userId },
      data: { googleCalendarId: calendarId },
    })
  }

  // Create event in Google Calendar
  const googleEvent = toGoogleEvent(eventData)
  const response = await calendar.events.insert({
    calendarId,
    requestBody: googleEvent,
    conferenceDataVersion: eventData.createMeeting ? 1 : 0,
    sendUpdates: "all",
  })

  if (!response.data.id) {
    throw new Error("Failed to create event in Google Calendar")
  }

  // Create event in our database
  const newEvent = await prismadb.calendarEvent.create({
    data: {
      title: eventData.title,
      description: eventData.description || "",
      startTime: eventData.startTime,
      endTime: eventData.endTime,
      allDay: eventData.allDay || false,
      location: eventData.location,
      googleEventId: response.data.id,
      googleCalendarId: calendarId,
      recurrence: eventData.recurrence?.join("\n"),
      creatorId: userId,
      attendees: {
        create:
          eventData.attendees?.map((attendee) => ({
            email: attendee.email,
            name: attendee.name,
            optional: attendee.optional || false,
          })) || [],
      },
    },
    include: {
      attendees: true,
      meetingRoom: true,
    },
  })

  // If a meeting was created, store the meeting details
  if (eventData.createMeeting && response.data.conferenceData?.conferenceId) {
    const meetingUrl = response.data.conferenceData.entryPoints?.find((entry) => entry.entryPointType === "video")?.uri

    if (meetingUrl) {
      await prismadb.meetingRoom.create({
        data: {
          meetingCode: response.data.conferenceData.conferenceId,
          meetingUrl: meetingUrl,
          joinUrl: meetingUrl,
          eventId: newEvent.id,
          creatorId: userId,
        },
      })

      // Fetch the event again with the meeting room
      return (await prismadb.calendarEvent.findUnique({
        where: { id: newEvent.id },
        include: {
          attendees: true,
          meetingRoom: true,
        },
      })) as EventWithRelationsType
    }
  }

  return newEvent
}

// Update an existing event
export async function updateEvent(userId: string, eventData: UpdateEventInputType): Promise<EventWithRelationsType> {
  const event = await prismadb.calendarEvent.findUnique({
    where: { id: eventData.id },
    include: { attendees: true },
  })

  if (!event) {
    throw new Error("Event not found")
  }

  if (event.creatorId !== userId) {
    throw new Error("Not authorized to update this event")
  }

  const auth = await getAuthenticatedClient(userId)
  const calendar = google.calendar({ version: "v3", auth })

  // Update in Google Calendar
  if (event.googleEventId && event.googleCalendarId) {
    const googleEvent: calendar_v3.Schema$Event = {
      summary: eventData.title,
      description: eventData.description,
      location: eventData.location,
    }

    if (eventData.startTime) {
      googleEvent.start = {
        dateTime: eventData.allDay ? undefined : eventData.startTime.toISOString(),
        date: eventData.allDay ? eventData.startTime.toISOString().split("T")[0] : undefined,
        timeZone: "UTC",
      }
    }

    if (eventData.endTime) {
      googleEvent.end = {
        dateTime: eventData.allDay ? undefined : eventData.endTime.toISOString(),
        date: eventData.allDay ? eventData.endTime.toISOString().split("T")[0] : undefined,
        timeZone: "UTC",
      }
    }

    if (eventData.recurrence) {
      googleEvent.recurrence = eventData.recurrence
    }

    if (eventData.attendees) {
      googleEvent.attendees = eventData.attendees.map((attendee) => ({
        email: attendee.email,
        displayName: attendee.name,
        optional: attendee.optional,
      }))
    }

    await calendar.events.update({
      calendarId: event.googleCalendarId,
      eventId: event.googleEventId,
      requestBody: googleEvent,
      sendUpdates: "all",
    })
  }

  // Update in our database
  const updateData: any = {}
  if (eventData.title) updateData.title = eventData.title
  if (eventData.description !== undefined) updateData.description = eventData.description
  if (eventData.startTime) updateData.startTime = eventData.startTime
  if (eventData.endTime) updateData.endTime = eventData.endTime
  if (eventData.allDay !== undefined) updateData.allDay = eventData.allDay
  if (eventData.location !== undefined) updateData.location = eventData.location
  if (eventData.recurrence) updateData.recurrence = eventData.recurrence.join("\n")

  const updatedEvent = await prismadb.calendarEvent.update({
    where: { id: eventData.id },
    data: updateData,
    include: {
      attendees: true,
      meetingRoom: true,
    },
  })

  // Update attendees if provided
  if (eventData.attendees) {
    // Delete existing attendees
    await prismadb.eventAttendee.deleteMany({
      where: { eventId: eventData.id },
    })

    // Create new attendees
    await Promise.all(
      eventData.attendees.map((attendee) =>
        prismadb.eventAttendee.create({
          data: {
            email: attendee.email,
            name: attendee.name,
            optional: attendee.optional || false,
            eventId: eventData.id,
          },
        }),
      ),
    )

    // Fetch updated event with new attendees
    return (await prismadb.calendarEvent.findUnique({
      where: { id: eventData.id },
      include: {
        attendees: true,
        meetingRoom: true,
      },
    })) as EventWithRelationsType
  }

  return updatedEvent
}

// Delete an event
export async function deleteEvent(userId: string, eventId: string): Promise<void> {
  const event = await prismadb.calendarEvent.findUnique({
    where: { id: eventId },
  })

  if (!event) {
    throw new Error("Event not found")
  }

  if (event.creatorId !== userId) {
    throw new Error("Not authorized to delete this event")
  }

  // Delete from Google Calendar
  if (event.googleEventId && event.googleCalendarId) {
    const auth = await getAuthenticatedClient(userId)
    const calendar = google.calendar({ version: "v3", auth })

    await calendar.events.delete({
      calendarId: event.googleCalendarId,
      eventId: event.googleEventId,
      sendUpdates: "all",
    })
  }

  // Delete from our database
  await prismadb.calendarEvent.delete({
    where: { id: eventId },
  })
}

// Get a single event
export async function getEvent(userId: string, eventId: string): Promise<EventWithRelationsType | null> {
  const event = await prismadb.calendarEvent.findUnique({
    where: { id: eventId },
    include: {
      attendees: true,
      meetingRoom: true,
    },
  })

  if (!event) return null

  // Check if user is creator or attendee
  const isCreator = event.creatorId === userId
  const isAttendee = event.attendees.some((attendee) => attendee.userId === userId)

  if (!isCreator && !isAttendee) {
    throw new Error("Not authorized to view this event")
  }

  return event
}

// Get all events for a user (both created and attending)
export async function getUserEvents(userId: string, start?: Date, end?: Date): Promise<EventWithRelationsType[]> {
  const where: any = {
    OR: [{ creatorId: userId }, { attendees: { some: { userId } } }],
  }

  if (start || end) {
    where.AND = []
    if (start) where.AND.push({ startTime: { gte: start } })
    if (end) where.AND.push({ startTime: { lte: end } })
  }

  return prismadb.calendarEvent.findMany({
    where,
    include: {
      attendees: true,
      meetingRoom: true,
    },
    orderBy: { startTime: "asc" },
  })
}

// Sync events from Google Calendar
export async function syncEventsFromGoogle(userId: string): Promise<void> {
  const auth = await getAuthenticatedClient(userId)
  const calendar = google.calendar({ version: "v3", auth })

  const user = await prismadb.users.findUnique({
    where: { id: userId },
    select: { googleCalendarId: true },
  })

  if (!user?.googleCalendarId) {
    throw new Error("Google Calendar ID not found for user")
  }

  // Get events from Google Calendar
  const now = new Date()
  const oneMonthAgo = new Date(now)
  oneMonthAgo.setMonth(now.getMonth() - 1)

  const oneYearFromNow = new Date(now)
  oneYearFromNow.setFullYear(now.getFullYear() + 1)

  const response = await calendar.events.list({
    calendarId: user.googleCalendarId,
    timeMin: oneMonthAgo.toISOString(),
    timeMax: oneYearFromNow.toISOString(),
    singleEvents: true,
    orderBy: "startTime",
  })

  if (!response.data.items) return

  // Process each event
  for (const googleEvent of response.data.items) {
    if (!googleEvent.id) continue

    // Check if event already exists in our database
    const existingEvent = await prismadb.calendarEvent.findFirst({
      where: { googleEventId: googleEvent.id },
    })

    if (existingEvent) continue // Skip if already exists

    // Parse start and end times
    let startTime: Date | undefined
    let endTime: Date | undefined
    let allDay = false

    if (googleEvent.start?.dateTime) {
      startTime = new Date(googleEvent.start.dateTime)
    } else if (googleEvent.start?.date) {
      startTime = new Date(googleEvent.start.date)
      allDay = true
    }

    if (googleEvent.end?.dateTime) {
      endTime = new Date(googleEvent.end.dateTime)
    } else if (googleEvent.end?.date) {
      endTime = new Date(googleEvent.end.date)
      allDay = true
    }

    if (!startTime || !endTime) continue

    // Create event in our database
    await prismadb.calendarEvent.create({
      data: {
        title: googleEvent.summary || "Untitled Event",
        description: googleEvent.description || "",
        startTime,
        endTime,
        allDay,
        location: googleEvent.location || "",
        googleEventId: googleEvent.id,
        googleCalendarId: user.googleCalendarId,
        recurrence: googleEvent.recurrence?.join("\n"),
        creatorId: userId,
        attendees: {
          create:
            googleEvent.attendees?.map((attendee) => ({
              email: attendee.email || "",
              name: attendee.displayName,
              optional: attendee.optional || false,
              responseStatus: mapResponseStatus(attendee.responseStatus),
            })) || [],
        },
      },
    })

    // If it has conference data, create meeting room
    if (googleEvent.conferenceData?.conferenceId) {
      const meetingUrl = googleEvent.conferenceData.entryPoints?.find((entry) => entry.entryPointType === "video")?.uri

      if (meetingUrl && existingEvent) {
        await prismadb.meetingRoom.create({
          data: {
            meetingCode: googleEvent.conferenceData.conferenceId,
            meetingUrl,
            joinUrl: meetingUrl,
            eventId: existingEvent.id,
            creatorId: userId,
          },
        })
      }
    }
  }
}

// Helper function to map Google response status to our enum
function mapResponseStatus(status: string | null | undefined): "NEEDS_ACTION" | "DECLINED" | "TENTATIVE" | "ACCEPTED" {
  switch (status) {
    case "declined":
      return "DECLINED"
    case "tentative":
      return "TENTATIVE"
    case "accepted":
      return "ACCEPTED"
    default:
      return "NEEDS_ACTION"
  }
}

