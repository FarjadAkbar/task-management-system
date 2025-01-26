"use server";

import { NextResponse } from "next/server";
import { prismadb } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { render } from "@react-email/render";
import NewTaskFromProject from "@/emails/NewTaskFromProject";
import sendEmail from "@/lib/sendmail";

//Create new task in project route
/*
TODO: there is second route for creating task in board, but it is the same as this one. Consider merging them (/api/projects/tasks/create-task/[boardId]). 
*/
export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  const body = await req.json();
  const {
    title,
    user,
    board,
    priority,
    content,
    account,
    checklist,
    dueDateAt,
  } = body;

  if (!session) {
    return new NextResponse("Unauthenticated", { status: 401 });
  }

  if (!title || !user || !board || !priority || !content) {
    return new NextResponse("Missing one of the task data ", { status: 400 });
  }

  try {
    //Get first section from board where position is smallest
    const sectionId = await prismadb.sections.findFirst({
      where: {
        board: board,
      },
      orderBy: {
        position: "asc",
      },
    });

    if (!sectionId) {
      return new NextResponse("No section found", { status: 400 });
    }

    const tasksCount = await prismadb.tasks.count({
      where: {
        section: sectionId.id,
      },
    });

    let contentUpdated = content;

    const task = await prismadb.tasks.create({
      data: {
        v: 0,
        priority: priority,
        title: title,
        content: contentUpdated,
        dueDateAt: dueDateAt,
        section: sectionId.id,
        createdBy: session.user.id,
        updatedBy: session.user.id,
        position: tasksCount > 0 ? tasksCount : 0,
        user: user,
        taskStatus: "ACTIVE",
        checklist: checklist ? JSON.stringify(checklist) : null,
      },
    });

    //Make update to Board - updatedAt field to trigger re-render and reorder
    await prismadb.boards.update({
      where: {
        id: board,
      },
      data: {
        updatedAt: new Date(),
      },
    });

    //Notification to user who is not a task creator
    if (user !== session.user.id) {
      try {
        const notifyRecipient = await prismadb.users.findUnique({
          where: { id: user },
        });

        const boardData = await prismadb.boards.findUnique({
          where: { id: board },
        });

        //console.log(notifyRecipient, "notifyRecipient");

        const emailHtml = render(
          NewTaskFromProject({
            taskFromUser: session.user.name!,
            username: notifyRecipient?.name!,
            taskData: task,
            boardData: boardData,
          })
        );

        await sendEmail({
          from:
            process.env.NEXT_PUBLIC_APP_NAME +
            " <" +
            process.env.EMAIL_FROM +
            ">",
          to: notifyRecipient?.email!,
          subject: `New task -  ${title}.`,
          text: "",
          html: await emailHtml,
        });
        console.log("Email sent to user: ", notifyRecipient?.email!);
      } catch (error) {
        console.log(error);
      }
    }

    return NextResponse.json({ status: 200 });
  } catch (error) {
    console.log("[NEW_BOARD_POST]", error);
    return new NextResponse("Initial error", { status: 500 });
  }
}
