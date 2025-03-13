import { NextResponse } from "next/server"
import { prismadb } from "@/lib/prisma";
import { getUser } from "@/lib/get-user";

export async function GET(req: Request) {
  try {
    const user = await getUser();

    if (!user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const userId = user.id
    const { searchParams } = new URL(req.url)
    const search = searchParams.get("search") || ""
    const type = searchParams.get("type") || ""
    const sortBy = searchParams.get("sortBy") || "createdAt"
    const sortOrder = searchParams.get("sortOrder") || "desc"
    const pageSize = Number.parseInt(searchParams.get("pageSize") || "20")
    const pageNumber = Number.parseInt(searchParams.get("pageNumber") || "1")

    // Calculate pagination
    const skip = (pageNumber - 1) * pageSize

    // Get files that have been shared with the user

    // Get total count for pagination
    const totalCount = await prismadb.documents.count({
      where: {
        sharedWith: {
          some: {
            sharedWithId: userId,
          },
        },
        ...(search
          ? {
              OR: [
                { document_name: { contains: search, mode: "insensitive" } },
                { description: { contains: search, mode: "insensitive" } },
              ],
            }
          : {}),
        ...(type ? { document_file_mimeType: { contains: type, mode: "insensitive" } } : {}),
      }
    })

    // Get files with pagination, sorting, and filtering
    const files = await prismadb.documents.findMany({
      where: {
        // sharedWith: {
        //   some: {
        //     sharedWithId: userId,
        //   },
        // },
        ...(search
          ? {
              OR: [
                { document_name: { contains: search, mode: "insensitive" } },
                { description: { contains: search, mode: "insensitive" } },
              ],
            }
          : {}),
        ...(type ? { document_file_mimeType: { contains: type, mode: "insensitive" } } : {}),
      },
      include: {
        created_by: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true,
          },
        },
        // sharedWith: {
        //   where: {
        //     sharedWithId: userId,
        //   },
        //   include: {
        //     sharedBy: {
        //       select: {
        //         id: true,
        //         name: true,
        //         email: true,
        //         avatar: true,
        //       },
        //     },
        //   },
        // },
      },
      orderBy: {
        [sortBy]: sortOrder,
      },
      skip,
      take: pageSize,
    })

    return NextResponse.json(
      {
        message: "Success",
        files,
        pagination: {
          totalCount,
          pageSize,
          pageNumber,
          totalPages: Math.ceil(totalCount / pageSize),
        },
      },
      { status: 200 },
    )
  } catch (error) {
    console.error("Error fetching files shared with me:", error)
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 })
  }
}

