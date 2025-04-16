import { NextResponse } from "next/server"
import { prismadb } from "@/lib/prisma";
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

// GET: Fetch all chat rooms for the current user
export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const userId = session.user.id
    const { searchParams } = new URL(req.url)
    const keyword = searchParams.get("keyword") || ""
    const pageSize = Number.parseInt(searchParams.get("pageSize") || "10")
    const pageNumber = Number.parseInt(searchParams.get("pageNumber") || "1")

    // Calculate pagination
    const skip = (pageNumber - 1) * pageSize

       // Get total count for pagination
       const totalCount = await prismadb.chatRoom.count({
        where: {
          AND: [
            {
                OR: [
                    { name: { contains: keyword, mode: "insensitive" } },
                    {
                      participants: {
                        some: {
                          user: {
                            OR: [
                              { name: { contains: keyword, mode: "insensitive" } },
                              { email: { contains: keyword, mode: "insensitive" } },
                            ],
                          },
                        },
                      },
                    },
                  ],
            },
          ],
        },
      })

      
    // Get rooms where the user is a participant
    const rooms = await prismadb.chatRoom.findMany({
      where: {
        participants: {
          some: {
            userId,
          },
        },
        OR: [
          { name: { contains: keyword, mode: "insensitive" } },
          {
            participants: {
              some: {
                user: {
                  OR: [
                    { name: { contains: keyword, mode: "insensitive" } },
                    { email: { contains: keyword, mode: "insensitive" } },
                  ],
                },
              },
            },
          },
        ],
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
        messages: {
          orderBy: {
            createdAt: "desc",
          },
          take: 1,
          include: {
            sender: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
      orderBy: {
        updatedAt: "desc",
      },
      skip,
      take: pageSize,
    })

    // Transform the data to include unread count and last message
    const roomsWithUnreadCount = rooms.map((room) => {
      const participant = room.participants.find((p) => p.userId === userId)
      const otherParticipants = room.participants.filter((p) => p.userId !== userId)

      // For direct messages, use the other user's name if room name is not set
      let displayName = room.name
      if (!room.isGroup && !displayName && otherParticipants.length > 0) {
        displayName = otherParticipants[0].user.name || otherParticipants[0].user.email
      }

      return {
        id: room.id,
        name: displayName,
        isGroup: room.isGroup,
        lastMessage: room.messages[0] || null,
        unreadCount: participant?.unreadCount || 0,
        participants: room.participants.map((p) => p.user),
        createdBy: room.createdBy,
        updatedAt: room.updatedAt,
      }
    })

    return NextResponse.json(
      {
        message: "Success",
        rooms: roomsWithUnreadCount,
        pagination: {
            totalCount,
            pageSize,
            pageNumber,
            totalPages: Math.ceil(totalCount / pageSize),
          },
      },
      { status: 200 },
    )
  } catch (error) {
    console.error("Error fetching chat rooms:", error)
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 })
  }
}

// POST: Create a new chat room
export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const userId = session.user.id
    const body = await req.json()

    // Validate required fields
    if (!body.participants || !Array.isArray(body.participants) || body.participants.length === 0) {
      return NextResponse.json({ message: "Participants are required" }, { status: 400 })
    }

    // Ensure the current user is included in participants
    const participantIds = [...new Set([userId, ...body.participants])]

    // Check if this is a direct message (between 2 users)
    const isGroup = participantIds.length > 2 || body.isGroup

    // For direct messages, check if a room already exists between these users
    if (!isGroup && participantIds.length === 2) {
      const existingRoom = await prismadb.chatRoom.findFirst({
        where: {
          isGroup: false,
          AND: [
            {
              participants: {
                some: {
                  userId: participantIds[0],
                },
              },
            },
            {
              participants: {
                some: {
                  userId: participantIds[1],
                },
              },
            },
          ],
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

      if (existingRoom) {
        return NextResponse.json(
          {
            message: "Chat room already exists",
            room: {
              id: existingRoom.id,
              name: body.name || null,
              isGroup: existingRoom.isGroup,
              participants: existingRoom.participants.map((p) => p.user),
            },
          },
          { status: 200 },
        )
      }
    }

    // Create a new chat room
    const newRoom = await prismadb.chatRoom.create({
      data: {
        name: body.name || null,
        isGroup: isGroup,
        createdBy: userId,
        participants: {
          create: participantIds.map((id) => ({
            userId: id,
          })),
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

    return NextResponse.json(
      {
        message: "Chat room created",
        room: {
          id: newRoom.id,
          name: newRoom.name,
          isGroup: newRoom.isGroup,
          participants: newRoom.participants.map((p) => p.user),
        },
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("Error creating chat room:", error)
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 })
  }
}

