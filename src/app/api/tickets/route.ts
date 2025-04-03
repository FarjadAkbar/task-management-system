import { NextResponse } from "next/server";
import { prismadb } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";


export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const userId = session.user.id
    const { searchParams } = new URL(req.url)
    const search = searchParams.get("search") || ""

    // Get users excluding the current user
     const tickets = await prismadb.ticket.findMany({
        where: {
          OR: [
            { createdById: userId },
          ],
        },
        include: {
          createdBy: {
            select: {
              name: true,
            }
          },
          assignedTo: {
            select: {
              name: true,
            }
          }
        },
        orderBy: {
          updatedAt: "desc",
        },
      });

    return NextResponse.json(
      {
        message: "Success",
        tickets,
      },
      { status: 200 },
    )
  } catch (error) {
    console.error("Error fetching tickets:", error)
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 })
  }
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  const body = await req.json();
  const { title, description, priority } = body;

  if (!session) {
    return new NextResponse("Unauthenticated", { status: 401 });
  }

  if (!title) {
    return new NextResponse("Missing title", { status: 400 });
  }

  if (!description) {
    return new NextResponse("Missing description", { status: 400 });
  }

  const assignedUser = await prismadb.users.findFirst({
    where: {
      OR: [{ role: "IT" }, { role: "ADMIN" }],
    },
  });

  try {

    const newTicket = await prismadb.ticket.create({
      data: {
        title: title,
        description: description,
        priority: priority,
        createdById: session.user.id,
        assignedToId: assignedUser?.id,
      },
    });

    return NextResponse.json({ newTicket }, { status: 200 });
  } catch (error) {
    console.log("[NEW_TICKET_POST]", error);
    return new NextResponse("Initial error", { status: 500 });
  }
}
