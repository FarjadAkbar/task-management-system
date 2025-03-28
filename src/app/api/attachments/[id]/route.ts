// import { NextResponse } from "next/server"
// import { getUser } from "@/lib/auth"
// import { prisma } from "@/lib/prismadb"
// import { del } from "@vercel/blob"

// export async function DELETE(req: Request, { params }: { params: { id: string } }) {
//   try {
//     const user = await getUser()
//     if (!user?.id) {
//       return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
//     }

//     const attachmentId = params.id

//     // Check if attachment exists
//     const attachment = await prisma.taskDocument.findUnique({
//       where: { id: attachmentId },
//       include: {
//         task: {
//           include: {
//             sprint: true,
//           },
//         },
//       },
//     })

//     if (!attachment) {
//       return NextResponse.json({ error: "Attachment not found" }, { status: 404 })
//     }

//     // Check if user has permission to delete attachment
//     const isUploader = attachment.uploadedBy === user.id
//     const isTaskCreator = attachment.task.createdBy === user.id
//     const isAssigned = await prisma.taskAssignee.findFirst({
//       where: {
//         taskId: attachment.taskId,
//         userId: user.id,
//       },
//     })

//     // If task is in a sprint, check project membership
//     let hasProjectAccess = false
//     if (attachment.task.sprint) {
//       const projectMember = await prisma.projectMember.findFirst({
//         where: {
//           projectId: attachment.task.sprint.projectId,
//           userId: user.id,
//         },
//       })

//       const isProjectCreator = await prisma.project.findFirst({
//         where: {
//           id: attachment.task.sprint.projectId,
//           createdById: user.id,
//         },
//       })

//       hasProjectAccess = !!projectMember || !!isProjectCreator
//     }

//     if (!isUploader && !isTaskCreator && !isAssigned && !hasProjectAccess && !user.is_admin) {
//       return NextResponse.json({ error: "Not authorized to delete this attachment" }, { status: 403 })
//     }

//     // Delete file from Vercel Blob
//     if (attachment.url) {
//       try {
//         await del(attachment.url)
//       } catch (error) {
//         console.error("Error deleting file from storage:", error)
//       }
//     }

//     // Delete attachment record
//     await prisma.taskDocument.delete({
//       where: { id: attachmentId },
//     })

//     return NextResponse.json({ success: true })
//   } catch (error) {
//     console.error("Error deleting attachment:", error)
//     return NextResponse.json({ error: "Failed to delete attachment" }, { status: 500 })
//   }
// }

