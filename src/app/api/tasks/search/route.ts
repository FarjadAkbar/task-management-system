import { NextResponse } from "next/server"
import { getUser } from "@/lib/get-user"
import { prismadb } from "@/lib/prisma"
import { TaskWhereClause, TaskSearchFilters, TaskFilterClause } from "@/types/type"
import { buildTaskFilters, buildTaskAccessClause } from "@/lib/filters"

export async function GET(req: Request) {
  try {
    const user = await getUser()
    if (!user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    
    // Parse search filters
    const filters: TaskSearchFilters = {
      query: searchParams.get("q") || undefined,
      priority: searchParams.get("priority") || undefined,
      status: searchParams.get("status") || undefined,
      assignedToMe: searchParams.get("assignedToMe") === "true",
      createdByMe: searchParams.get("createdByMe") === "true",
      sprintId: searchParams.get("sprintId") || undefined,
      projectId: searchParams.get("projectId") || undefined,
    }

    // Build the where clause
    const where: TaskWhereClause = {
      ...buildTaskAccessClause(user.id),
    }

    // Add search filters
    const filterClauses = buildTaskFilters(filters, user.id)

    // Add filters to where clause
    if (filterClauses.length > 0) {
      where.AND = filterClauses
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

