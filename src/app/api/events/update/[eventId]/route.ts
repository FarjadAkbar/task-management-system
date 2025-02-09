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

export async function PUT(req: Request, props: { params: Promise<{ eventId: string }> }) {
const params = await props.params;
  
  try {
    const user = await requireUser()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await req.json();
    const validationErrors = await validateEventType(body)

    const existingEvent = await prismadb.event.findUnique({
        where: { id: params.eventId },
        include: { participants: true },
      });
  
      if (!existingEvent || existingEvent.userId !== user.id) {
        return NextResponse.json({ error: "Event not found or unauthorized" }, { status: 404 });
      }
  
    if (validationErrors) {
      return NextResponse.json({ errors: validationErrors }, { status: 400 })
    }

    const uniqueUrl = await generateUniqueUrl(body.title, user.id);
    const formTime = body.eventTime;
    const eventDate = body.eventDate.split("T")[0];

    const updatedEvent = await prismadb.event.update({
    where: { id: params.eventId },
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
    
     // Update participants
     const existingParticipantIds = existingEvent.participants.map(p => p.userId);

     // Remove participants not in the updated list
     const participantsToRemove = existingParticipantIds.filter(id => !body.participants.includes(id));
     await prismadb.eventParticipant.deleteMany({
       where: {
         eventId: body.id,
         userId: { in: participantsToRemove },
       },
     });
 
     // Add new participants
     const participantsToAdd = body.participants.filter(id => !existingParticipantIds.includes(id));
     await Promise.all(
       participantsToAdd.map(employeeId =>
         prismadb.eventParticipant.create({
           data: {
             eventId: updatedEvent.id,
             userId: employeeId,
           },
         })
       )
     );
 
    
    const meetingLength = updatedEvent.duration;
    const startDateTime = new Date(`${eventDate}T${formTime}:00`);

    // Calculate the end time by adding the meeting length (in minutes) to the start time
    const endDateTime = new Date(startDateTime.getTime() + meetingLength * 60000);

    await nylas.events.update({
      identifier: user?.grantId as string,
      eventId: body.nylasEventId,
      requestBody: {
        title: updatedEvent.title,
        description: updatedEvent.description,
        when: {
          startTime: Math.floor(startDateTime.getTime() / 1000),
          endTime: Math.floor(endDateTime.getTime() / 1000),
        },
        metadata: {
          eventId: updatedEvent.id,
        },
        conferencing: {
          autocreate: {},
          provider: "Google Meet",
        },
        participants: body.participants.map(participantId => ({
          userId: participantId,
        })),
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
