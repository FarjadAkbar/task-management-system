import { NextResponse } from "next/server"
import { prismadb } from "@/lib/prisma"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const note = await prismadb.sharedDatabase.findUnique({
      where: { id: params.id },
    })
    if (!note) {
      return NextResponse.json({ error: "Shared database entry not found" }, { status: 404 })
    }
    return NextResponse.json(note)
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch shared database entry" }, { status: 500 })
  }
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
    try {
      const { title, content, accessRole } = await request.json()
      if (!title || !content || !accessRole) {
        return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
      }
  
      const note = await prismadb.sharedDatabase.update({
        where: { id: params.id },
        data: { title, content, accessRole },
      })
      return NextResponse.json(note)
    } catch (error) {
      return NextResponse.json({ error: "Failed to update shared database entry" }, { status: 500 })
    }
  }

  export async function DELETE(request: Request, { params }: { params: { id: string } }) {
    try {
      await prismadb.sharedDatabase.delete({
        where: { id: params.id },
      })
      return NextResponse.json({ message: "Shared database entry deleted successfully" })
    } catch (error) {
      return NextResponse.json({ error: "Failed to delete shared database entry" }, { status: 500 })
    }
  }
  