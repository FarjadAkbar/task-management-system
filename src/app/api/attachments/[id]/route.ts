import { NextResponse } from "next/server"
import { getUser } from "@/lib/get-user"
import { prismadb } from "@/lib/prisma"
import { ApiError } from "@/types/type"

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await getUser()
    if (!user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = await params
    const attachmentId = id

    // Check if attachment exists
    const attachment = await prismadb.taskDocument.findUnique({
      where: { id: attachmentId },
      include: {
        task: {
          include: {
            sprint: true,
          },
        },
      },
    })

    if (!attachment) {
      return NextResponse.json({ error: "Attachment not found" }, { status: 404 })
    }

    // Check if user has permission to delete attachment
    // const isUploader = attachment.uploadedBy === user.id
    const isTaskCreator = attachment.task.createdBy === user.id
    const isAssigned = await prismadb.taskAssignee.findFirst({
      where: {
        taskId: attachment.taskId,
        userId: user.id,
      },
    })

    // If task is in a sprint, check project membership
    let hasProjectAccess = false
    if (attachment.task.sprint) {
      const projectMember = await prismadb.projectMember.findFirst({
        where: {
          projectId: attachment.task.sprint.projectId,
          userId: user.id,
        },
      })

      const isProjectCreator = await prismadb.project.findFirst({
        where: {
          id: attachment.task.sprint.projectId,
          createdById: user.id,
        },
      })

      hasProjectAccess = !!projectMember || !!isProjectCreator
    }

    // if (!isUploader && !isTaskCreator && !isAssigned && !hasProjectAccess && user.role !== "ADMIN") {
    //   return NextResponse.json({ error: "Not authorized to delete this attachment" }, { status: 403 })
    // }

    // Delete attachment record
    await prismadb.taskDocument.delete({
      where: { id: attachmentId },
    })

    return NextResponse.json({ success: true })
  } catch (error: unknown) {
    const apiError: ApiError = {
      message: error instanceof Error ? error.message : "An unknown error occurred",
      statusCode: 500,
    };
    console.error("Error deleting attachment:", error)
    return NextResponse.json({ error: apiError.message }, { status: 500 })
  }
}