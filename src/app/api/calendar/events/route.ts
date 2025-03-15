import { NextResponse } from "next/server"
import { getUser } from "@/lib/get-user"
import { getUserEvents, createEvent } from "@/actions/google-calendar"
import { CreateEventInputType } from "@/service/events/type"

export async function GET(req: Request) {
  try {
    const user = await getUser()
    if (!user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const url = new URL(req.url)
    const start = url.searchParams.get("start")
    const end = url.searchParams.get("end")

    const startDate = start ? new Date(start) : undefined
    const endDate = end ? new Date(end) : undefined

    const events = await getUserEvents(user.id, startDate, endDate)

    return NextResponse.json({ events })
  } catch (error) {
    console.error("Error fetching events:", error)
    return NextResponse.json({ error: "Failed to fetch events" }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const user = await getUser()
    if (!user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    if (!user.googleRefreshToken) {
      return NextResponse.json({ error: "Google Calendar not connected" }, { status: 400 })
    }

    const body = await req.json()

    // Validate required fields
    if (!body.title || !body.startTime || !body.endTime) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Parse dates
    const eventData: CreateEventInputType = {
      ...body,
      startTime: new Date(body.startTime),
      endTime: new Date(body.endTime),
    }

    const event = await createEvent(user.id, eventData)

    return NextResponse.json({ event }, { status: 201 })
  } catch (error) {
    console.error("Error creating event:", error)
    return NextResponse.json({ error: "Failed to create event" }, { status: 500 })
  }
}

