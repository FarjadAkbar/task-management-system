import { NextResponse } from "next/server"
import { getUser } from "@/lib/get-user"
import { prismadb } from "@/lib/prisma"
import { getMemberContribution } from "@/actions/projects"

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

    // Get member contributions
    const contributions = await getMemberContribution(projectId)

    return NextResponse.json({ contributions })
  } catch (error) {
    console.error("Error fetching project contributions:", error)
    return NextResponse.json({ error: "Failed to fetch project contributions" }, { status: 500 })
  }
}

