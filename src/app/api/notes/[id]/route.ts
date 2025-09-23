import { prismadb } from "@/lib/prisma"; 
import { UpdateNotePayloadType } from "@/service/notes/type";
import { NextResponse } from "next/server";
import { getUser } from "@/lib/get-user";

// ********** PUT: Update a Note **********
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
    const body: UpdateNotePayloadType = await req.json();
    const { title, content, visibility } = body;

    if (!title || !content || !visibility) {
      return new NextResponse("Missing required fields", { status: 400 });
    }
    const user = await getUser(); 
    if (!user?.id) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const userId = user.id;
    const is_public = visibility === "shared";

    const existingNote = await prismadb.notes.findUnique({
      where: { id },
    });

    if (!existingNote || existingNote.authorId !== userId) {
      return new NextResponse("Note not found or unauthorized", { status: 404 });
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
    return NextResponse.json(
      { message: "Error updating note", error },
      { status: 500 }
    );
  }
}

// ********** DELETE: Remove a Note **********
export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
      const { id } = await params; 
console.log(id, ".......")
      const existingNote = await prismadb.notes.findUnique({
        where: { id },
      });
  
      if (!existingNote) {
        return NextResponse.json({ message: "Note not found" }, { status: 404 });
      }
  
      await prismadb.notes.delete({
        where: { id },
      });
  
      return NextResponse.json({ message: "Note Deleted" }, { status: 200 });
    } catch (error) {
      console.error("Error deleting note:", error);
      return NextResponse.json({ message: "Error deleting note", error }, { status: 500 });
    }
  }