import { NextResponse } from "next/server"
import { getUser } from "@/lib/get-user"
import { prismadb } from "@/lib/prisma"

export async function POST(req: Request) {
  try {
    const user = await getUser()
    if (!user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { taskId, documentId } = await req.json()
    const attachment = await prismadb.taskDocument.create({
      data: {
        taskId,
        documentId
      }
    })


    return NextResponse.json({ attachment }, { status: 201 })
  } catch (error) {
    console.error("Error uploading attachment:", error)
    return NextResponse.json({ error: "Failed to upload attachment" }, { status: 500 })
  }
}

export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const user = await getUser()
    if (!user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = await params;
    const taskId = id

    // Check if task exists
    const task = await prismadb.tasks.findUnique({
      where: { id: taskId },
    })

    if (!task) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 })
    }

    // Get attachments
    const attachments = await prismadb.taskDocument.findMany({
      where: { taskId },
      include: {
        document: true
      },
    })

    return NextResponse.json({ attachments })
  } catch (error) {
    console.error("Error fetching attachments:", error)
    return NextResponse.json({ error: "Failed to fetch attachments" }, { status: 500 })
  }
}

