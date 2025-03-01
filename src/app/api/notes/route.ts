import { NextResponse } from "next/server"
import {prismadb} from "@/lib/prisma"

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const userId = searchParams.get("userId")

  if (!userId) {
    return NextResponse.json({ error: "User ID is required" }, { status: 400 })
  }

  const notes = await prismadb.notes.findMany({
    where: { authorId: userId },
    orderBy: { updatedAt: "desc" },
  })

  return NextResponse.json(notes)
}

export async function POST(req: Request) {
  const { title, content, userId } = await req.json()

  if (!title || !content || !userId) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
  }

  const note = await prismadb.notes.create({
    data: { title, content, authorId: userId },
  })

  return NextResponse.json(note)
}

