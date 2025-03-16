import { NextResponse } from "next/server"
import { getUser } from "@/lib/get-user"
import { prismadb } from "@/lib/prisma"
import { getSprintTasks } from "@/actions/projects"

export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const user = await getUser()
    if (!user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = await params;
    const sprintId = id

    // Get sprint
    const sprint = await prismadb.sprint.findUnique({
      where: { id: sprintId },
      include: {
        project: {
          select: {
            id: true,
            members: {
              where: {
                userId: user.id,
              },
            },
          },
        },
      },
    })

    if (!sprint) {
      return NextResponse.json({ error: "Sprint not found" }, { status: 404 })
    }

    // Check if user has access to the project
    const hasAccess =
      sprint.project.members.length > 0 ||
      (await prismadb.project.findFirst({
        where: {
          id: sprint.projectId,
          createdById: user.id,
        },
      }))

    if (!hasAccess) {
      return NextResponse.json({ error: "Not authorized to view this sprint" }, { status: 403 })
    }

    // Get tasks
    const tasks = await getSprintTasks(sprintId)

    return NextResponse.json({ tasks })
  } catch (error) {
    console.error("Error fetching sprint tasks:", error)
    return NextResponse.json({ error: "Failed to fetch sprint tasks" }, { status: 500 })
  }
}

