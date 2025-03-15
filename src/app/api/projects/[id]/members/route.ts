import { NextResponse } from "next/server"
import { getUser } from "@/lib/get-user"
import { prismadb } from "@/lib/prisma"

export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const user = await getUser()
    if (!user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const projectId = params.id

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

    // Get project members
    const members = await prismadb.projectMember.findMany({
      where: { projectId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true,
            role: true,
          },
        },
      },
      orderBy: {
        joinedAt: "asc",
      },
    })

    return NextResponse.json({ members })
  } catch (error) {
    console.error("Error fetching project members:", error)
    return NextResponse.json({ error: "Failed to fetch project members" }, { status: 500 })
  }
}

export async function POST(req: Request, { params }: { params: { id: string } }) {
  try {
    const user = await getUser()
    if (!user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const projectId = params.id
    const body = await req.json()

    // Check if user has permission to add members
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
      return NextResponse.json({ error: "Not authorized to add members to this project" }, { status: 403 })
    }

    // Validate required fields
    if (!body.userId) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 })
    }

    // Check if member already exists
    const existingMember = await prismadb.projectMember.findFirst({
      where: {
        projectId,
        userId: body.userId,
      },
    })

    if (existingMember) {
      return NextResponse.json({ error: "User is already a member of this project" }, { status: 400 })
    }

    // Add member
    const member = await prismadb.projectMember.create({
      data: {
        projectId,
        userId: body.userId,
        role: body.role || "MEMBER",
      },
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
    })

    return NextResponse.json({ member }, { status: 201 })
  } catch (error) {
    console.error("Error adding project member:", error)
    return NextResponse.json({ error: "Failed to add project member" }, { status: 500 })
  }
}

