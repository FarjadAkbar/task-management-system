import { authOptions } from "@/lib/auth";
import { prismadb } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function PUT(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json(
      { message: "Unauthorized" },
      {
        status: 401,
      }
    );
  }

  const body = await req.json();

  if (!body.avatar) {
    return NextResponse.json(
      { message: "No avatar provided" },
      {
        status: 400,
      }
    );
  }

  try {
    await prismadb.users.update({
      where: {
        id: session.user.id,
      },
      data: {
        avatar: body.avatar,
      },
    });
    console.log("Profile photo updated");
    return NextResponse.json(
      { message: "Profile photo updated" },
      { status: 200 }
    );
  } catch (e) {
    console.log(e);
    return NextResponse.json(
      { message: "Error updating profile photo" },
      {
        status: 500,
      }
    );
  }
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);

  // Check if the user is authenticated
  if (!session) {
    return NextResponse.json(
      { message: "Unauthorized" },
      {
        status: 401,
      }
    );
  }

  try {
    // Parse the request body
    const body = await req.json();

    // Validate if avatar is provided
    if (!body.avatar) {
      return NextResponse.json(
        { message: "No avatar provided" },
        {
          status: 400,
        }
      );
    }

    // Update the user's profile with the new avatar
    const user = await prismadb.users.update({
      where: {
        id: session.user.id,
      },
      data: {
        avatar: body.avatar,
      },
    });

    console.log("Profile image uploaded successfully");
    return NextResponse.json(
      {
        message: "Profile image uploaded successfully",
        user,
      },
      {
        status: 201,
      }
    );
  } catch (e) {
    console.error("Error uploading profile image:", e);
    return NextResponse.json(
      { message: "Error uploading profile image" },
      {
        status: 500,
      }
    );
  }
}
