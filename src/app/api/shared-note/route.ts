import { NextResponse } from "next/server"
import {prismadb} from "@/lib/prisma"
import { requireUser } from "@/lib/user"

export async function GET(req: Request) {
  const auth = await requireUser();
const userId = auth?.id;
  if (!userId) {
    return NextResponse.json({ error: "User ID is required" }, { status: 400 })
  }

  const user = await prismadb.users.findUnique({
    where: { id: userId },
    include: { sharedNoteAccess: true },
  })

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 })
  }

  const sharedNotes = await prismadb.sharedNote.findMany({
    where: {
      OR: [{ authorId: userId }, { access: { some: { userId: userId } } }],
    },
    include: {
      author: { select: { name: true } },
      access: { include: { user: { select: { name: true } } } },
    },
    orderBy: { updatedAt: "desc" },
  })

  return NextResponse.json(sharedNotes)
}

export async function POST(req: Request) {
  const auth = await requireUser();
  const userId = auth?.id;
  const { title, content, sharedWith } = await req.json()

  if (!title || !content || !userId) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
  }

  const user = await prismadb.users.findUnique({ where: { id: userId } })

  if (!user || (user.role !== "MANAGER" && user.role !== "ADMIN")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
  }

  const sharedNote = await prismadb.sharedNote.create({
    data: {
      title,
      content,
      authorId: userId,
      access: {
        create: sharedWith.map((id: string) => ({
          userId: id,
          canEdit: false,
        })),
      },
    },
    include: {
      author: { select: { name: true } },
      access: { include: { user: { select: { name: true } } } },
    },
  })

  return NextResponse.json(sharedNote)
}

