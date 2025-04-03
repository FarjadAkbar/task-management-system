import { NextResponse } from "next/server"
import { getUser } from "@/lib/get-user"
import { prismadb } from "@/lib/prisma"
import { getProjectWithStats } from "@/actions/projects"
import { ProjectRole } from "@prisma/client"

export async function GET(req: Request) {
  try {
    const user = await getUser()
    if (!user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get projects where user is a member or creator
    const projects = await prismadb.project.findMany({
      where: {
        OR: [{ createdById: user.id }, { members: { some: { userId: user.id } } }],
      },
      orderBy: {
        updatedAt: "desc",
      },
    })

    // Get stats for each project
    const projectsWithStats = await Promise.all(
      projects.map(async (project) => {
        return getProjectWithStats(project.id)
      }),
    )

    return NextResponse.json({ projects: projectsWithStats })
  } catch (error) {
    console.error("Error fetching projects:", error)
    return NextResponse.json({ error: "Failed to fetch projects" }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const user = await getUser()
    if (!user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await req.json()

    // Validate required fields
    if (!body.name || !body.startDate) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Create project
    const project = await prismadb.project.create({
      data: {
        name: body.name,
        description: body.description,
        startDate: new Date(body.startDate),
        endDate: body.endDate ? new Date(body.endDate) : null,
        status: body.status || "PLANNING",
        createdById: user.id,
      },
    })

    // Add creator as owner
    await prismadb.projectMember.create({
      data: {
        projectId: project.id,
        userId: user.id,
        role: "OWNER",
      },
    })

    // Add additional members if provided
    if (body.members && Array.isArray(body.members)) {
      await Promise.all(
        body.members.map(async (member: { userId: string; role: string }) => {
          if (member.userId !== user.id) {
            return prismadb.projectMember.create({
              data: {
                projectId: project.id,
                userId: member.userId,
                role: member.role as ProjectRole || ProjectRole.MEMBER,
              },
            })
          }
        }),
      )
    }

    return NextResponse.json({ project }, { status: 201 })
  } catch (error) {
    console.error("Error creating project:", error)
    return NextResponse.json({ error: "Failed to create project" }, { status: 500 })
  }
}

