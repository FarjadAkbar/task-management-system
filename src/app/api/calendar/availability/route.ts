import { NextResponse } from "next/server"
import { getUser } from "@/lib/get-user"
import { prismadb } from "@/lib/prisma"

export async function GET(req: Request) {
  try {
    const user = await getUser()
    if (!user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const url = new URL(req.url)
    const userId = url.searchParams.get("userId") || user.id

    // Check if requesting another user's availability
    if (userId !== user.id) {
      // You might want to add permission checks here
    }

    const availability = await prismadb.availability.findMany({
      where: { userId },
      orderBy: { day: "asc" },
    })

    return NextResponse.json({ availability })
  } catch (error) {
    console.error("Error fetching availability:", error)
    return NextResponse.json({ error: "Failed to fetch availability" }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const user = await getUser()
    if (!user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await req.json()

    // Validate required fields
    if (!body.day || !body.startTime || !body.endTime) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Check if availability for this day already exists
    const existingAvailability = await prismadb.availability.findFirst({
      where: {
        userId: user.id,
        day: body.day,
      },
    })

    if (existingAvailability) {
      return NextResponse.json({ error: "Availability for this day already exists" }, { status: 400 })
    }

    // Create new availability
    const availability = await prismadb.availability.create({
      data: {
        day: body.day,
        startTime: body.startTime,
        endTime: body.endTime,
        isActive: body.isActive ?? true,
        userId: user.id,
      },
    })

    return NextResponse.json({ availability }, { status: 201 })
  } catch (error) {
    console.error("Error creating availability:", error)
    return NextResponse.json({ error: "Failed to create availability" }, { status: 500 })
  }
}

