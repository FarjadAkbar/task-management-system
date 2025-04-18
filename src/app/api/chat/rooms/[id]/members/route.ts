import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { prismadb } from "@/lib/prisma";
import { authOptions } from "@/lib/auth"

// POST: Add members to a chat room
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
    const { userIds } = await req.json()

    if (!userIds || !Array.isArray(userIds) || userIds.length === 0) {
      return NextResponse.json({ message: "User IDs are required" }, { status: 400 })
    }

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
        participants: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
                avatar: true,
              },
            },
          },
        },
      },
    })

    if (!room) {
      return NextResponse.json({ message: "Chat room not found" }, { status: 404 })
    }

    // Check if the current user is the admin (creator) of the group
    if (room.createdBy !== userId) {
      return NextResponse.json({ message: "Only the group admin can add members" }, { status: 403 })
    }

    // Filter out users who are already participants
    const existingParticipantIds = room.participants.map((p) => p.userId)
    const newUserIds = userIds.filter((id) => !existingParticipantIds.includes(id))

    if (newUserIds.length === 0) {
      return NextResponse.json({ message: "All users are already members of this group" }, { status: 400 })
    }

    // Add new participants
    await prismadb.chatRoom.update({
      where: {
        id: roomId,
      },
      data: {
        participants: {
          create: newUserIds.map((id) => ({
            userId: id,
          })),
        },
      },
    })

    // Get updated room with participants
    const updatedRoom = await prismadb.chatRoom.findUnique({
      where: {
        id: roomId,
      },
      include: {
        participants: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
                avatar: true,
              },
            },
          },
        },
      },
    })

    return NextResponse.json(
      {
        message: "Members added successfully",
        room: {
          id: updatedRoom?.id,
          name: updatedRoom?.name,
          isGroup: updatedRoom?.isGroup,
          createdBy: updatedRoom?.createdBy,
          participants: updatedRoom?.participants.map((p) => p.user),
        },
      },
      { status: 200 },
    )
  } catch (error) {
    console.error("Error adding members to chat room:", error)
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 })
  }
}

// DELETE: Remove a member from a chat room
export async function DELETE(req: Request, props: { params: Promise<{ id: string }> }) {
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
    const { memberId } = await req.json()

    if (!memberId) {
      return NextResponse.json({ message: "Member ID is required" }, { status: 400 })
    }

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
    })

    if (!room) {
      return NextResponse.json({ message: "Chat room not found" }, { status: 404 })
    }

    // Check if the current user is the admin or if they're removing themselves
    if (room.createdBy !== userId && userId !== memberId) {
      return NextResponse.json({ message: "Only the group admin can remove other members" }, { status: 403 })
    }

    // Check if the member to be removed is the admin
    if (memberId === room.createdBy) {
      return NextResponse.json({ message: "Cannot remove the group admin" }, { status: 403 })
    }

    // Remove the participant
    await prismadb.chatParticipant.deleteMany({
      where: {
        roomId,
        userId: memberId,
      },
    })

    // Get updated room with participants
    const updatedRoom = await prismadb.chatRoom.findUnique({
      where: {
        id: roomId,
      },
      include: {
        participants: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
                avatar: true,
              },
            },
          },
        },
      },
    })

    return NextResponse.json(
      {
        message: "Member removed successfully",
        room: {
          id: updatedRoom?.id,
          name: updatedRoom?.name,
          isGroup: updatedRoom?.isGroup,
          createdBy: updatedRoom?.createdBy,
          participants: updatedRoom?.participants.map((p) => p.user),
        },
      },
      { status: 200 },
    )
  } catch (error) {
    console.error("Error removing member from chat room:", error)
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 })
  }
}
