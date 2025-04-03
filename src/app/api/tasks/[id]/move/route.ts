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
    if (!body.sectionId) {
      return NextResponse.json({ error: "Section ID is required" }, { status: 400 })
    }

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

    // Check if user has permission to move the task
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
      return NextResponse.json({ error: "Not authorized to move this task" }, { status: 403 })
    }

    // Check if section exists
    const section = await prismadb.sections.findUnique({
      where: { id: body.sectionId },
    })

    if (!section) {
      return NextResponse.json({ error: "Section not found" }, { status: 404 })
    }

    // Get tasks in the target section
    const tasksInSection = await prismadb.tasks.findMany({
      where: { section: body.sectionId },
      orderBy: { position: "asc" },
    })

    // Calculate new positions
    let newPosition = body.position || 0

    // Ensure position is within bounds
    if (newPosition < 0) {
      newPosition = 0
    } else if (newPosition > tasksInSection.length) {
      newPosition = tasksInSection.length
    }

    // Update positions of other tasks if needed
    if (task.section !== body.sectionId || (task.section === body.sectionId && task.position !== newPosition)) {
      // If moving within the same section
      if (task.section === body.sectionId) {
        // Remove task from its current position
        const filteredTasks = tasksInSection.filter((t) => t.id !== taskId)

        // Insert task at new position
        filteredTasks.splice(newPosition, 0, task)

        // Update positions
        await Promise.all(
          filteredTasks.map((t, index) => {
            if (t.id !== taskId && t.position !== index) {
              return prismadb.tasks.update({
                where: { id: t.id },
                data: { position: index },
              })
            }
          }),
        )
      } else {
        // If moving to a different section

        // Update positions in the target section
        const updatedTasks = [...tasksInSection]
        updatedTasks.splice(newPosition, 0, { ...task, id: taskId })

        await Promise.all(
          updatedTasks.map((t, index) => {
            if (t.id !== taskId && t.position !== index) {
              return prismadb.tasks.update({
                where: { id: t.id },
                data: { position: index },
              })
            }
          }),
        )

        // Update positions in the source section if needed
        if (task.section) {
          const tasksInSourceSection = await prismadb.tasks.findMany({
            where: {
              section: task.section,
              id: { not: taskId },
            },
            orderBy: { position: "asc" },
          })

          await Promise.all(
            tasksInSourceSection.map((t, index) => {
              if (t.position !== index) {
                return prismadb.tasks.update({
                  where: { id: t.id },
                  data: { position: index },
                })
              }
            }),
          )
        }
      }
    }

    // Update task section and position
    const updatedTask = await prismadb.tasks.update({
      where: { id: taskId },
      data: {
        section: body.sectionId,
        position: newPosition,
        updatedAt: new Date(),
      },
      include: {
        assignees: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
                avatar: true,
              },
            },
          },
        },
        assigned_section: true,
      },
    })

    return NextResponse.json({ task: updatedTask })
  } catch (error) {
    console.error("Error moving task:", error)
    return NextResponse.json({ error: "Failed to move task" }, { status: 500 })
  }
}

