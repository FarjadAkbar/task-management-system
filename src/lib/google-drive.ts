import { google } from "googleapis"
import { JWT } from "google-auth-library"
import { Readable } from "stream"

// Initialize Google Drive client
const initGoogleDriveClient = () => {
  const credentials = {
    client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
    private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
    client_id: process.env.GOOGLE_CLIENT_ID,
  }

  const auth = new JWT({
    email: credentials.client_email,
    key: credentials.private_key,
    scopes: ["https://www.googleapis.com/auth/drive"],
  })

  return google.drive({ version: "v3", auth })
}

// Create a folder in Google Drive
export const createFolder = async (
  folderName: string,
  parentFolderId?: string,
): Promise<{ id: string; name: string }> => {
  const drive = initGoogleDriveClient()

  const fileMetadata = {
    name: folderName,
    mimeType: "application/vnd.google-apps.folder",
    parents: parentFolderId ? [parentFolderId] : undefined,
  }

  const response = await drive.files.create({
    requestBody: fileMetadata,
    fields: "id,name",
  })

  return {
    id: response.data.id!,
    name: response.data.name!,
  }
}

// List files and folders in a folder
export const listFilesInFolder = async (
  folderId: string,
  query?: string,
): Promise<
  Array<{
    id: string
    name: string
    mimeType: string
    size?: number
    webViewLink?: string
    thumbnailLink?: string
    createdTime?: string
    modifiedTime?: string
  }>
> => {
  const drive = initGoogleDriveClient()

  console.log(folderId, "folder....");
  let q = 'trashed = false';

  if(folderId){
    q = `'${folderId}' in parents and trashed = false`
  }
  if (query) {
    q += ` and name contains '${query}'`
  }
  // console.log(q, "query");

  const response = await drive.files.list({
    q,
    fields: "files(id, name, mimeType, size, webViewLink, thumbnailLink, createdTime, modifiedTime)",
    orderBy: "modifiedTime desc",
  })
  return response.data.files || []
}

// Get file or folder details
export const getFileDetails = async (fileId: string) => {
  const drive = initGoogleDriveClient()

  const response = await drive.files.get({
    fileId,
    fields: "id, name, mimeType, size, webViewLink, thumbnailLink, createdTime, modifiedTime, parents",
  })

  return response.data
}

// Upload file to Google Drive
export const uploadFileToDrive = async (
  file: File,
  folderId?: string,
): Promise<{ id: string; name: string; url: string; mimeType: string; size: number }> => {
  const drive = initGoogleDriveClient()

  // Convert file to buffer
  const arrayBuffer = await file.arrayBuffer()
  const buffer = Buffer.from(arrayBuffer)

  console.log(folderId, "folderId");
  // Create file metadata
  const fileMetadata = {
    name: file.name,
    parents: folderId ? [folderId] : undefined,
  }

  // Create media
  const media = {
    mimeType: file.type || "application/octet-stream",
    body: Readable.from(buffer),
  }

  // Upload file
  const response = await drive.files.create({
    requestBody: fileMetadata,
    media: media,
    fields: "id,name,mimeType,size,webViewLink",
  })

  // Make file publicly accessible for viewing
  await drive.permissions.create({
    fileId: response.data.id!,
    requestBody: {
      role: "reader",
      type: "anyone",
    },
  })

  // Get updated file with webViewLink
  const file_data = await drive.files.get({
    fileId: response.data.id!,
    fields: "id,name,mimeType,size,webViewLink",
  })

  return {
    id: file_data.data.id!,
    name: file_data.data.name!,
    url: file_data.data.webViewLink!,
    mimeType: file_data.data.mimeType!,
    size: Number(file_data.data.size!) || 0,
  }
}

// Delete file or folder from Google Drive
export const deleteFileFromDrive = async (fileId: string): Promise<void> => {
  const drive = initGoogleDriveClient()
  await drive.files.delete({ fileId })
}

// Share a file or folder with a specific user
export const shareFileWithUser = async (
  fileId: string,
  email: string,
  role: "reader" | "writer" | "commenter" = "reader",
): Promise<void> => {
  const drive = initGoogleDriveClient()

  await drive.permissions.create({
    fileId,
    requestBody: {
      type: "user",
      role,
      emailAddress: email,
    },
  })
}

// Remove sharing for a specific user
export const removeUserAccess = async (fileId: string, permissionId: string): Promise<void> => {
  const drive = initGoogleDriveClient()

  await drive.permissions.delete({
    fileId,
    permissionId,
  })
}

// List permissions for a file or folder
export const listPermissions = async (fileId: string) => {
  const drive = initGoogleDriveClient()

  const response = await drive.permissions.list({
    fileId,
    fields: "permissions(id, type, emailAddress, role)",
  })

  return response.data.permissions || []
}

// Move a file to a different folder
export const moveFile = async (fileId: string, newFolderId: string, oldFolderId?: string): Promise<void> => {
  const drive = initGoogleDriveClient()

  // First get the file to check its current parents
  const file = await drive.files.get({
    fileId,
    fields: "parents",
  })

  // Remove from old folder and add to new folder
  await drive.files.update({
    fileId,
    removeParents: oldFolderId || file.data.parents?.join(","),
    addParents: newFolderId,
  })
}

// Rename a file or folder
export const renameFile = async (fileId: string, newName: string): Promise<void> => {
  const drive = initGoogleDriveClient()

  await drive.files.update({
    fileId,
    requestBody: {
      name: newName,
    },
  })
}

