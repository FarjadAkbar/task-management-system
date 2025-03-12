import { NextResponse } from "next/server";
import { prismadb } from "@/lib/prisma";
import { CreateNotePayloadType } from "@/service/notes/type";
import { getUser } from "@/actions/get-user";
import {UpdateNotePayloadType} from "@/service/notes/type"

export async function GET(req: Request) {
  try{
  const user = await getUser();

  if (!user?.id) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const userId = user.id;

  const notes = await prismadb.notes.findMany({
    where: { authorId: userId },
    orderBy: { updatedAt: "desc" },
  });

  return NextResponse.json(
    {
      message: "Success",
      notes,
      // pagination: {
      //   totalCount,
      //   pageSize,
      //   pageNumber,
      //   totalPages: Math.ceil(totalCount / pageSize),
      // },
    },
    { status: 200 },
  )
} catch (error) {
  console.error("Error fetching tools:", error)
  return NextResponse.json({ message: "Internal Server Error" }, { status: 500 })
}
}

export async function POST(req: Request) {
  try {
    const body: CreateNotePayloadType = await req.json();

    const { title, content, visibility } = body;
    if (!title || !content || !visibility) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const user = await getUser();

    if (!user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const userId = user.id;
    const is_public = visibility === "shared";
    const newNote = await prismadb.notes.create({
      data: { title, content, is_public, authorId: userId },
    });

    return NextResponse.json(
      { message: "Note Created", noet: newNote },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Error creating note", error },
      { status: 500 }
    );
  }
}

// Update a note
export async function PATCH(req: Request) {
  try {
    const body: Partial<UpdateNotePayloadType> = await req.json();
    const { id, title, content, visibility } = body;

    if (!id || !title || !content || !visibility) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const user = await getUser();

    if (!user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const userId = user.id;
    const is_public = visibility === "shared";

    const existingNote = await prismadb.notes.findUnique({
      where: { id },
    });

    if (!existingNote || existingNote.authorId !== userId) {
      return NextResponse.json(
        { message: "Note not found or unauthorized" },
        { status: 404 }
      );
    }

    const updatedNote = await prismadb.notes.update({
      where: { id },
      data: { title, content, is_public },
    });

    return NextResponse.json(
      { message: "Note Updated", note: updatedNote },
      { status: 200 }
    );
  } catch (error) {
    console.log("Error updating note:", error);
    return NextResponse.json(
      { message: "Error updating note", error },
      { status: 500 }
    );
  }
}

// Delete a note
export async function DELETE(req: Request) {
  try {
    const { id } = await req.json();

    if (!id) {
      return NextResponse.json(
        { error: "Note ID is required" },
        { status: 400 }
      );
    }

    const user = await getUser();

    if (!user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const userId = user.id;

    const existingNote = await prismadb.notes.findUnique({
      where: { id },
    });

    if (!existingNote || existingNote.authorId !== userId) {
      return NextResponse.json(
        { message: "Note not found or unauthorized" },
        { status: 404 }
      );
    }

    await prismadb.notes.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Note Deleted" }, { status: 200 });
  } catch (error) {
    console.log("Error deleting note:", error);
    return NextResponse.json(
      { message: "Error deleting note", error },
      { status: 500 }
    );
  }
}