import { NextResponse } from "next/server"
import { prismadb } from "@/lib/prisma";

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  const { isPublic } = await request.json()
  const note = await prismadb.personalNote.update({
    where: { id: params.id },
    data: { isPublic },
  })
  return NextResponse.json(note)
}

