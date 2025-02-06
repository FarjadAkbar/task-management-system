import { NextResponse } from "next/server";
import { prismadb } from "@/lib/prisma";
import { nylas } from "@/lib/nylas";
import { requireUser } from "@/lib/user";


const validateEventType = async (
  data: any,
  grantId: string,
  grantEmail: string
) => {
  const errors: Record<string, string> = {};

  if (
    !data.eventId ||
    typeof data.eventId !== "string" ||
    data.eventId.trim() === ""
  ) {
    errors.eventId = "eventId is required";
  }
  if (
    !grantEmail ||
    typeof grantEmail !== "string" ||
    grantEmail.trim() === ""
  ) {
    errors.grantEmail = "grantEmail is required";
  }

  if (!grantId || typeof grantId !== "string" || grantId.trim() === "") {
    errors.grantId = "grantId is required";
  }

  return Object.keys(errors).length > 0 ? errors : null;
};

export async function POST(req: Request) {
  try {
    const user = await requireUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const validationErrors = await validateEventType(
      body,
      user.grantId as string,
      user.grantEmail as string
    );

    if (validationErrors) {
      return NextResponse.json({ errors: validationErrors }, { status: 400 });
    }

    await nylas.events.destroy({
      eventId: body.eventId,
      identifier: user.grantId as string,
      queryParams: {
        calendarId: user.grantEmail as string,
      },
    });

    await prismadb.event.update({
        where: {
          id: body.eventId,
        },
        data: {
          active: false,
        },
      });

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("Error cancelling event:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Failed to cancel event",
      },
      { status: 500 }
    );
  }
}
