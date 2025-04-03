import { google } from "googleapis"
import { JWT } from "google-auth-library"
import { Readable } from "stream"
import { prismadb } from "./prisma"
import fs from 'fs'
import readline from 'readline'

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





// // Recursive function to list all files and folders
// const SCOPES = ["https://www.googleapis.com/auth/drive"];

// const authorize = async () => {
//   const credentials = JSON.parse(fs.readFileSync("credentials.json", "utf8"));
//   const { client_secret, client_id, redirect_uris } = credentials.web;
//   const oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);

//   // Check if token already exists
//   if (fs.existsSync("token.json")) {
//     oAuth2Client.setCredentials(JSON.parse(fs.readFileSync("token.json", "utf8")));
//     return oAuth2Client;
//   }

//   // Generate new token
//   const authUrl = oAuth2Client.generateAuthUrl({
//     access_type: "offline",
//     scope: SCOPES,
//   });

//   console.log("Authorize this app by visiting:", authUrl);

//   const rl = readline.createInterface({
//     input: process.stdin,
//     output: process.stdout,
//   });

//   return new Promise((resolve) => {
//     rl.question("Enter the code from that page: ", async (code) => {
//       rl.close();
//       const { tokens } = await oAuth2Client.getToken(code);
//       oAuth2Client.setCredentials(tokens);
//       fs.writeFileSync("token.json", JSON.stringify(tokens));
//       resolve(oAuth2Client);
//     });
//   });
// };

// const listAllFiles = async (folderId = "root") => {
//   let files: any[] = [];
//   let nextPageToken: string | undefined;


//   const auth = await authorize();
//   const drive = google.drive({ version: "v3", auth });

//   // do {
//     const response = await drive.files.list({
//       q: `'${folderId}' in parents and trashed = false`,
//       fields: "nextPageToken, files(id, name, mimeType, size, modifiedTime, parents, webViewLink)",
//       pageSize: 1000,
//       pageToken: nextPageToken,
//     });

//     files.push(...(response.data.files || []));
//   //   nextPageToken = response.data.nextPageToken;
//   // } while (nextPageToken);

//   // Recurse for subfolders
//   for (const file of files.filter((f) => f.mimeType === "application/vnd.google-apps.folder")) {
//     const subFiles = await listAllFiles(file.id);
//     files.push(...subFiles);
//   }

//   return files;
// };

// // Sync Google Drive data with Prisma Database
// export const syncGoogleDrive = async () => {
//   console.log("Starting Google Drive Sync...");

//   // Fetch all Google Drive files recursively from root
//   const googleDriveFiles = await listAllFiles();
// console.log(googleDriveFiles, "googleDriveFiles")
//   // Fetch all documents from database
//   // const dbDocuments = await prismadb.documents.findMany({
//   //   select: { id: true, key: true },
//   // });

//   // const dbDocumentMap = new Map(dbDocuments.map((doc) => [doc.key, doc.id]));

//   // Add or Update Files
//   // for (const file of googleDriveFiles) {
//   //   const existingDocumentId = dbDocumentMap.get(file.id);

//   //   if (existingDocumentId) {
//   //     // Update if modified
//   //     await prismadb.documents.update({
//   //       where: { id: existingDocumentId },
//   //       data: {
//   //         document_name: file.name,
//   //         document_file_url: file.webViewLink,
//   //         document_file_mimeType: file.mimeType,
//   //         size: file.size ? parseInt(file.size) : null,
//   //         updatedAt: new Date(file.modifiedTime),
//   //       },
//   //     });
//   //   } else {
//   //     // Create new entry if not present
//   //     await prismadb.documents.create({
//   //       data: {
//   //         key: file.id,
//   //         document_name: file.name,
//   //         document_file_url: file.webViewLink,
//   //         document_file_mimeType: file.mimeType,
//   //         size: file.size ? parseInt(file.size) : null,
//   //         created_by_user: '67d53b5ea300b60892f4f664',
//   //       },
//   //     });
//   //   }
//   // }

//   // // Delete Files not in Google Drive
//   // for (const { id, key } of dbDocuments) {
//   //   if (!googleDriveFiles.find((file) => file.id === key)) {
//   //     await prismadb.documents.delete({ where: { id } });
//   //     console.log(`Deleted Document: ${id}`);
//   //   }
//   // }

//   console.log("Google Drive Sync Completed.");
// };