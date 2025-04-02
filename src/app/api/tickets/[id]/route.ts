import { NextResponse } from "next/server";
import { prismadb } from "@/lib/prisma";
import { UpdateTicketPayloadType } from "@/service/tickets/type";
import { TicketPriority } from "@prisma/client";

export async function GET(req: Request, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;

  if (!params.id) {
    return new NextResponse("Missing id", { status: 400 });
  }

  const id = params.id;

  try {
    const ticket = await prismadb.ticket.findMany({
      where: {
        id: id,
      },
    });

    return NextResponse.json({ message: "Success", ticket: ticket }, { status: 200 });
  } catch (error) {
    console.log("[USER_GET]", error);
    return new NextResponse("Initial error", { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  const { id } = await params;
  try {
    
    // Delete user after related records are removed
    const ticket = await prismadb.ticket.delete({ where: { id } });
    
    return NextResponse.json({ message: "Ticket Deleted", ticket: ticket }, { status: 200 });
  } catch (error: any) {
    // console.error("[USER_DELETE] Error:", error);
    return NextResponse.json({ message: String(error) }, { status: 500 });
  }
}


export async function PUT(
  req: Request,
  props: { params: Promise<{ id: string }> }
) {
  const params = await props.params;

  if (!params.id) {
    return new NextResponse("Missing id", { status: 400 });
  }

  const id = params.id;
  try {
    const body: UpdateTicketPayloadType = await req.json();
    const ticket = await prismadb.ticket.update({
      where: {
        id: id,
      },
      data: {
        title: body.title,
        description: body.description,
        priority: body.priority as TicketPriority,
      },
    });

    return NextResponse.json({ message: "Ticket Updated", ticket: ticket }, { status: 200 });
  } catch (error) {
    console.log("[USER_PATCH]", error);
    return NextResponse.json({ message: error }, { status: 500 });
  }
}
