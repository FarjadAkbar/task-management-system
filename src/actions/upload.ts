"use server"

import { revalidatePath } from "next/cache"
import { getUser } from "@/lib/get-user"
import { prismadb } from "@/lib/prisma"
import { uploadFileToDrive, deleteFileFromDrive } from "@/lib/google-drive"

export async function uploadFile(formData: FormData) {
  try {
    const user = await getUser()
    if (!user?.id) {
      throw new Error("Unauthorized")
    }

    const file = formData.get("file") as File
    if (!file) {
      return { error: "No file provided" }
    }

    // Get the folder ID if provided
    const folderId = formData.get("folderId") as string

    // Add debug logging
    console.log("Starting file upload:", {
      fileName: file.name,
      fileSize: file.size,
      folderId: folderId || "root folder",
    })

    // Upload file to Google Drive
    const uploadedFile = await uploadFileToDrive(file, folderId)

    // Save file info to database
    const document = await prismadb.documents.create({
      data: {
        document_name: uploadedFile.name,
        key: uploadedFile.id,
        description: "new document",
        document_system_type: "file",
        document_file_url: `https://drive.google.com/uc?export=download&id=${uploadedFile.id}`,
        size: uploadedFile.size,
        document_file_mimeType: uploadedFile.mimeType,
        created_by_user: user.id,
      },
    })

    // If taskId is provided, assign the document to the task
    const taskId = formData.get("taskId") as string
    if (taskId) {
      await prismadb.taskDocument.create({
        data: {
          taskId,
          documentId: document.id,
        },
      })
    }

    revalidatePath("/documents")
    if (taskId) revalidatePath(`/projects/tasks/${taskId}`)

    return {
      success: true,
      file: {
        id: document.id,
        name: uploadedFile.name,
        url: document.document_file_url,
      },
    }
  } catch (error) {
    console.error("Error uploading file:", error)
    return { error: "Failed to upload file" }
  }
}

export async function deleteFile(fileId: string) {
  try {
    const user = await getUser()
    if (!user?.id) {
      throw new Error("Unauthorized")
    }

    // Get the document
    const document = await prismadb.documents.findUnique({
      where: { id: fileId },
    })

    if (!document) {
      return { error: "File not found" }
    }

    // Check if user has permission to delete
    if (document.created_by_user !== user.id && user.role != "ADMIN") {
      return { error: "Not authorized to delete this file" }
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

    revalidatePath("/files")
    return { success: true }
  } catch (error) {
    console.error("Error deleting file:", error)
    return { error: "Failed to delete file" }
  }
}

