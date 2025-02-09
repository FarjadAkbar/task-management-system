import { prismadb } from "@/lib/prisma";

export async function getEventData(eventId: string) {
  console.log(eventId, "eventId....")
  const eventData = await prismadb.event.findFirst({
    where: {
      id: eventId,
    },
    include: {
      participants: true
    }
  });

  if (!eventData) {
    throw new Error("Event not found");
  }
  
  return eventData;
}
