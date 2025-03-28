import { NextResponse } from "next/server"
import { getUser } from "@/lib/get-user"
import { prismadb } from "@/lib/prisma"

export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const user = await getUser()
    if (!user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const boardId = params.id

    // Get board with sections
    const board = await prismadb.boards.findUnique({
      where: { id: boardId },
      include: {
        sections: {
          orderBy: {
            position: "asc",
          },
        },
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

    if (!board) {
      return NextResponse.json({ error: "Board not found" }, { status: 404 })
    }

    // Check if user has access to the project
    const hasAccess =
      (board.project?.members && board.project.members.length > 0) ||
      (await prismadb.project.findFirst({
        where: {
          id: board.projectId || "",
          createdById: user.id,
        },
      })) ||
      board.created_by_user === user.id

    if (!hasAccess) {
      return NextResponse.json({ error: "Not authorized to view this board" }, { status: 403 })
    }

    return NextResponse.json({ board })
  } catch (error) {
    console.error("Error fetching board:", error)
    return NextResponse.json({ error: "Failed to fetch board" }, { status: 500 })
  }
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    const user = await getUser()
    if (!user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const boardId = params.id
    const body = await req.json()

    // Get board
    const board = await prismadb.boards.findUnique({
      where: { id: boardId },
      include: {
        project: true,
      },
    })

    if (!board) {
      return NextResponse.json({ error: "Board not found" }, { status: 404 })
    }

    // Check if user has permission to update the board
    const hasPermission =
      board.created_by_user === user.id ||
      (board.projectId &&
        (await prismadb.projectMember.findFirst({
          where: {
            projectId: board.projectId,
            userId: user.id,
            role: { in: ["OWNER", "MANAGER"] },
          },
        }))) ||
      (board.projectId &&
        (await prismadb.project.findFirst({
          where: {
            id: board.projectId,
            createdById: user.id,
          },
        })))

    if (!hasPermission) {
      return NextResponse.json({ error: "Not authorized to update this board" }, { status: 403 })
    }

    // Update board
    const updateData: any = {}
    if (body.name) updateData.name = body.name
    if (body.description !== undefined) updateData.description = body.description

    const updatedBoard = await prismadb.boards.update({
      where: { id: boardId },
      data: updateData,
    })

    return NextResponse.json({ board: updatedBoard })
  } catch (error) {
    console.error("Error updating board:", error)
    return NextResponse.json({ error: "Failed to update board" }, { status: 500 })
  }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    const user = await getUser()
    if (!user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const boardId = params.id

    // Get board
    const board = await prismadb.boards.findUnique({
      where: { id: boardId },
      include: {
        project: true,
      },
    })

    if (!board) {
      return NextResponse.json({ error: "Board not found" }, { status: 404 })
    }

    // Check if user has permission to delete the board
    const hasPermission =
      board.created_by_user === user.id ||
      (board.projectId &&
        (await prismadb.projectMember.findFirst({
          where: {
            projectId: board.projectId,
            userId: user.id,
            role: { in: ["OWNER", "MANAGER"] },
          },
        }))) ||
      (board.projectId &&
        (await prismadb.project.findFirst({
          where: {
            id: board.projectId,
            createdById: user.id,
          },
        })))

    if (!hasPermission) {
      return NextResponse.json({ error: "Not authorized to delete this board" }, { status: 403 })
    }

    // Delete board (cascade will delete sections)
    await prismadb.boards.delete({
      where: { id: boardId },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting board:", error)
    return NextResponse.json({ error: "Failed to delete board" }, { status: 500 })
  }
}

