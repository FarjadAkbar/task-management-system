import { NextResponse } from "next/server";
import { prismadb } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { render } from "@react-email/render";
import sendEmail from "@/lib/sendmail";
import UpdatedTaskFromProject from "@/emails/UpdatedTaskFromProject";

//Create new task in project route
/*
TODO: there is second route for creating task in board, but it is the same as this one. Consider merging them (/api/projects/tasks/create-task/[boardId]). 
*/
export async function PUT(req: Request, props: { params: Promise<{ taskId: string }> }) {
  const params = await props.params;
  /*
  Resend.com function init - this is a helper function that will be used to send emails
  */
  // const resend = await resendHelper();
  const session = await getServerSession(authOptions);
  const body = await req.json();
  const {
    title,
    user,
    board,
    checklist,
    priority,
    content,
    notionUrl,
    dueDateAt,
  } = body;

  const boardId = board[0].id;
  const taskId = params.taskId;

  if (!taskId) {
    return new NextResponse("Missing task id", { status: 400 });
  }

  if (!session) {
    return new NextResponse("Unauthenticated", { status: 401 });
  }

  if (!title || !user || !priority || !content) {
    return new NextResponse("Missing one of the task data ", { status: 400 });
  }

  try {
    //Get first section from board where position is smallest
    const sectionId = await prismadb.sections.findFirst({
      where: {
        board: boardId
      },
      orderBy: {
        position: "asc",
      },
    });

    if (!sectionId) {
      return new NextResponse("No section found", { status: 400 });
    }

    // const tasksCount = await prismadb.tasks.count({
    //   where: {
    //     section: sectionId.id,
    //   },
    // });

    let contentUpdated = content;

    if (notionUrl) {
      contentUpdated = content + "\n\n" + notionUrl;
    }

    console.log(checklist, "check")
    const task = await prismadb.tasks.update({
      where: {
        id: taskId,
      },
      data: {
        priority: priority,
        title: title,
        content: contentUpdated,
        updatedBy: user,
        dueDateAt: dueDateAt,
        user: user,
        checklist: checklist
      },
    });

    //Update Board updated at field
    await prismadb.boards.update({
      where: {
        id: boardId,
      },
      data: {
        updatedAt: new Date(),
      },
    });

    //Notification to user who is not a task creator
    if (user !== session.user.id) {
      console.log("User property:", user);
      console.log("Board property:", boardId);
      try {
        const notifyRecipient = await prismadb.users.findUnique({
          where: { id: user },
        });

        const boardData = await prismadb.boards.findUnique({
          where: { id: boardId },
        });

        //console.log(notifyRecipient, "notifyRecipient");

        const emailHtml = render(
          UpdatedTaskFromProject({
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
          subject: `Task -  ${title} - was updated.`,
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
