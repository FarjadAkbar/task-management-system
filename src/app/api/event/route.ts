import { NextResponse } from "next/server"
import { prismadb } from "@/lib/prisma"
import { requireUser } from "@/lib/user"

const validateEventType = async (data: any, userId: string) => {
  const errors: Record<string, string> = {}

  if (!data.title || typeof data.title !== "string" || data.title.trim() === "") {
    errors.title = "Title is required"
  }

  if (!data.url || typeof data.url !== "string" || data.url.trim() === "") {
    errors.url = "URL is required"
  } else {
    const existingEvent = await prismadb.events.findFirst({
      where: {
        userId: userId,
        url: data.url,
      },
    })
    if (existingEvent) {
      errors.url = "URL already exists for this user"
    }
  }

  if (!data.duration || !["15", "30", "45", "60"].includes(data.duration)) {
    errors.duration = "Invalid duration"
  }

  if (!data.videoCallSoftware || !["Google Meet"].includes(data.videoCallSoftware)) {
    errors.videoCallSoftware = "Invalid video call software"
  }

  return Object.keys(errors).length > 0 ? errors : null
}

export async function POST(req: Request) {
  try {
    const user = await requireUser()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await req.json()
    const validationErrors = await validateEventType(body, user.id)

    if (validationErrors) {
      return NextResponse.json({ errors: validationErrors }, { status: 400 })
    }

    const data = await prismadb.events.create({
      data: {
        title: body.title,
        url: body.url,
        description: body.description || "",
        duration: body.duration,
        videoCallSoftware: body.videoCallSoftware,
        userId: user.id,
      },
    })

    return NextResponse.json(data, { status: 201 })
  } catch (error) {
    console.error("Error creating event:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}

