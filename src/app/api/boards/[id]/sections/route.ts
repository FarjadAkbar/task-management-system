import { NextResponse } from "next/server"
import { getUser } from "@/lib/get-user"
import { prismadb } from "@/lib/prisma"

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await getUser()
    if (!user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = await params;
    const boardId = id

    // Get board to check permissions
    const board = await prismadb.boards.findUnique({
      where: { id: boardId },
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

    if (!board) {
      return NextResponse.json({ error: "Board not found" }, { status: 404 })
    }

    // Check if user has access to the board
    const hasAccess =
      board.created_by_user === user.id ||
      (board.project?.members && board.project.members.length > 0) ||
      (board.projectId &&
        (await prismadb.project.findFirst({
          where: {
            id: board.projectId,
            createdById: user.id,
          },
        })))

    if (!hasAccess) {
      return NextResponse.json({ error: "Not authorized to view this board" }, { status: 403 })
    }

    // Get sections
    const sections = await prismadb.sections.findMany({
      where: { boardId },
      orderBy: {
        position: "asc",
      },
    })

    return NextResponse.json({ sections })
  } catch (error) {
    console.error("Error fetching sections:", error)
    return NextResponse.json({ error: "Failed to fetch sections" }, { status: 500 })
  }
}

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await getUser()
    if (!user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = await params;
    const boardId = id
    const body = await req.json()

    // Get board to check permissions
    const board = await prismadb.boards.findUnique({
      where: { id: boardId },
      include: {
        project: true,
      },
    })

    if (!board) {
      return NextResponse.json({ error: "Board not found" }, { status: 404 })
    }

    // Check if user has permission to add sections
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
      return NextResponse.json({ error: "Not authorized to add sections to this board" }, { status: 403 })
    }

    // Validate required fields
    if (!body.name) {
      return NextResponse.json({ error: "Section name is required" }, { status: 400 })
    }

    // Get the highest position
    const highestPosition = await prismadb.sections.findFirst({
      where: { boardId },
      orderBy: {
        position: "desc",
      },
      select: {
        position: true,
      },
    })

    const position = body.position !== undefined ? body.position : (highestPosition?.position || 0) + 1

    // Create section
    const section = await prismadb.sections.create({
      data: {
        name: body.name,
        color: body.color || "#E2E8F0", // Default color
        position,
        boardId,
      },
    })

    return NextResponse.json({ section }, { status: 201 })
  } catch (error) {
    console.error("Error creating section:", error)
    return NextResponse.json({ error: "Failed to create section" }, { status: 500 })
  }
}

