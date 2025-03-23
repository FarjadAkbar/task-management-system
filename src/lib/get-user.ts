import { cache } from "react";
import { authOptions } from "@/lib/auth";
import { prismadb } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { redirect } from 'next/navigation'

export const getUser = cache(async () => {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    redirect("/sign-in");
  }
  const data = await prismadb.users.findUnique({
    where: {
      id: session?.user?.id,
    },
  });
  if (!data) throw new Error("User not found");
  return data;
});
