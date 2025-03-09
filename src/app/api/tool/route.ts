import { prismadb } from "@/lib/prisma";
import { CreateToolPayloadType } from "@/service/tools/type";
import { NextResponse } from "next/server";


// ********** GET: Fetch All Tools **********
export async function GET(req: Request) {
  try {
    // Get URL parameters
    const { searchParams } = new URL(req.url)
    const keyword = searchParams.get("keyword") || ""
    const department = searchParams.get("department") || ""
    const pageSize = Number.parseInt(searchParams.get("pageSize") || "10")
    const pageNumber = Number.parseInt(searchParams.get("pageNumber") || "1")

    // Calculate pagination
    const skip = (pageNumber - 1) * pageSize

    // Get total count for pagination
    const totalCount = await prismadb.tools.count({
      where: {
        AND: [
          {
            OR: [
              { name: { contains: keyword, mode: "insensitive" } },
              { username: { contains: keyword, mode: "insensitive" } },
            ],
          },
          department ? { department: { contains: department, mode: "insensitive" } } : {},
        ],
      },
    })

    // Get tools with pagination and filtering
    const tools = await prismadb.tools.findMany({
      where: {
        AND: [
          {
            OR: [
              { name: { contains: keyword, mode: "insensitive" } },
              { username: { contains: keyword, mode: "insensitive" } },
            ],
          },
          department ? { department: { contains: department, mode: "insensitive" } } : {},
        ],
      },
      include: {
        created_by: {
          select: { name: true },
        },
        document: {
          select: {
            document_file_url: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
      skip,
      take: pageSize,
    })

    return NextResponse.json(
      {
        message: "Success",
        tools,
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
    console.error("Error fetching tools:", error)
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 })
  }
}

// ********** POST: Create a Tool **********
export async function POST(req: Request) {
  try {
    const body: CreateToolPayloadType = await req.json();

    const newTool = await prismadb.tools.create({
      data: {
        name: body.name,
        username: body.username,
        password: body.password,
        department: body.department,
        documentID: body.documentID,
        user: body.createdBy,
      },
    });

    return NextResponse.json({ message: "Tool Created", tool: newTool }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: "Error creating tool", error }, { status: 500 });
  }
};
