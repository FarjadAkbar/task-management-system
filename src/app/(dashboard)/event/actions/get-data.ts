import { nylas } from "@/lib/nylas";
import { prismadb } from "@/lib/prisma";

export async function getData(userId: string) {
  const userData = await prismadb.users.findUnique({
    where: {
      id: userId,
    },
    select: {
      grantId: true,
      grantEmail: true,
    },
  });

  if (!userData) {
    throw new Error("User not found");
  }
  if(userData?.grantId == null || userData?.grantEmail == null) return { data: [] };

  const data = await nylas.events.list({
    identifier: userData?.grantId as string,
    queryParams: {
      calendarId: userData?.grantEmail as string,
    },
  });

  return data;
}
