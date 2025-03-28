import { NextResponse } from "next/server"
import { getUser } from "@/lib/get-user"
import { prismadb } from "@/lib/prisma"

export async function GET(req: Request) {
  try {
    const user = await getUser()
    if (!user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const query = searchParams.get("q") || ""
    const priority = searchParams.get("priority")
    const status = searchParams.get("status")
    const assignedToMe = searchParams.get("assignedToMe") === "true"
    const createdByMe = searchParams.get("createdByMe") === "true"
    const sprintId = searchParams.get("sprintId")
    const projectId = searchParams.get("projectId")

    // Build the where clause
    const where: any = {}

    // User must have access to the tasks
    where.OR = [
      // Tasks created by the user
      { createdBy: user.id },
      // Tasks assigned to the user
      { assignees: { some: { userId: user.id } } },
      // Tasks in projects where the user is a member
      {
        sprint: {
          project: {
            members: {
              some: {
                userId: user.id,
              },
            },
          },
        },
      },
      // Tasks in projects created by the user
      {
        sprint: {
          project: {
            createdById: user.id,
          },
        },
      },
    ]

    // Add search filters
    const filters: any[] = []

    if (query) {
      filters.push({
        OR: [
          { title: { contains: query, mode: "insensitive" } },
          { content: { contains: query, mode: "insensitive" } },
        ],
      })
    }

    if (priority) {
      filters.push({ priority })
    }

    if (status) {
      filters.push({ taskStatus: status })
    }

    if (assignedToMe) {
      filters.push({
        assignees: {
          some: {
            userId: user.id,
          },
        },
      })
    }

    if (createdByMe) {
      filters.push({ createdBy: user.id })
    }

    if (sprintId) {
      filters.push({ sprintId })
    }

    if (projectId) {
      filters.push({
        sprint: {
          projectId,
        },
      })
    }

    // Add filters to where clause
    if (filters.length > 0) {
      where.AND = filters
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
        sprint: {
          select: {
            id: true,
            name: true,
            project: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
      orderBy: {
        updatedAt: "desc",
      },
      take: 50,
    })

    return NextResponse.json({ tasks })
  } catch (error) {
    console.error("Error searching tasks:", error)
    return NextResponse.json({ error: "Failed to search tasks" }, { status: 500 })
  }
}

