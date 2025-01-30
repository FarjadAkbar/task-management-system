import { NextResponse } from "next/server"
import {prismadb} from "@/lib/prisma"

export async function GET() {
  const notes = await prismadb.personalNote.findMany()
  return NextResponse.json(notes)
}

export async function POST(request: Request) {
  const { title, content, isPublic } = await request.json()
  const note = await prismadb.personalNote.create({
    data: {
      title,
      content,
      isPublic,
      userId: "user-id", // Replace with actual user ID from authentication
    },
  })
  return NextResponse.json(note)
}

