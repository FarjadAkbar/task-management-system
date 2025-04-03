import { NextResponse } from "next/server"
import { getUser } from "@/lib/get-user"
import { syncEventsFromGoogle } from "@/actions/google-calendar"

export async function POST(req: Request) {
  try {
    const user = await getUser()
    if (!user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    if (!user.googleRefreshToken) {
      return NextResponse.json({ error: "Google Calendar not connected" }, { status: 400 })
    }

    await syncEventsFromGoogle(user.id)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error syncing events:", error)
    return NextResponse.json({ error: "Failed to sync events" }, { status: 500 })
  }
}

