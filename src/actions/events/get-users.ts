import { prismadb } from "@/lib/prisma";
import { notFound } from "next/navigation";

export async function getUsers(id: string) {
  const data = await prismadb.users.findMany({
    where: {
      id: {
        not: {
          equals: id
        }
      }
    }
  });

  if (!data) {
    return notFound();
  }

  return data;
}