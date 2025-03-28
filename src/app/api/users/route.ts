import { NextResponse } from "next/server";
import { prismadb } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const userId = session.user.id
    const { searchParams } = new URL(req.url)
    const search = searchParams.get("search") || ""

    // Get users excluding the current user
    const users = await prismadb.users.findMany({
      where: {
        id: { not: userId },
        OR: [
          { name: { contains: search, mode: "insensitive" } },
          { email: { contains: search, mode: "insensitive" } },
          { first_name: { contains: search, mode: "insensitive" } },
          { last_name: { contains: search, mode: "insensitive" } },
        ],
      },
      select: {
        id: true,
        name: true,
        email: true,
        avatar: true,
        role: true,
        userStatus: true,
      },
      orderBy: {
        name: "asc",
      },
      take: 50,
    })

    return NextResponse.json(
      {
        message: "Success",
        users,
      },
      { status: 200 },
    )
  } catch (error) {
    console.error("Error fetching users:", error)
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 })
  }
}
