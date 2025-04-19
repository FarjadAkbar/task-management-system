import { NextResponse } from "next/server";
import { prismadb } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;
    const body = await req.json();

    if (!body.content || !body.roomId) {
      return NextResponse.json({ message: "Content and roomId are required" }, { status: 400 });
    }

    const participant = await prismadb.chatParticipant.findUnique({
      where: {
        userId_roomId: {
          userId,
          roomId: body.roomId,
        },
      },
    });

    if (!participant) {
      return NextResponse.json({ message: "You are not a participant in this chat room" }, { status: 403 });
    }

    const message = await prismadb.chatMessage.create({
      data: {
        content: body.content,
        senderId: userId,
        roomId: body.roomId,
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
    });

    await prismadb.chatRoom.update({
      where: { id: body.roomId },
      data: { updatedAt: new Date() },
    });

    await prismadb.chatParticipant.updateMany({
      where: {
        roomId: body.roomId,
        userId: { not: userId },
      },
      data: {
        unreadCount: { increment: 1 },
      },
    });

    await prismadb.chatParticipant.update({
      where: {
        userId_roomId: {
          userId,
          roomId: body.roomId,
        },
      },
      data: {
        lastSeen: new Date(),
      },
    });

    return NextResponse.json(
      {
        message: "Message sent",
        chatMessage: message,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error sending message:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}