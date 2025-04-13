"use server"

import { revalidatePath } from "next/cache"
import { getUser } from "@/lib/get-user"
import { prismadb } from "@/lib/prisma"
import * as z from "zod"
import {
  createFolder,
  uploadFileToDrive,
  deleteFileFromDrive,
  listFilesInFolder,
  shareFileWithUser,
  removeUserAccess,
  moveFile,
  renameFile,
  getFileDetails,
  listPermissions, // Import listPermissions
} from "@/lib/google-drive"

// Root folder ID for the organization
const ROOT_FOLDER_ID = process.env.GOOGLE_DRIVE_ROOT_FOLDER_ID || ""

// Schema for folder creation
const folderSchema = z.object({
  name: z.string().min(1, "Folder name is required"),
  parentId: z.string().optional(),
})

// Schema for file sharing
const shareSchema = z.object({
  fileId: z.string(),
  userId: z.string(),
  permission: z.enum(["view", "edit"]),
})

// Check if user has access to a file or folder
async function hasAccessToFile(userId: string, fileId: string, requireEdit = false): Promise<boolean> {
  const user = await prismadb.users.findUnique({
    where: { id: userId },
  })

  // Admins have full access
  if (user?.role === "ADMIN") {
    return true
  }

  // Check if the file is directly owned by the user
  const ownedFile = await prismadb.documents.findFirst({
    where: {
      key: fileId,
      created_by_user: userId,
    },
  })

  if (ownedFile) {
    return true
  }

  // Check if the file is shared with the user
  const sharedFile = await prismadb.fileShare.findFirst({
    where: {
      fileId: fileId,
      sharedWithId: userId,
      permissions: requireEdit ? "edit" : { in: ["view", "edit"] },
    },
  })

  return !!sharedFile
}

// Create a new folder
export async function createNewFolder(formData: z.infer<typeof folderSchema>) {
  try {
    const user = await getUser()
    if (!user?.id) {
      throw new Error("Unauthorized")
    }

    // Only admins can create folders
    if (user.role !== "ADMIN") {
      return { error: "Only administrators can create folders" }
    }

    // Validate form data
    const validatedFields = folderSchema.safeParse(formData)

    if (!validatedFields.success) {
      return { error: validatedFields.error.flatten().fieldErrors }
    }

    const { name, parentId } = validatedFields.data

    // Create folder in Google Drive
    const folder = await createFolder(name, parentId || ROOT_FOLDER_ID)

    // Save folder info to database
    const document = await prismadb.documents.create({
      data: {
        key: folder.id,
        document_name: folder.name,
        document_file_url: folder.webViewLink || `https://drive.google.com/drive/folders/${folder.id}`,
        document_file_mimeType: "application/vnd.google-apps.folder",
        document_system_type: "folder",
        description: `Folder: ${folder.name}`,
        created_by_user: user.id,
      },
    })

    revalidatePath("/files")
    return { success: true, folder: document }
  } catch (error) {
    console.error("Error creating folder:", error)
    return { error: "Failed to create folder" }
  }
}

// Upload a file
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

    const folderId = formData.get("folderId") as string

    // Check if user has access to the folder
    if (folderId && !(await hasAccessToFile(user.id, folderId, true))) {
      return { error: "You don't have permission to upload to this folder" }
    }

    // Upload file to Google Drive
    const uploadedFile = await uploadFileToDrive(file, folderId || ROOT_FOLDER_ID)

    // Save file info to database
    const document = await prismadb.documents.create({
      data: {
        key: uploadedFile.id,
        document_name: uploadedFile.name,
        document_file_url: uploadedFile.url,
        document_file_mimeType: uploadedFile.mimeType,
        document_system_type: "file",
        size: uploadedFile.size,
        created_by_user: user.id,
      },
    })

    revalidatePath("/files")
    return {
      success: true,
      file: {
        id: document.id,
        name: uploadedFile.name,
        url: uploadedFile.url,
      },
    }
  } catch (error) {
    console.error("Error uploading file:", error)
    return { error: "Failed to upload file" }
  }
}

// List files and folders
export async function listFiles(folderId?: string, query?: string) {
  try {
    const user = await getUser()
    if (!user?.id) {
      throw new Error("Unauthorized")
    }

    const targetFolderId = folderId || ROOT_FOLDER_ID

    // Check if user has access to the folder
    if (targetFolderId !== ROOT_FOLDER_ID && user.role !== "ADMIN") {
      const hasAccess = await hasAccessToFile(user.id, targetFolderId)
      if (!hasAccess) {
        return { error: "You don't have permission to access this folder" }
      }
    }

    // If user is not admin, they can only see root folder if files are shared with them
    if (targetFolderId === ROOT_FOLDER_ID && user.role !== "ADMIN") {
      // Get all files shared with the user
      const sharedFiles = await prismadb.fileShare.findMany({
        where: {
          sharedWithId: user.id,
        },
        include: {
          file: true,
        },
      })

      // Get file details from Google Drive for each shared file
      const fileDetails = await Promise.all(
        sharedFiles.map(async (share) => {
          try {
            const details = await getFileDetails(share.file.key!)
            return {
              id: details.id!,
              name: details.name!,
              mimeType: details.mimeType!,
              size: details.size ? Number(details.size) : undefined,
              webViewLink: details.webViewLink,
              createdTime: details.createdTime,
              modifiedTime: details.modifiedTime,
              dbId: share.file.id,
              permission: share.permissions,
            }
          } catch (error) {
            console.error(`Error getting details for file ${share.file.key}:`, error)
            return null
          }
        }),
      )

      // Filter out any null results
      const validFiles = fileDetails.filter(Boolean)
      return { success: true, files: validFiles }
    }

    // List files from Google Drive
    const files = await listFilesInFolder(targetFolderId, query)

    // Get database records for these files
    const dbFiles = await prismadb.documents.findMany({
      where: {
        key: {
          in: files.map((file) => file.id),
        },
      },
    })

    // Map Google Drive files to include database IDs
    const mappedFiles = await Promise.all(
      files.map(async (file) => {
        const dbFile = dbFiles.find((db) => db.key === file.id);
      
        // If file does not exist in the DB, add it
        if (!dbFile) {
          await prismadb.documents.create({
            data: {
              key: file.id,
              document_name: file.name,
              document_file_url: file.webViewLink || `https://drive.google.com/drive/folders/${file.id}`,
              document_file_mimeType: file.mimeType,
              document_system_type: "folder",
              description: `File: ${file.name}`,
              created_by_user: user.id,
            },
          });
        }
        return {
          ...file,
          dbId: dbFile?.id,
        };
      })
    );

    return { success: true, files: mappedFiles }
  } catch (error) {
    console.error("Error listing files:", error)
    return { error: "Failed to list files" }
  }
}

// Delete a file or folder

export async function deleteFile(fileId: string) {
  try {
    const user = await getUser()
    if (!user?.id) {
      throw new Error("Unauthorized")
    }

    // Get the document
    const document = await prismadb.documents.findFirst({
      where: { key: fileId },
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
      where: { id: document.id },
    })

    // Also delete any task document references
    await prismadb.taskDocument.deleteMany({
      where: {
        documentId: document.id,
      },
    })

    revalidatePath("/files")
    return { success: true }
  } catch (error) {
    console.error("Error deleting file:", error)
    return { error: "Failed to delete file" }
  }
}



// Share a file or folder with a user
export async function shareFile(formData: z.infer<typeof shareSchema>) {
  try {
    const user = await getUser()
    if (!user?.id) {
      throw new Error("Unauthorized")
    }

    // Validate form data
    const validatedFields = shareSchema.safeParse(formData)

    if (!validatedFields.success) {
      return { error: validatedFields.error.flatten().fieldErrors }
    }

    const { fileId, userId, permission } = validatedFields.data

    // Get the document
    const document = await prismadb.documents.findUnique({
      where: { id: fileId },
    })

    if (!document) {
      return { error: "File not found" }
    }

    // Check if user has permission to share
    if (document.created_by_user !== user.id && user.role !== "ADMIN") {
      return { error: "Not authorized to share this file" }
    }

    // Get the user to share with
    const targetUser = await prismadb.users.findUnique({
      where: { id: userId },
    })

    if (!targetUser) {
      return { error: "User not found" }
    }

    // Share in Google Drive
    await shareFileWithUser(document.key!, targetUser.email, permission === "edit" ? "writer" : "reader")

    // Create or update share record in database
    await prismadb.fileShare.upsert({
      where: {
        fileId_sharedWithId: {
          fileId: document.id,
          sharedWithId: userId,
        },
      },
      update: {
        permissions: permission,
      },
      create: {
        fileId: document.id,
        sharedById: user.id,
        sharedWithId: userId,
        permissions: permission,
      },
    })

    revalidatePath("/files")
    return { success: true }
  } catch (error) {
    console.error("Error sharing file:", error)
    return { error: "Failed to share file" }
  }
}

// Remove sharing for a user
export async function removeSharing(shareId: string) {
  try {
    const user = await getUser()
    if (!user?.id) {
      throw new Error("Unauthorized")
    }

    // Get the share record
    const share = await prismadb.fileShare.findUnique({
      where: { id: shareId },
      include: {
        file: true,
      },
    })

    if (!share) {
      return { error: "Share not found" }
    }

    // Check if user has permission to remove sharing
    if (share.sharedById !== user.id && user.role !== "ADMIN") {
      return { error: "Not authorized to remove this sharing" }
    }

    // Get permissions from Google Drive
    const permissions = await listPermissions(share.file.key!)

    // Find the permission for this user
    const targetUser = await prismadb.users.findUnique({
      where: { id: share.sharedWithId },
    })

    if (!targetUser) {
      return { error: "User not found" }
    }

    const permission = permissions.find((p) => p.emailAddress === targetUser.email)

    if (permission) {
      // Remove permission in Google Drive
      await removeUserAccess(share.file.key!, permission.id!)
    }

    // Delete share record from database
    await prismadb.fileShare.delete({
      where: { id: shareId },
    })

    revalidatePath("/files")
    return { success: true }
  } catch (error) {
    console.error("Error removing sharing:", error)
    return { error: "Failed to remove sharing" }
  }
}

// Move a file to a different folder
export async function moveFileToFolder(fileId: string, newFolderId: string) {
  try {
    const user = await getUser()
    if (!user?.id) {
      throw new Error("Unauthorized")
    }

    // Get the document
    const document = await prismadb.documents.findFirst({
      where: { key: fileId },
    })

    if (!document) {
      return { error: "File not found" }
    }

    // Check if user has permission to move
    if (document.created_by_user !== user.id && user.role !== "ADMIN") {
      return { error: "Not authorized to move this file" }
    }

    // Get the target folder
    const targetFolder = await prismadb.documents.findFirst({
      where: {
        key: newFolderId,
        document_file_mimeType: "application/vnd.google-apps.folder",
      },
    })

    if (!targetFolder) {
      return { error: "Target folder not found" }
    }

    // Move file in Google Drive
    await moveFile(fileId, newFolderId)

    revalidatePath("/files")
    return { success: true }
  } catch (error) {
    console.error("Error moving file:", error)
    return { error: "Failed to move file" }
  }
}

// Rename a file or folder
export async function renameFileOrFolder(fileId: string, newName: string) {
  try {
    const user = await getUser()
    if (!user?.id) {
      throw new Error("Unauthorized")
    }

    // Get the document
    const document = await prismadb.documents.findFirst({
      where: { key: fileId },
    })

    if (!document) {
      return { error: "File not found" }
    }

    // Check if user has permission to rename
    if (document.created_by_user !== user.id && user.role !== "ADMIN") {
      return { error: "Not authorized to rename this file" }
    }

    // Rename in Google Drive
    await renameFile(fileId, newName)

    // Update in database
    await prismadb.documents.update({
      where: { id: document.id },
      data: {
        document_name: newName,
      },
    })

    revalidatePath("/files")
    return { success: true }
  } catch (error) {
    console.error("Error renaming file:", error)
    return { error: "Failed to rename file" }
  }
}

// Get users who have access to a file
export async function getFileShares(fileId: string) {
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

    // Check if user has permission to view shares
    if (document.created_by_user !== user.id && user.role !== "ADMIN") {
      return { error: "Not authorized to view shares for this file" }
    }

    // Get shares from database
    const shares = await prismadb.fileShare.findMany({
      where: { fileId },
      include: {
        sharedWith: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true,
            role: true,
          },
        },
      },
    })

    return { success: true, shares }
  } catch (error) {
    console.error("Error getting file shares:", error)
    return { error: "Failed to get file shares" }
  }
}

