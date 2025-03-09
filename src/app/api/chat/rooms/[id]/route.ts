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
        },
      },
      { status: 200 },
    )
  } catch (error) {
    console.error("Error fetching chat room:", error)
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 })
  }
}

