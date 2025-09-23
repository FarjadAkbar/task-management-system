import { NextResponse } from "next/server"
import { getUser } from "@/lib/get-user"
import { prismadb } from "@/lib/prisma"

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
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
      return NextResponse.json({ error: "Subtask title is required" }, { status: 400 })
    }

    // Check if parent task exists
    const task = await prismadb.tasks.findUnique({
      where: { id: taskId },
      include: {
        sprint: true,
      },
    })

    if (!task) {
      return NextResponse.json({ error: "Parent task not found" }, { status: 404 })
    }

    // Check if user has permission to add subtask
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
      return NextResponse.json({ error: "Not authorized to add subtask" }, { status: 403 })
    }

    // Create subtask
    const subtask = await prismadb.subTask.create({
      data: {
        title: body.title,
        description: body.description || "",
        completed: false,
        taskId,
        createdById: user.id,
      },
    })

    return NextResponse.json({ subtask }, { status: 201 })
  } catch (error) {
    console.error("Error creating subtask:", error)
    return NextResponse.json({ error: "Failed to create subtask" }, { status: 500 })
  }
}

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
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

    // Get subtasks
    const subtasks = await prismadb.subTask.findMany({
      where: { taskId },
      orderBy: { createdAt: "asc" },
    })

    return NextResponse.json({ subtasks })
  } catch (error) {
    console.error("Error fetching subtasks:", error)
    return NextResponse.json({ error: "Failed to fetch subtasks" }, { status: 500 })
  }
}

