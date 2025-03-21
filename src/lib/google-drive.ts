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

// Upload file to Google Drive
export const uploadFileToDrive = async (
  file: File,
  folderId?: string,
): Promise<{ id: string; name: string; url: string; mimeType: string; size: number }> => {
  const drive = initGoogleDriveClient()

  // Convert file to buffer
  const arrayBuffer = await file.arrayBuffer()
  const buffer = Buffer.from(arrayBuffer)

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

  // Make file publicly accessible
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

// Delete file from Google Drive
export const deleteFileFromDrive = async (fileId: string): Promise<void> => {
  const drive = initGoogleDriveClient()
  await drive.files.delete({ fileId })
}

// Get file from Google Drive
export const getFileFromDrive = async (fileId: string) => {
  const drive = initGoogleDriveClient()
  const response = await drive.files.get({
    fileId,
    fields: "id,name,mimeType,size,webViewLink",
  })

  return {
    id: response.data.id!,
    name: response.data.name!,
    url: response.data.webViewLink!,
    mimeType: response.data.mimeType!,
    size: Number(response.data.size!) || 0,
  }
}

