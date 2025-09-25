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
      return NextResponse.json({ error: "Not authorized to view tasks in this section" }, { status: 403 })
    }

    // Get tasks for this section
    const tasks = await prismadb.tasks.findMany({
      where: { section: sectionId },
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
        subtasks: true,
        checklists: {
          include: {
            completedBy: {
              select: {
                id: true,
                name: true,
                avatar: true,
              },
            },
          },
        },
        documents: {
          include: {
            document: {
              select: {
                id: true,
                document_name: true,
                document_file_url: true,
                document_file_mimeType: true,
              },
            },
          },
        },
        comments: {
          include: {
            assigned_user: {
              select: {
                id: true,
                name: true,
                avatar: true,
              },
            },
          },
          orderBy: {
            createdAt: "desc",
          },
        },
        assigned_section: true,
      },
      orderBy: {
        position: "asc",
      },
    })

    return NextResponse.json({ tasks })
  } catch (error) {
    console.error("Error fetching section tasks:", error)
    return NextResponse.json({ error: "Failed to fetch section tasks" }, { status: 500 })
  }
}

