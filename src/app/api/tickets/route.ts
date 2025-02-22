import { NextResponse } from "next/server";
import { prismadb } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

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

export async function PUT(req: Request) {
  const session = await getServerSession(authOptions);
  const body = await req.json();
  const { id, title, description, priority } = body;

  if (!session) {
    return new NextResponse("Unauthenticated", { status: 401 });
  }

  if (!title) {
    return new NextResponse("Missing ticket name", { status: 400 });
  }

  if (!description) {
    return new NextResponse("Missing ticket description", { status: 400 });
  }

  try {
    await prismadb.ticket.update({
      where: {
        id,
      },
      data: {
        title: title,
        description: description,
        priority: priority
      },
    });

    return NextResponse.json(
      { message: "Ticket updated successfullsy" },
      { status: 200 }
    );
  } catch (error) {
    console.log("[UPDATE_TICKET_POST]", error);
    return new NextResponse("Initial error", { status: 500 });
  }
}
