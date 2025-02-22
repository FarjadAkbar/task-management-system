import { NextResponse } from "next/server"
import { prismadb } from "@/lib/prisma"
import { requireUser } from "@/lib/user"

import { nanoid } from "nanoid";
import { nylas } from "@/lib/nylas";

const slugifyTitle = (title: string) => {
  return title.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
};

const generateUniqueUrl = async (title: string, userId: string) => {
  let url = slugifyTitle(title);

  // Check if the URL already exists for the user
  const existingEvent = await prismadb.event.findFirst({
    where: {
      userId: userId,
      url: url,
    },
  });

  if (existingEvent) {
    // Append random ID to ensure uniqueness
    url = `${url}-${nanoid(6)}`;
  }

  return url;
};

const validateEventType = async (data: any) => {
  const errors: Record<string, string> = {}

  if (!data.title || typeof data.title !== "string" || data.title.trim() === "") {
    errors.title = "Title is required"
  }
  
  // Event Date validation
  if (!data.eventDate || typeof data.eventDate !== "string" || !Date.parse(data.eventDate)) {
    errors.eventDate = "Invalid eventDate"
  }
  
  // Event Time validation
  if (!data.eventTime || typeof data.eventTime !== "string" || data.eventTime.trim() === "") {
    errors.eventTime = "eventTime is required"
  }
  
  if (!data.duration || !["15", "30", "45", "60"].includes(data.duration)) {
    errors.duration = "Invalid duration"
  }

  if (!data.participants || data.participants.length < 0) {
    errors.participants = "At least one employee is required"
  }

  return Object.keys(errors).length > 0 ? errors : null
}

export async function POST(req: Request) {
  try {
    const user = await requireUser()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await req.json();
    const validationErrors = await validateEventType(body)

    if (validationErrors) {
      return NextResponse.json({ errors: validationErrors }, { status: 400 })
    }

    const uniqueUrl = await generateUniqueUrl(body.title, user.id);
    const formTime = body.eventTime;
    const eventDate = body.eventDate.split("T")[0];

    const eventTypeData = await prismadb.event.create({
      data: {
        title: body.title,
        url: uniqueUrl,
        description: body.description || "",
        duration: Number(body.duration),
        date: eventDate,
        time: formTime,
        videoCallSoftware: body.videoCallSoftware,
        userId: user.id
      }
    });
    
    // Ensure participants are provided and construct the participants data
    const participantsData = Array.isArray(body.participants) && body.participants.length > 0
      ? body.participants.map((employeeId: string) => ({
          userId: employeeId,
          eventId: eventTypeData.id,
        }))
      : [];
    
    if (participantsData.length === 0) {
      return NextResponse.json({ error: "At least one participant is required" }, { status: 400 });
    }
    
    // Use Promise.all to handle the asynchronous operation properly
    const participants = await Promise.all(
      body.participants.map(async (employeeId: string) => {
        const res = await prismadb.eventParticipant.create({
          data: {
            eventId: eventTypeData.id,
            userId: employeeId
          },
          include: {
            user: true
          }
        });
    
        return { name: res.user.username, email: res.user.email, status: "yes" };
      })
    );

    
    const meetingLength = eventTypeData.duration;
    const startDateTime = new Date(`${eventDate}T${formTime}:00`);
    
    // Calculate the end time by adding the meeting length (in minutes) to the start time
    const endDateTime = new Date(startDateTime.getTime() + meetingLength * 60000);

    await nylas.events.create({
      identifier: user?.grantId as string,
      requestBody: {
        title: eventTypeData?.title,
        description: eventTypeData?.description,
        when: {
          startTime: Math.floor(startDateTime.getTime() / 1000),
          endTime: Math.floor(endDateTime.getTime() / 1000),
        },
        metadata: {
          eventId: eventTypeData.id
        },
        conferencing: {
          autocreate: {},
          provider: "Google Meet",
        },
        participants: participants,
      },
      queryParams: {
        calendarId: user?.grantEmail as string,
        notifyParticipants: true,
      },
    });
    
    return NextResponse.json([], { status: 201 })
  } catch (error) {
    console.log("Error creating event:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}
