import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import { prismadb } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";

export async function DELETE(req: Request, props: { params: Promise<{ ticketId: string }> }) {
  const params = await props.params;
  const session = await getServerSession(authOptions);

  if (!session) {
    return new NextResponse("Unauthenticated", { status: 401 });
  }

  if (!params.ticketId) {
    return new NextResponse("Missing ticket ID", { status: 400 });
  }
  const ticketId = params.ticketId;

  try {
    await prismadb.ticket.delete({
      where: {
        id: ticketId,
      },
    });

    return NextResponse.json({ message: "Ticket deleted" }, { status: 200 });
  } catch (error) {
    console.log("[TICKET_DELETE]", error);
    return new NextResponse("Initial error", { status: 500 });
  }
}
