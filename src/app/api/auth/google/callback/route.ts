import { NextResponse } from "next/server"
import { getTokens, getPrimaryCalendarId } from "@/lib/google-auth"
import { prismadb } from "@/lib/prisma"
import { getUser } from "@/lib/get-user"

export async function GET(req: Request) {
  try {
    const url = new URL(req.url)
    const code = url.searchParams.get("code")

    if (!code) {
      return NextResponse.redirect(new URL("/event?error=missing_code", process.env.NEXT_PUBLIC_APP_URL!))
    }

    const user = await getUser()
    if (!user?.id) {
      return NextResponse.redirect(new URL("/login", process.env.NEXT_PUBLIC_APP_URL!))
    }

    // Exchange code for tokens
    const tokens = await getTokens(code)

    if (!tokens.refresh_token) {
      return NextResponse.redirect(new URL("/event?error=no_refresh_token", process.env.NEXT_PUBLIC_APP_URL!))
    }

    // Store tokens in database
    await prismadb.users.update({
      where: { id: user.id },
      data: {
        googleRefreshToken: tokens.refresh_token,
        googleAccessToken: tokens.access_token,
        googleTokenExpiry: tokens.expiry_date ? new Date(tokens.expiry_date) : undefined,
      },
    })

    // Get and store primary calendar ID
    try {
      const calendarId = await getPrimaryCalendarId(user.id)
      await prismadb.users.update({
        where: { id: user.id },
        data: { googleCalendarId: calendarId },
      })
    } catch (error) {
      console.error("Failed to get primary calendar ID:", error)
    }

    return NextResponse.redirect(new URL("/event?connected=true", process.env.NEXT_PUBLIC_APP_URL!))
  } catch (error) {
    console.error("Google auth callback error:", error)
    return NextResponse.redirect(new URL("/event?error=auth_failed", process.env.NEXT_PUBLIC_APP_URL!))
  }
}

