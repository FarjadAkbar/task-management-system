import { UTApi } from 'uploadthing/server';
import { NextRequest, NextResponse } from "next/server";
import { prismadb } from "@/lib/prisma";

export async function DELETE(req: NextRequest, { params }: { params: { fileId: string } }) {
  const { fileId } = params;

  if (!fileId) {
    return NextResponse.json({ error: 'File ID is required' }, { status: 400 });
  }

  try {
    const utapi = new UTApi();
    // Delete the file from UploadThing
    await utapi.deleteFiles(fileId);

    // Delete the file record from Prisma (optional)
    await prismadb.documents.delete({
      where: {
        id: fileId,
      },
    });

    return NextResponse.json({ message: 'File deleted successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error deleting file:', error);
    return NextResponse.json({ error: 'Failed to delete file' }, { status: 500 });
  }
}