import { NextResponse } from "next/server";
import { prismadb } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) {
    return new NextResponse("Unauthenticated", { status: 401 });
  }
  const users = await prismadb.users.findMany({
    where: {
      id: {
        not: {
          equals: session.user.id,
        },
      },
    },
  });

  return NextResponse.json(users);
}
