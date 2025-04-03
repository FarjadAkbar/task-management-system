import { NextResponse } from "next/server"
import { getUser } from "@/lib/get-user"
import { prismadb } from "@/lib/prisma"

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  try {
    const user = await getUser()
    if (!user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = await params;
    const commentId = id
    const body = await req.json()

    // Validate required fields
    if (!body.comment) {
      return NextResponse.json({ error: "Comment content is required" }, { status: 400 })
    }

    // Check if comment exists
    const comment = await prismadb.tasksComments.findUnique({
      where: { id: commentId },
      include: {
        task: {
          include: {
            sprint: true,
          },
        },
      },
    })

    if (!comment) {
      return NextResponse.json({ error: "Comment not found" }, { status: 404 })
    }

    // Check if user is the comment author
    if (comment.userId !== user.id && user.role !== "ADMIN") {
      return NextResponse.json({ error: "Not authorized to edit this comment" }, { status: 403 })
    }

    // Update comment
    const updatedComment = await prismadb.tasksComments.update({
      where: { id: commentId },
      data: {
        comment: body.comment,
        updatedAt: new Date(),
      },
      include: {
        assigned_user: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true,
          },
        },
      },
    })

    return NextResponse.json({ comment: updatedComment })
  } catch (error) {
    console.error("Error updating comment:", error)
    return NextResponse.json({ error: "Failed to update comment" }, { status: 500 })
  }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    const user = await getUser()
    if (!user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = await params;
    const commentId = id

    // Check if comment exists
    const comment = await prismadb.tasksComments.findUnique({
      where: { id: commentId },
      include: {
        task: true,
      },
    })

    if (!comment) {
      return NextResponse.json({ error: "Comment not found" }, { status: 404 })
    }

    // Check if user is the comment author or task creator or admin
    if (comment.userId !== user.id && comment.task.createdBy !== user.id && user.role !== "ADMIN") {
      return NextResponse.json({ error: "Not authorized to delete this comment" }, { status: 403 })
    }

    // Delete comment
    await prismadb.tasksComments.delete({
      where: { id: commentId },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting comment:", error)
    return NextResponse.json({ error: "Failed to delete comment" }, { status: 500 })
  }
}

