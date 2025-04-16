import { NextResponse } from "next/server"
import { prismadb } from "@/lib/prisma";
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

// GET: Fetch a specific chat room with messages
export async function GET(req: Request, props: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const userId = session.user.id
    const params = await props.params;

    if (!params.id) {
      return new NextResponse("Missing id", { status: 400 });
    }

    const roomId = params.id;

    // Get the chat room
    const room = await prismadb.chatRoom.findUnique({
      where: { id: roomId },
      include: {
        participants: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
                avatar: true,
                role: true,
              },
            },
          },
        },
      },
    })

    if (!room) {
      return NextResponse.json({ message: "Chat room not found" }, { status: 404 })
    }

    // Check if the user is a participant
    const isParticipant = room.participants.some((p) => p.userId === userId)

    if (!isParticipant) {
      return NextResponse.json({ message: "You are not a participant in this chat room" }, { status: 403 })
    }

    // Get messages for the room
    const { searchParams } = new URL(req.url)
    const limit = Number.parseInt(searchParams.get("limit") || "50")
    const before = searchParams.get("before")

    const messages = await prismadb.chatMessage.findMany({
      where: {
        roomId,
        ...(before ? { createdAt: { lt: new Date(before) } } : {}),
      },
      include: {
        attachments: {
          include: {
            document: true,
          },
        },
        sender: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
      take: limit,
    })

    // Mark messages as read
    await prismadb.chatMessage.updateMany({
      where: {
        roomId,
        senderId: { not: userId },
        isRead: false,
      },
      data: {
        isRead: true,
      },
    })

    // Reset unread count for this user
    await prismadb.chatParticipant.updateMany({
      where: {
        roomId,
        userId,
      },
      data: {
        unreadCount: 0,
        lastSeen: new Date(),
      },
    })

    // Get the room name (for direct messages, use the other user's name)
    let roomName = room.name
    if (!room.isGroup && !roomName) {
      const otherParticipant = room.participants.find((p) => p.userId !== userId)
      if (otherParticipant) {
        roomName = otherParticipant.user.name || otherParticipant.user.email
      }
    }

    return NextResponse.json(
      {
        message: "Success",
        room: {
          id: room.id,
          name: roomName,
          isGroup: room.isGroup,
          participants: room.participants.map((p) => p.user),
          messages: messages.reverse(), // Return in chronological order
          createdBy: room.createdBy,
        },
      },
      { status: 200 },
    )
  } catch (error) {
    console.error("Error fetching chat room:", error)
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 })
  }
}



// POST: Leave a chat room
export async function POST(req: Request, props: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const userId = session.user.id
    const params = await props.params;

    if (!params.id) {
      return new NextResponse("Missing id", { status: 400 });
    }

    const roomId = params.id;

    // Check if the room exists and the current user is a participant
    const room = await prismadb.chatRoom.findFirst({
      where: {
        id: roomId,
        participants: {
          some: {
            userId,
          },
        },
      },
      include: {
        participants: true,
      },
    })

    if (!room) {
      return NextResponse.json({ message: "Chat room not found" }, { status: 404 })
    }

    // Check if the user is the admin (creator) of the group
    if (room.createdBy === userId) {
      // If the admin is leaving and there are other participants, transfer admin rights to another participant
      if (room.participants.length > 1) {
        // Find another participant who is not the current admin
        const newAdmin = room.participants.find((p) => p.userId !== userId)

        if (newAdmin) {
          // Update the room with the new admin
          await prismadb.chatRoom.update({
            where: {
              id: roomId,
            },
            data: {
              createdBy: newAdmin.userId,
            },
          })
        }
      } else {
        // If the admin is the only participant, delete the room
        await prismadb.chatRoom.delete({
          where: {
            id: roomId,
          },
        })

        return NextResponse.json(
          {
            message: "Group deleted as you were the only member",
          },
          { status: 200 },
        )
      }
    }

    // Remove the participant
    await prismadb.chatParticipant.deleteMany({
      where: {
        roomId,
        userId,
      },
    })

    return NextResponse.json(
      {
        message: "Left the group successfully",
      },
      { status: 200 },
    )
  } catch (error) {
    console.error("Error leaving chat room:", error)
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 })
  }
}
