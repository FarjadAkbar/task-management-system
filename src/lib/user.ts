import { redirect } from "next/navigation";
import { authOptions } from "./auth";
import { getServerSession } from "next-auth";


export async function requireUser() {
  const session = await getServerSession(authOptions);

  if (!session) {
    return redirect("/sign-in");
  }

  if (!session?.user?.id) {
    return redirect("/");
  }

  return session.user;
}
