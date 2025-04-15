import { unstable_cache } from 'next/cache'
import { authOptions } from "@/lib/auth";
import { prismadb } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { redirect } from 'next/navigation'


export const getUser = async () => {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) redirect("/sign-in");

  const getCachedUser = unstable_cache(
    async () => {
      return await prismadb.users.findUnique({
        where: { id: session.user.id },
      });
    },
    ['auth', session.user.id], // cache key should include unique user ID
    { revalidate: 3600, tags: ['auth'] }
  );

  const user = await getCachedUser();

  if (!user) throw new Error("User not found");
  return user;
};

