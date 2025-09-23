import { NextResponse } from "next/server"
import { getUser } from "@/lib/get-user"
import { getEvent, updateEvent, deleteEvent } from "@/actions/google-calendar"
import { UpdateEventInputType } from "@/service/events/type"

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await getUser()
    if (!user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    const { id } = await params
    const eventId = id
    const event = await getEvent(user.id, eventId)

    if (!event) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 })
    }

    return NextResponse.json({ event })
  } catch (error) {
    console.error("Error fetching event:", error)
    return NextResponse.json({ error: "Failed to fetch event" }, { status: 500 })
  }
}

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await getUser()
    if (!user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    const { id } = await params
    const eventId = id
  
    const body = await req.json()

    // Parse dates if provided
    const eventData: UpdateEventInputType = {
      ...body,
      id: eventId,
    }

    if (body.startTime) {
      eventData.startTime = new Date(body.startTime)
    }

    if (body.endTime) {
      eventData.endTime = new Date(body.endTime)
    }

    const event = await updateEvent(user.id, eventData)

    return NextResponse.json({ event })
  } catch (error) {
    console.error("Error updating event:", error)
    return NextResponse.json({ error: "Failed to update event" }, { status: 500 })
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await getUser()
    if (!user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = await params;
    const eventId = id
    await deleteEvent(user.id, eventId)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting event:", error)
    return NextResponse.json({ error: "Failed to delete event" }, { status: 500 })
  }
}

