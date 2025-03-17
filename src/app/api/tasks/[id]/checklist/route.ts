import { NextResponse } from "next/server"
import { getUser } from "@/lib/get-user"
import { prismadb } from "@/lib/prisma"

export async function POST(req: Request, { params }: { params: { id: string } }) {
  try {
    const user = await getUser()
    if (!user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = await params;
    const taskId = id
    const body = await req.json()

    // Validate required fields
    if (!body.title) {
      return NextResponse.json({ error: "Checklist item title is required" }, { status: 400 })
    }

    // Check if task exists
    const task = await prismadb.tasks.findUnique({
      where: { id: taskId },
      include: {
        sprint: true,
      },
    })

    if (!task) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 })
    }

    // Check if user has permission to add checklist item
    const isCreator = task.createdBy === user.id
    const isAssigned = await prismadb.taskAssignee.findFirst({
      where: {
        taskId,
        userId: user.id,
      },
    })

    // If task is in a sprint, check project membership
    let hasProjectAccess = false
    if (task.sprint) {
      const projectMember = await prismadb.projectMember.findFirst({
        where: {
          projectId: task.sprint.projectId,
          userId: user.id,
        },
      })

      const isProjectCreator = await prismadb.project.findFirst({
        where: {
          id: task.sprint.projectId,
          createdById: user.id,
        },
      })

      hasProjectAccess = !!projectMember || !!isProjectCreator
    }

    if (!isCreator && !isAssigned && !hasProjectAccess && user.role !== "ADMIN") {
      return NextResponse.json({ error: "Not authorized to add checklist item" }, { status: 403 })
    }

    // Create checklist item
    const checklistItem = await prismadb.checklistItem.create({
      data: {
        title: body.title,
        completed: false,
        taskId,
        createdById: user.id,
      },
    })

    return NextResponse.json({ checklistItem }, { status: 201 })
  } catch (error) {
    console.error("Error creating checklist item:", error)
    return NextResponse.json({ error: "Failed to create checklist item" }, { status: 500 })
  }
}

export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const user = await getUser()
    if (!user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const taskId = params.id

    // Check if task exists
    const task = await prismadb.tasks.findUnique({
      where: { id: taskId },
    })

    if (!task) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 })
    }

    // Get checklist items
    const checklist = await prismadb.checklistItem.findMany({
      where: { taskId },
      orderBy: { createdAt: "asc" },
    })

    return NextResponse.json({ checklist })
  } catch (error) {
    console.error("Error fetching checklist:", error)
    return NextResponse.json({ error: "Failed to fetch checklist" }, { status: 500 })
  }
}

