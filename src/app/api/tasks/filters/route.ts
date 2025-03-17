import { NextResponse } from "next/server"
import { getUser } from "@/lib/get-user"
import { prismadb } from "@/lib/prisma"

export async function GET(req: Request) {
  try {
    const user = await getUser()
    if (!user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get projects the user has access to
    const projects = await prismadb.project.findMany({
      where: {
        OR: [{ createdById: user.id }, { members: { some: { userId: user.id } } }],
      },
      select: {
        id: true,
        name: true,
      },
      orderBy: {
        name: "asc",
      },
    })

    // Get sprints from those projects
    const sprints = await prismadb.sprint.findMany({
      where: {
        projectId: {
          in: projects.map((p) => p.id),
        },
      },
      select: {
        id: true,
        name: true,
        projectId: true,
      },
      orderBy: {
        name: "asc",
      },
    })

    // Get all possible task statuses
    const statuses = ["PENDING", "IN_PROGRESS", "REVIEW", "COMPLETE", "BLOCKED"]

    // Get all possible priorities
    const priorities = ["LOW", "MEDIUM", "HIGH"]

    // Return filters
    return NextResponse.json({
      filters: {
        projects,
        sprints,
        statuses,
        priorities,
      },
    })
  } catch (error) {
    console.error("Error fetching task filters:", error)
    return NextResponse.json({ error: "Failed to fetch task filters" }, { status: 500 })
  }
}

