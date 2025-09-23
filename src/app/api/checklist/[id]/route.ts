import { NextResponse } from "next/server"
import { getUser } from "@/lib/get-user"
import { prismadb } from "@/lib/prisma"

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await getUser()
    if (!user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = await params;
    const checklistItemId = id
    const body = await req.json()

    // Check if checklist item exists
    const checklistItem = await prismadb.checklistItem.findUnique({
      where: { id: checklistItemId },
      include: {
        task: {
          include: {
            sprint: true,
          },
        },
      },
    })

    if (!checklistItem) {
      return NextResponse.json({ error: "Checklist item not found" }, { status: 404 })
    }

    // Check if user has permission to update checklist item
    const isCreator = checklistItem.createdById === user.id || checklistItem.task.createdBy === user.id
    const isAssigned = await prismadb.taskAssignee.findFirst({
      where: {
        taskId: checklistItem.taskId,
        userId: user.id,
      },
    })

    // If task is in a sprint, check project membership
    let hasProjectAccess = false
    if (checklistItem.task.sprint) {
      const projectMember = await prismadb.projectMember.findFirst({
        where: {
          projectId: checklistItem.task.sprint.projectId,
          userId: user.id,
        },
      })

      const isProjectCreator = await prismadb.project.findFirst({
        where: {
          id: checklistItem.task.sprint.projectId,
          createdById: user.id,
        },
      })

      hasProjectAccess = !!projectMember || !!isProjectCreator
    }

    if (!isCreator && !isAssigned && !hasProjectAccess && user.role !== "ADMIN") {
      return NextResponse.json({ error: "Not authorized to update this checklist item" }, { status: 403 })
    }

    // Update checklist item
    const updatedChecklistItem = await prismadb.checklistItem.update({
      where: { id: checklistItemId },
      data: {
        title: body.title !== undefined ? body.title : checklistItem.title,
        completed: body.completed !== undefined ? body.completed : checklistItem.completed,
      },
    })

    return NextResponse.json({ checklistItem: updatedChecklistItem })
  } catch (error) {
    console.error("Error updating checklist item:", error)
    return NextResponse.json({ error: "Failed to update checklist item" }, { status: 500 })
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await getUser()
    if (!user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = await params;
    const checklistItemId = id

    // Check if checklist item exists
    const checklistItem = await prismadb.checklistItem.findUnique({
      where: { id: checklistItemId },
      include: {
        task: {
          include: {
            sprint: true,
          },
        },
      },
    })

    if (!checklistItem) {
      return NextResponse.json({ error: "Checklist item not found" }, { status: 404 })
    }

    // Check if user has permission to delete checklist item
    const isCreator = checklistItem.createdById === user.id || checklistItem.task.createdBy === user.id
    const isAssigned = await prismadb.taskAssignee.findFirst({
      where: {
        taskId: checklistItem.taskId,
        userId: user.id,
      },
    })

    // If task is in a sprint, check project membership
    let hasProjectAccess = false
    if (checklistItem.task.sprint) {
      const projectMember = await prismadb.projectMember.findFirst({
        where: {
          projectId: checklistItem.task.sprint.projectId,
          userId: user.id,
        },
      })

      const isProjectCreator = await prismadb.project.findFirst({
        where: {
          id: checklistItem.task.sprint.projectId,
          createdById: user.id,
        },
      })

      hasProjectAccess = !!projectMember || !!isProjectCreator
    }

    if (!isCreator && !isAssigned && !hasProjectAccess && user.role !== "ADMIN") {
      return NextResponse.json({ error: "Not authorized to delete this checklist item" }, { status: 403 })
    }

    // Delete checklist item
    await prismadb.checklistItem.delete({
      where: { id: checklistItemId },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting checklist item:", error)
    return NextResponse.json({ error: "Failed to delete checklist item" }, { status: 500 })
  }
}

