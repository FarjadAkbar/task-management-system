import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import { prismadb } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";
import { UpdateStatusPayloadType } from "@/service/users/type";

export async function GET(req: Request, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;

  if (!params.id) {
    return new NextResponse("Missing id", { status: 400 });
  }

  const id = params.id;

  try {
    const user = await prismadb.users.findMany({
      where: {
        id: id,
      },
    });

    return NextResponse.json(user);
  } catch (error) {
    console.log("[USER_GET]", error);
    return new NextResponse("Initial error", { status: 500 });
  }
}

export async function DELETE(req: Request, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  if (!params.id) {
    return new NextResponse("Missing id", { status: 400 });
  }

  const id = params.id;

  try {
    const user = await prismadb.users.delete({
      where: {
        id: id,
      },
    });

    return NextResponse.json(user);
  } catch (error) {
    console.log("[USER_DELETE]", error);
    return NextResponse.json({ message: error }, { status: 500 });
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
    const body: UpdateStatusPayloadType = await req.json();
    const user = await prismadb.users.update({
      where: {
        id: id,
      },
      data: {
        userStatus: body.status
      },
    });

    return NextResponse.json(user);
  } catch (error) {
    console.log("[USER_PATCH]", error);
    return NextResponse.json({ message: error }, { status: 500 });
  }
}
