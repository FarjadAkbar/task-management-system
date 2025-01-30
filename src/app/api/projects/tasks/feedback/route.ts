import { NextResponse } from 'next/server';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prismadb } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    // Check if the user is authenticated and is an admin
    if (!session || !session.user || !session.user.isAdmin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { taskId, feedback, rating } = await req.json();

    // Validate input
    if (!taskId || !feedback || typeof rating !== 'number' || rating < 1 || rating > 5) {
      return NextResponse.json({ error: "Invalid input" }, { status: 400 });
    }

    // Create feedback in the database
    const newFeedback = await prismadb.TaskFeedback.create({
      data: {
        taskId,
        userId: session.user.id,
        feedback,
        rating,
      },
    });

    return NextResponse.json({ success: true, feedback: newFeedback }, { status: 201 });
  } catch (error) {
    console.error("Error submitting feedback:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
