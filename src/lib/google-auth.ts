import { google } from "googleapis"
import { prismadb } from "@/lib/prisma"
import { getUser } from "@/lib/get-user"

// Set up OAuth2 client
const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/google/callback`,
)

// Scopes required for Google Calendar and Meet
export const SCOPES = ["https://www.googleapis.com/auth/calendar", "https://www.googleapis.com/auth/calendar.events"]

// Generate authorization URL
export function getAuthUrl() {
  return oauth2Client.generateAuthUrl({
    access_type: "offline",
    scope: SCOPES,
    prompt: "consent", // Force to get refresh token
  })
}

// Exchange code for tokens
export async function getTokens(code: string) {
  const { tokens } = await oauth2Client.getToken(code)
  return tokens
}

// Set up authenticated client for a user
export async function getAuthenticatedClient(userId: string) {
  const user = await prismadb.users.findUnique({
    where: { id: userId },
    select: {
      googleRefreshToken: true,
      googleAccessToken: true,
      googleTokenExpiry: true,
    },
  })

  if (!user?.googleRefreshToken) {
    throw new Error("User not authenticated with Google")
  }

  oauth2Client.setCredentials({
    refresh_token: user.googleRefreshToken,
    access_token: user.googleAccessToken,
    expiry_date: user.googleTokenExpiry?.getTime(),
  })

  // Check if token needs refresh
  if (!user.googleAccessToken || !user.googleTokenExpiry || user.googleTokenExpiry < new Date()) {
    const { credentials } = await oauth2Client.refreshAccessToken()

    // Update tokens in database
    await prismadb.users.update({
      where: { id: userId },
      data: {
        googleAccessToken: credentials.access_token,
        googleTokenExpiry: credentials.expiry_date ? new Date(credentials.expiry_date) : undefined,
      },
    })

    oauth2Client.setCredentials(credentials)
  }

  return oauth2Client
}

// Get Google Calendar client for current user
export async function getCalendarClient() {
  const user = await getUser()
  if (!user?.id) throw new Error("User not authenticated")

  const auth = await getAuthenticatedClient(user.id)
  return google.calendar({ version: "v3", auth })
}

// Get primary calendar ID for a user
export async function getPrimaryCalendarId(userId: string) {
  const auth = await getAuthenticatedClient(userId)
  const calendar = google.calendar({ version: "v3", auth })

  const response = await calendar.calendarList.list()
  const primaryCalendar = response.data.items?.find((calendar) => calendar.primary)

  if (!primaryCalendar?.id) {
    throw new Error("Primary calendar not found")
  }

  return primaryCalendar.id
}

