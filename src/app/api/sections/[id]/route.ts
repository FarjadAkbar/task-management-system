import { NextResponse } from "next/server"
import { getUser } from "@/lib/get-user"
import { prismadb } from "@/lib/prisma"

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await getUser()
    if (!user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = await params
    const sectionId = id

    // Get section with board info
    const section = await prismadb.sections.findUnique({
      where: { id: sectionId },
      include: {
        board: {
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
        },
      },
    })

    if (!section) {
      return NextResponse.json({ error: "Section not found" }, { status: 404 })
    }

    // Check if user has access to the board
    const hasAccess =
      section.board.created_by_user === user.id ||
      (section.board.project?.members && section.board.project.members.length > 0) ||
      (section.board.projectId &&
        (await prismadb.project.findFirst({
          where: {
            id: section.board.projectId,
            createdById: user.id,
          },
        })))

    if (!hasAccess) {
      return NextResponse.json({ error: "Not authorized to view this section" }, { status: 403 })
    }

    return NextResponse.json({ section })
  } catch (error) {
    console.error("Error fetching section:", error)
    return NextResponse.json({ error: "Failed to fetch section" }, { status: 500 })
  }
}

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await getUser()
    if (!user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = await params
    const sectionId = id
    const body = await req.json()

    // Get section with board info
    const section = await prismadb.sections.findUnique({
      where: { id: sectionId },
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

    // Check if user has permission to update the section
    const hasPermission =
      section.board.created_by_user === user.id ||
      (section.board.projectId &&
        (await prismadb.projectMember.findFirst({
          where: {
            projectId: section.board.projectId,
            userId: user.id,
            role: { in: ["OWNER", "MANAGER"] },
          },
        }))) ||
      (section.board.projectId &&
        (await prismadb.project.findFirst({
          where: {
            id: section.board.projectId,
            createdById: user.id,
          },
        })))

    if (!hasPermission) {
      return NextResponse.json({ error: "Not authorized to update this section" }, { status: 403 })
    }

    // Update section
    const updateData: any = {}
    if (body.name) updateData.name = body.name
    if (body.color) updateData.color = body.color
    if (body.position !== undefined) updateData.position = body.position

    const updatedSection = await prismadb.sections.update({
      where: { id: sectionId },
      data: updateData,
    })

    return NextResponse.json({ section: updatedSection })
  } catch (error) {
    console.error("Error updating section:", error)
    return NextResponse.json({ error: "Failed to update section" }, { status: 500 })
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await getUser()
    if (!user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = await params
    const sectionId = id

    // Get section with board info
    const section = await prismadb.sections.findUnique({
      where: { id: sectionId },
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

    // Check if user has permission to delete the section
    const hasPermission =
      section.board.created_by_user === user.id ||
      (section.board.projectId &&
        (await prismadb.projectMember.findFirst({
          where: {
            projectId: section.board.projectId,
            userId: user.id,
            role: { in: ["OWNER", "MANAGER"] },
          },
        }))) ||
      (section.board.projectId &&
        (await prismadb.project.findFirst({
          where: {
            id: section.board.projectId,
            createdById: user.id,
          },
        })))

    if (!hasPermission) {
      return NextResponse.json({ error: "Not authorized to delete this section" }, { status: 403 })
    }

    // Delete section
    await prismadb.sections.delete({
      where: { id: sectionId },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting section:", error)
    return NextResponse.json({ error: "Failed to delete section" }, { status: 500 })
  }
}

