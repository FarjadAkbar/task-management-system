import { prismadb } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { UpdateToolPayloadType } from "@/types/api.type";

// ********** PUT: Update a Tool **********
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
    const body: UpdateToolPayloadType = await req.json();

    const updatedTool = await prismadb.tools.update({
      where: { id: body.id },
      data: {
        name: body.name,
        username: body.username,
        password: body.password,
        department: body.department,
        documentID: body.documentID,
      },
    });

    return NextResponse.json(
      { message: "Tool Updated", tool: updatedTool },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Error updating tool", error },
      { status: 500 }
    );
  }
}

// ********** DELETE: Remove a Tool **********
export async function DELETE(
  req: Request,
  props: { params: Promise<{ id: string }> }
) {
  try {
    const params = await props.params;

    if (!params.id) {
      return new NextResponse("Missing id", { status: 400 });
    }

    const id = params.id;

    await prismadb.tools.delete({ where: { id } });

    return NextResponse.json({ message: "Tool Deleted" }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "Error deleting tool", error },
      { status: 500 }
    );
  }
}
