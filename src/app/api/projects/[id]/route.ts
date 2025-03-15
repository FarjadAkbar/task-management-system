import { NextResponse } from "next/server"
import { getUser } from "@/lib/get-user"
import { prismadb } from "@/lib/prisma"
import { getProjectWithDetails } from "@/actions/projects"

export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const user = await getUser()
    if (!user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const projectId = params.id

    // Check if user has access to the project
    const membership = await prismadb.projectMember.findFirst({
      where: {
        projectId,
        userId: user.id,
      },
    })

    const isCreator = await prismadb.project.findFirst({
      where: {
        id: projectId,
        createdById: user.id,
      },
    })

    if (!membership && !isCreator) {
      return NextResponse.json({ error: "Not authorized to view this project" }, { status: 403 })
    }

    const project = await getProjectWithDetails(projectId)

    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 })
    }

    return NextResponse.json({ project })
  } catch (error) {
    console.error("Error fetching project:", error)
    return NextResponse.json({ error: "Failed to fetch project" }, { status: 500 })
  }
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    const user = await getUser()
    if (!user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const projectId = params.id
    const body = await req.json()

    // Check if user has permission to update the project
    const membership = await prismadb.projectMember.findFirst({
      where: {
        projectId,
        userId: user.id,
        role: { in: ["OWNER", "MANAGER"] },
      },
    })

    const isCreator = await prismadb.project.findFirst({
      where: {
        id: projectId,
        createdById: user.id,
      },
    })

    if (!membership && !isCreator) {
      return NextResponse.json({ error: "Not authorized to update this project" }, { status: 403 })
    }

    // Update project
    const updateData: any = {}
    if (body.name) updateData.name = body.name
    if (body.description !== undefined) updateData.description = body.description
    if (body.startDate) updateData.startDate = new Date(body.startDate)
    if (body.endDate) updateData.endDate = new Date(body.endDate)
    if (body.status) updateData.status = body.status

    const project = await prismadb.project.update({
      where: { id: projectId },
      data: updateData,
    })

    return NextResponse.json({ project })
  } catch (error) {
    console.error("Error updating project:", error)
    return NextResponse.json({ error: "Failed to update project" }, { status: 500 })
  }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    const user = await getUser()
    if (!user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const projectId = params.id

    // Check if user has permission to delete the project
    const membership = await prismadb.projectMember.findFirst({
      where: {
        projectId,
        userId: user.id,
        role: "OWNER",
      },
    })

    const isCreator = await prismadb.project.findFirst({
      where: {
        id: projectId,
        createdById: user.id,
      },
    })

    if (!membership && !isCreator) {
      return NextResponse.json({ error: "Not authorized to delete this project" }, { status: 403 })
    }

    // Delete project (cascade will delete members, sprints, etc.)
    await prismadb.project.delete({
      where: { id: projectId },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting project:", error)
    return NextResponse.json({ error: "Failed to delete project" }, { status: 500 })
  }
}

