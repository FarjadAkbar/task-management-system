import { getUsers } from "@/actions/get-users";
import React from "react";
import { InviteForm } from "./components/InviteForm";
import { Separator } from "@/components/ui/separator";
import { columns } from "./table-components/columns";
import { Users } from "@prisma/client";
import { Button } from "@/components/ui/button";
import SendMailToAll from "./components/send-mail-to-all";
import Container from "../components/ui/Container";
import { requireUser } from "@/lib/user";
import { DataTable } from "../components/table-components/data-table";
import { isAdmin, statuses } from "./table-data/data";

const AdminUsersPage = async () => {
  const users: Users[] = await getUsers();
  const user = await requireUser();

  if (!user?.isAdmin) {
    return (
      <Container
        title="Administration"
        description="You are not admin, access not allowed"
      >
        <div className="flex w-full h-full items-center justify-center">
          Access not allowed
        </div>
      </Container>
    );
  }

  return (
    <Container
      title="Users administration"
      description={"Here you can manage your NextCRM users"}
    >
      <div className="flex-col1">
        <h4 className="scroll-m-20 text-xl font-semibold tracking-tight">
          Invite new user to NextCRM
        </h4>
        <InviteForm />
      </div>
      {/* <Separator />
      <div>
        <SendMailToAll />
      </div> */}
      <Separator />
 <DataTable data={users} columns={columns} 
        filters={[
                            { label: "Name", name: "name", isInput: true }, // Input search
                            { label: "Status", name: "userStatus", options: statuses },
                            { label: "Admin", name: "is_admin", options: isAdmin },
                          ]} />
    </Container>
  );
};

export default AdminUsersPage;
