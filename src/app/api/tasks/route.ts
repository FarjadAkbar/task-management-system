import { NextResponse } from "next/server"
import { getUser } from "@/lib/get-user"
import { prismadb } from "@/lib/prisma"

export async function POST(req: Request) {
  try {
    const user = await getUser()
    if (!user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await req.json()

    // Validate required fields
    if (!body.title) {
      return NextResponse.json({ error: "Task title is required" }, { status: 400 })
    }

    // Check if section exists if provided
    if (body.section) {
      const section = await prismadb.sections.findUnique({
        where: { id: body.section },
        include: {
          board: {
            include: {
              project: true,
            },
          },
        },
      })

      if (!section) {
        return NextResponse.json({ error: "Section not found" }, { status: 404 })
      }

      // Check if user has access to the project
      if (section.board.projectId) {
        const hasAccess =
          section.board.created_by_user === user.id ||
          (await prismadb.projectMember.findFirst({
            where: {
              projectId: section.board.projectId,
              userId: user.id,
            },
          })) ||
          (await prismadb.project.findFirst({
            where: {
              id: section.board.projectId,
              createdById: user.id,
            },
          }))

        if (!hasAccess) {
          return NextResponse.json({ error: "Not authorized to create tasks in this project" }, { status: 403 })
        }
      }
    }

    // Check if sprint exists if provided
    if (body.sprintId) {
      const sprint = await prismadb.sprint.findUnique({
        where: { id: body.sprintId },
        include: {
          project: true,
        },
      })

      if (!sprint) {
        return NextResponse.json({ error: "Sprint not found" }, { status: 404 })
      }

      // Check if user has access to the project
      const hasAccess =
        (await prismadb.projectMember.findFirst({
          where: {
            projectId: sprint.projectId,
            userId: user.id,
          },
        })) ||
        (await prismadb.project.findFirst({
          where: {
            id: sprint.projectId,
            createdById: user.id,
          },
        }))

      if (!hasAccess) {
        return NextResponse.json({ error: "Not authorized to create tasks in this sprint" }, { status: 403 })
      }
    }

    // Check if parent task exists if provided
    if (body.parentTaskId) {
      const parentTask = await prismadb.tasks.findUnique({
        where: { id: body.parentTaskId },
      })

      if (!parentTask) {
        return NextResponse.json({ error: "Parent task not found" }, { status: 404 })
      }
    }

    // Get the highest position in the section if provided
    let position = 0
    if (body.section) {
      const highestPosition = await prismadb.tasks.findFirst({
        where: { section: body.section },
        orderBy: {
          position: "desc",
        },
        select: {
          position: true,
        },
      })

      position = (highestPosition?.position || 0) + 1
    }

    // Create task
    const task = await prismadb.tasks.create({
      data: {
        title: body.title,
        content: body.content || "",
        priority: body.priority || "MEDIUM",
        taskStatus: "PENDING",
        section: body.section,
        sprintId: body.sprintId,
        weight: body.weight || 1,
        estimatedHours: body.estimatedHours,
        startDate: body.startDate ? new Date(body.startDate) : null,
        dueDateAt: body.dueDateAt ? new Date(body.dueDateAt) : null,
        tags: body.tags || [],
        parentTaskId: body.parentTaskId,
        position,
        createdBy: user.id,
      },
    })

    // Add assignees if provided
    if (body.assignees && Array.isArray(body.assignees) && body.assignees.length > 0) {
      await Promise.all(
        body.assignees.map(async (userId: string) => {
          return prismadb.taskAssignee.create({
            data: {
              taskId: task.id,
              userId,
              role: "ASSIGNEE",
            },
          })
        }),
      )
    }

    // Get the created task with relationships
    const createdTask = await prismadb.tasks.findUnique({
      where: { id: task.id },
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
        sprint: true,
      },
    })

    return NextResponse.json({ task: createdTask }, { status: 201 })
  } catch (error) {
    console.error("Error creating task:", error)
    return NextResponse.json({ error: "Failed to create task" }, { status: 500 })
  }
}

export async function GET(req: Request) {
  try {
    const user = await getUser()
    if (!user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const search = searchParams.get("q") || ""
    const priority = searchParams.get("priority")
    const status = searchParams.get("status")
    const assignedToMe = searchParams.get("assignedToMe") === "true"
    const createdByMe = searchParams.get("createdByMe") === "true"
    const sprintId = searchParams.get("sprintId")
    const projectId = searchParams.get("projectId")

    // Build the where clause
    const where: any = {}

    if (search) {
      where.OR = [
        { title: { contains: search, mode: "insensitive" } },
        { content: { contains: search, mode: "insensitive" } },
      ]
    }

    if (priority) {
      where.priority = priority
    }

    if (status) {
      where.taskStatus = status
    }

    if (assignedToMe) {
      where.assignees = {
        some: {
          userId: user.id,
        },
      }
    }

    if (createdByMe) {
      where.createdBy = user.id
    }

    if (sprintId) {
      where.sprintId = sprintId
    }

    if (projectId) {
      where.sprint = {
        projectId,
      }
    }

    // Get tasks
    const tasks = await prismadb.tasks.findMany({
      where,
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
        sprint: true,
      },
      orderBy: {
        updatedAt: "desc",
      },
      take: 50,
    })

    return NextResponse.json({ tasks })
  } catch (error) {
    console.error("Error fetching tasks:", error)
    return NextResponse.json({ error: "Failed to fetch tasks" }, { status: 500 })
  }
}

