import { NextResponse } from "next/server"
import { getUser } from "@/lib/get-user"
import { prismadb } from "@/lib/prisma"
import { generateProjectReport } from "@/actions/projects"

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

    // Generate project report
    const report = await generateProjectReport(projectId)

    return NextResponse.json({ report })
  } catch (error) {
    console.error("Error generating project report:", error)
    return NextResponse.json({ error: "Failed to generate project report" }, { status: 500 })
  }
}

