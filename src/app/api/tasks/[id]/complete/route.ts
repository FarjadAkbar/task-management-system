import { NextResponse } from "next/server"
import { getUser } from "@/lib/get-user"
import { prismadb } from "@/lib/prisma"

export async function POST(req: Request, { params }: { params: { id: string } }) {
  try {
    const user = await getUser()
    if (!user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const taskId = params.id

    // Get task
    const task = await prismadb.tasks.findUnique({
      where: { id: taskId },
      include: {
        assignees: true,
        sprint: true,
      },
    })

    if (!task) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 })
    }

    // Check if user has permission to complete the task
    const isAssigned = task.assignees.some((assignee) => assignee.userId === user.id)
    const isCreator = task.createdBy === user.id

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

    if (!isAssigned && !isCreator && !hasProjectAccess && user.role !== "ADMIN") {
      return NextResponse.json({ error: "Not authorized to complete this task" }, { status: 403 })
    }

    // Complete task
    const updatedTask = await prismadb.tasks.update({
      where: { id: taskId },
      data: {
        taskStatus: "COMPLETE",
        completedAt: new Date(),
        updatedBy: user.id,
        updatedAt: new Date(),
      },
    })

    return NextResponse.json({ task: updatedTask })
  } catch (error) {
    console.error("Error completing task:", error)
    return NextResponse.json({ error: "Failed to complete task" }, { status: 500 })
  }
}

