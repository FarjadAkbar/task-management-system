import { NextResponse } from "next/server"
import { getUser } from "@/lib/get-user"
import { prismadb } from "@/lib/prisma"

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await getUser()
    if (!user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = await params;
    const availabilityId = id
    const body = await req.json()

    // Check if availability exists and belongs to user
    const existingAvailability = await prismadb.availability.findUnique({
      where: { id: availabilityId },
    })

    if (!existingAvailability) {
      return NextResponse.json({ error: "Availability not found" }, { status: 404 })
    }

    if (existingAvailability.userId !== user.id) {
      return NextResponse.json({ error: "Not authorized" }, { status: 403 })
    }

    // Update availability
    const availability = await prismadb.availability.update({
      where: { id: availabilityId },
      data: {
        day: body.day || existingAvailability.day,
        startTime: body.startTime || existingAvailability.startTime,
        endTime: body.endTime || existingAvailability.endTime,
        isActive: body.isActive !== undefined ? body.isActive : existingAvailability.isActive,
      },
    })

    return NextResponse.json({ availability })
  } catch (error) {
    console.error("Error updating availability:", error)
    return NextResponse.json({ error: "Failed to update availability" }, { status: 500 })
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await getUser()
    if (!user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = await params;
    const availabilityId = id

    // Check if availability exists and belongs to user
    const existingAvailability = await prismadb.availability.findUnique({
      where: { id: availabilityId },
    })

    if (!existingAvailability) {
      return NextResponse.json({ error: "Availability not found" }, { status: 404 })
    }

    if (existingAvailability.userId !== user.id) {
      return NextResponse.json({ error: "Not authorized" }, { status: 403 })
    }

    // Delete availability
    await prismadb.availability.delete({
      where: { id: availabilityId },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting availability:", error)
    return NextResponse.json({ error: "Failed to delete availability" }, { status: 500 })
  }
}

