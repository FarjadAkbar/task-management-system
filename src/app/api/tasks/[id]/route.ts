import { NextResponse } from "next/server"
import { getUser } from "@/lib/get-user"
import { prismadb } from "@/lib/prisma"
import { getTaskDetails } from "@/actions/projects"

export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const user = await getUser()
    if (!user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = await params;
    const taskId = id

    // Get task details
    const task = await getTaskDetails(taskId)

    if (!task) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 })
    }

    // Check if user has access to the task
    const isAssigned = task.assignees ? task.assignees.some((assignee) => assignee.userId === user.id) : false
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
      return NextResponse.json({ error: "Not authorized to view this task" }, { status: 403 })
    }

    // Filter private feedback for non-admins
    if (user.role !== "ADMIN" && task.task_feedback) {
      task.task_feedback = task.task_feedback.filter((feedback) => !feedback.isPrivate || feedback.userId === user.id)
    }

    return NextResponse.json({ task })
  } catch (error) {
    console.error("Error fetching task:", error)
    return NextResponse.json({ error: "Failed to fetch task" }, { status: 500 })
  }
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    const user = await getUser()
    if (!user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const taskId = params.id
    const body = await req.json()

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

    // Check if user has permission to update the task
    const isAssigned = task.assignees.some((assignee) => assignee.userId === user.id)
    const isCreator = task.createdBy === user.id

    // If task is in a sprint, check project membership
    let hasProjectAccess = false
    if (task.sprint) {
      const projectMember = await prismadb.projectMember.findFirst({
        where: {
          projectId: task.sprint.projectId,
          userId: user.id,
          role: { in: ["OWNER", "MANAGER"] },
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
      return NextResponse.json({ error: "Not authorized to update this task" }, { status: 403 })
    }

    // Update task
    const updateData: any = {}
    if (body.title) updateData.title = body.title
    if (body.content !== undefined) updateData.content = body.content
    if (body.priority) updateData.priority = body.priority
    if (body.section) updateData.section = body.section
    if (body.sprintId !== undefined) updateData.sprintId = body.sprintId
    if (body.weight) updateData.weight = body.weight
    if (body.estimatedHours !== undefined) updateData.estimatedHours = body.estimatedHours
    if (body.startDate) updateData.startDate = new Date(body.startDate)
    if (body.dueDateAt) updateData.dueDateAt = new Date(body.dueDateAt)
    if (body.tags) updateData.tags = body.tags
    if (body.parentTaskId !== undefined) updateData.parentTaskId = body.parentTaskId

    // Update task
    const updatedTask = await prismadb.tasks.update({
      where: { id: taskId },
      data: {
        ...updateData,
        updatedBy: user.id,
        updatedAt: new Date(),
      },
    })

    // Update assignees if provided
    if (body.assignees && Array.isArray(body.assignees)) {
      // Remove existing assignees
      await prismadb.taskAssignee.deleteMany({
        where: { taskId },
      })

      // Add new assignees
      await Promise.all(
        body.assignees.map(async (userId: string) => {
          return prismadb.taskAssignee.create({
            data: {
              taskId,
              userId,
              role: "ASSIGNEE",
            },
          })
        }),
      )
    }

    return NextResponse.json({ task: updatedTask })
  } catch (error) {
    console.error("Error updating task:", error)
    return NextResponse.json({ error: "Failed to update task" }, { status: 500 })
  }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
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
        sprint: true,
      },
    })

    if (!task) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 })
    }

    // Check if user has permission to delete the task
    const isCreator = task.createdBy === user.id

    // If task is in a sprint, check project membership
    let hasProjectAccess = false
    if (task.sprint) {
      const projectMember = await prismadb.projectMember.findFirst({
        where: {
          projectId: task.sprint.projectId,
          userId: user.id,
          role: { in: ["OWNER", "MANAGER"] },
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

    if (!isCreator && !hasProjectAccess && user.role !== "ADMIN") {
      return NextResponse.json({ error: "Not authorized to delete this task" }, { status: 403 })
    }

    // Delete task
    await prismadb.tasks.delete({
      where: { id: taskId },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting task:", error)
    return NextResponse.json({ error: "Failed to delete task" }, { status: 500 })
  }
}

