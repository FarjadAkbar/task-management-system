import { NextResponse } from "next/server"
import { prismadb } from "@/lib/prisma"
import { getServerSession } from "next-auth/next"
import type { EventType, RoleEnum } from "@prisma/client"

interface ScheduleMeetingBody {
  title: string
  description: string
  startTime: string
  endTime: string
  eventType: EventType
  meetingType: "role" | "individual"
  role?: RoleEnum
  participants: string[]
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession()
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body: ScheduleMeetingBody = await req.json()
    const { title, description, eventType, startTime, endTime, meetingType, role, participants } = body

    const createdBy = await prismadb.users.findUnique({
      where: { email: session.user.email },
    })

    if (!createdBy) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    const newEvent = await prismadb.event.create({
      data: {
        title,
        description,
        eventType,
        startTime: new Date(startTime),
        endTime: new Date(endTime),
        createdById: createdBy.id,
      },
    })

    if (meetingType === "role" && role) {
      await prismadb.eventParticipant.createMany({
        data: participants.map((userId) => ({
          eventId: newEvent.id,
          userId,
        })),
      })
    } else if (meetingType === "individual" && participants.length === 1) {
      await prismadb.eventParticipant.create({
        data: {
          eventId: newEvent.id,
          userId: participants[0],
        },
      })
    }

    return NextResponse.json(newEvent)
  } catch (error) {
    console.error("Error scheduling meeting:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}

