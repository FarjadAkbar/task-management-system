import { NextResponse } from "next/server"
import { prismadb } from "@/lib/prisma"

export async function GET() {
  try {
    const notes = await prismadb.sharedDatabase.findMany()
    return NextResponse.json(notes)
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch shared database entries" }, { status: 500 })
  }
}


export async function POST(request: Request) {
  try {
    const { title, content, accessRole, createdById } = await request.json()

    if (!title || !content || !accessRole || !createdById) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const note = await prismadb.sharedDatabase.create({
      data: { title, content, accessRole, createdById },
    })
    return NextResponse.json(note)
  } catch (error) {
    return NextResponse.json({ error: "Failed to create shared database entry" }, { status: 500 })
  }
}


