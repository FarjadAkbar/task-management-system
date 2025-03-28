import { NextResponse } from "next/server"
import { getUser } from "@/lib/get-user"
import { prismadb } from "@/lib/prisma"

export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const user = await getUser()
    if (!user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = await params;
    const sprintId = id

    // Get sprint with project info
    const sprint = await prismadb.sprint.findUnique({
      where: { id: sprintId },
      include: {
        project: {
          select: {
            id: true,
            name: true,
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

    // Get tasks count
    const totalTasks = await prismadb.tasks.count({
      where: { sprintId },
    })

    const completedTasks = await prismadb.tasks.count({
      where: {
        sprintId,
        taskStatus: "COMPLETE",
      },
    })

    return NextResponse.json({
      sprint: {
        ...sprint,
        stats: {
          totalTasks,
          completedTasks,
          completionPercentage: totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0,
        },
      },
    })
  } catch (error) {
    console.error("Error fetching sprint:", error)
    return NextResponse.json({ error: "Failed to fetch sprint" }, { status: 500 })
  }
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    const user = await getUser()
    if (!user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const sprintId = params.id
    const body = await req.json()

    // Get sprint
    const sprint = await prismadb.sprint.findUnique({
      where: { id: sprintId },
      include: {
        project: true,
      },
    })

    if (!sprint) {
      return NextResponse.json({ error: "Sprint not found" }, { status: 404 })
    }

    // Check if user has permission to update the sprint
    const hasPermission =
      (await prismadb.projectMember.findFirst({
        where: {
          projectId: sprint.projectId,
          userId: user.id,
          role: { in: ["OWNER", "MANAGER"] },
        },
      })) ||
      (await prismadb.project.findFirst({
        where: {
          id: sprint.projectId,
          createdById: user.id,
        },
      }))

    if (!hasPermission) {
      return NextResponse.json({ error: "Not authorized to update this sprint" }, { status: 403 })
    }

    // Update sprint
    const updateData: any = {}
    if (body.name) updateData.name = body.name
    if (body.goal !== undefined) updateData.goal = body.goal
    if (body.startDate) updateData.startDate = new Date(body.startDate)
    if (body.endDate) updateData.endDate = new Date(body.endDate)
    if (body.status) updateData.status = body.status

    const updatedSprint = await prismadb.sprint.update({
      where: { id: sprintId },
      data: updateData,
    })

    return NextResponse.json({ sprint: updatedSprint })
  } catch (error) {
    console.error("Error updating sprint:", error)
    return NextResponse.json({ error: "Failed to update sprint" }, { status: 500 })
  }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    const user = await getUser()
    if (!user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const sprintId = params.id

    // Get sprint
    const sprint = await prismadb.sprint.findUnique({
      where: { id: sprintId },
      include: {
        project: true,
      },
    })

    if (!sprint) {
      return NextResponse.json({ error: "Sprint not found" }, { status: 404 })
    }

    // Check if user has permission to delete the sprint
    const hasPermission =
      (await prismadb.projectMember.findFirst({
        where: {
          projectId: sprint.projectId,
          userId: user.id,
          role: { in: ["OWNER", "MANAGER"] },
        },
      })) ||
      (await prismadb.project.findFirst({
        where: {
          id: sprint.projectId,
          createdById: user.id,
        },
      }))

    if (!hasPermission) {
      return NextResponse.json({ error: "Not authorized to delete this sprint" }, { status: 403 })
    }

    // Delete sprint
    await prismadb.sprint.delete({
      where: { id: sprintId },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting sprint:", error)
    return NextResponse.json({ error: "Failed to delete sprint" }, { status: 500 })
  }
}

