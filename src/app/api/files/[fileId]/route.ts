import { type NextRequest, NextResponse } from "next/server"
import { getUser } from "@/lib/get-user"
import { prismadb } from "@/lib/prisma"
import { deleteFileFromDrive } from "@/lib/google-drive"

export async function POST(req: NextRequest, { params }: { params: { fileId: string } }) {
  try {
    const admin = await getUser()
    if (!admin?.id || admin.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    const { fileId } = await params;

    if (!fileId) {
      return NextResponse.json({ error: "File ID is required" }, { status: 400 })
    }
    const body = await req.json();
    const userId = body.userId;
    const permission = "edit";

    if (!userId) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 })
    }

    await prismadb.users.update({
      where: { id: userId },
      data: { folderId: fileId },
    });

    await prismadb.fileShare.upsert({
          where: {
            fileId_sharedWithId: {
              fileId: fileId,
              sharedWithId: userId,
            },
          },
          update: {
            permissions: permission,
          },
          create: {
            fileId: fileId,
            sharedById: admin.id,
            sharedWithId: userId,
            permissions: permission,
          },
        })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting file:", error.message)
    return NextResponse.json({ error: "Failed to assign folder" }, { status: 500 })
  }  
}

export async function DELETE(req: NextRequest, { params }: { params: { fileId: string } }) {
  try {
    const user = await getUser()
    if (!user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { fileId } = await params;

    if (!fileId) {
      return NextResponse.json({ error: "File ID is required" }, { status: 400 })
    }

    // Get the document
    const document = await prismadb.documents.findUnique({
      where: { id: fileId },
    })

    if (!document) {
      return NextResponse.json({ error: "File not found" }, { status: 404 })
    }

    // Check if user has permission to delete
    if (document.created_by_user !== user.id && user.role !== "ADMIN") {
      return NextResponse.json({ error: "Not authorized to delete this file" }, { status: 403 })
    }

    // Delete from Google Drive
    await deleteFileFromDrive(document.key)

    // Delete from database
    await prismadb.documents.delete({
      where: { id: fileId },
    })

    // Also delete any task document references
    await prismadb.taskDocument.deleteMany({
      where: {
        documentId: fileId,
      },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting file:", error)
    return NextResponse.json({ error: "Failed to delete file" }, { status: 500 })
  }
}

