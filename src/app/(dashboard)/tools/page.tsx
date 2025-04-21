import { getUser } from "@/lib/get-user";
import AllTools from "@/components/dashboard/tool/all-tool";
import NewToolDialog from "@/components/dashboard/tool/new-tool";
import H2Title from "@/components/typography/h2";
import { Separator } from "@/components/ui/separator";
import { redirect } from "next/navigation";

export default async function Tools() {
  const user = await getUser();
  if (!user) return redirect("/");

  return (
    <div className="space-y-3 bg-gray-50">
      <div className="flex justify-between items-center px-8  bg-white shadow-md">
        <H2Title>Tools</H2Title>
        <div className="flex gap-3">
          <NewToolDialog userId={user.id} />
        </div>
      </div>
      <Separator className="my-4 !h-[0.5px]" />
      <AllTools />
    </div>
  );
}
