import { prismadb } from "@/lib/prisma";

export async function getData(id: string) {
  const data = await prismadb.users.findUnique({
    where: {
      id: id,
    },

    select: {
      events: {
        select: {
          id: true,
          active: true,
          title: true,
          url: true,
          duration: true,
        },
        orderBy: {
          createdAt: "desc",
        },
      },
      username: true,
    },
  });

  if (!data) {
    return notFound();
  }

  return data;
}