import { NextResponse } from "next/server"
import { getUser } from "@/lib/get-user"
import { prismadb } from "@/lib/prisma"

export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const user = await getUser()
    if (!user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = await params
    const projectId = id

    // Check if user has access to the project
    const hasAccess =
      (await prismadb.projectMember.findFirst({
        where: {
          projectId,
          userId: user.id,
        },
      })) ||
      (await prismadb.project.findFirst({
        where: {
          id: projectId,
          createdById: user.id,
        },
      }))

    if (!hasAccess) {
      return NextResponse.json({ error: "Not authorized to view this project" }, { status: 403 })
    }

    // Get boards for this project
    const boards = await prismadb.boards.findMany({
      where: { projectId },
      include: {
        sections: {
          orderBy: {
            position: "asc",
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    })

    return NextResponse.json({ boards })
  } catch (error) {
    console.error("Error fetching project boards:", error)
    return NextResponse.json({ error: "Failed to fetch project boards" }, { status: 500 })
  }
}

export async function POST(req: Request, { params }: { params: { id: string } }) {
  try {
    const user = await getUser()
    if (!user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = await params;
    const projectId = id
    const body = await req.json()

    // Check if user has permission to create boards
    const hasPermission =
      (await prismadb.projectMember.findFirst({
        where: {
          projectId,
          userId: user.id,
          role: { in: ["OWNER", "MANAGER"] },
        },
      })) ||
      (await prismadb.project.findFirst({
        where: {
          id: projectId,
          createdById: user.id,
        },
      }))

    if (!hasPermission) {
      return NextResponse.json({ error: "Not authorized to create boards in this project" }, { status: 403 })
    }

    // Validate required fields
    if (!body.name) {
      return NextResponse.json({ error: "Board name is required" }, { status: 400 })
    }

    // Create board
    const board = await prismadb.boards.create({
      data: {
        name: body.name,
        description: body.description,
        projectId,
        created_by_user: user.id,
      },
    })

    // Create default sections
    const defaultSections = [
      { name: "To Do", color: "#E2E8F0", position: 0 },
      { name: "In Progress", color: "#e5f2ff", position: 1 },
      { name: "Done", color: "#dcffe9", position: 2 },
    ]

    await Promise.all(
      defaultSections.map((section) =>
        prismadb.sections.create({
          data: {
            name: section.name,
            color: section.color,
            position: section.position,
            boardId: board.id,
          },
        }),
      ),
    )

    // Get the board with sections
    const boardWithSections = await prismadb.boards.findUnique({
      where: { id: board.id },
      include: {
        sections: {
          orderBy: {
            position: "asc",
          },
        },
      },
    })

    return NextResponse.json({ board: boardWithSections }, { status: 201 })
  } catch (error) {
    console.error("Error creating board:", error)
    return NextResponse.json({ error: "Failed to create board" }, { status: 500 })
  }
}

