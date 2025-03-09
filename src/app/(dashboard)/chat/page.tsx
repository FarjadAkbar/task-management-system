import { getUser } from "@/actions/get-user";
import { ChatLayout } from "@/components/dashboard/chat/chat-layout";
import { redirect } from "next/navigation";

export default async function Chat() {
  const user = await getUser();
  if (!user) return redirect("/");

  return <ChatLayout user={user} />;
}
