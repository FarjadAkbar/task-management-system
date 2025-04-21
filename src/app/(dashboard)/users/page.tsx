import React from "react";
import { InviteForm } from "@/components/dashboard/users/invite-form";
import { Separator } from "@/components/ui/separator";
import SendMailToAll from "@/components/dashboard/users/send-mail-to-all";
import Container from "../../../components/ui/container";
import UsersList from "@/components/dashboard/users/users-list";

const AdminUsersPage = async () => {
  return (
    <Container
      title="Users Administration"
      description={""}
    >
      <div className="flex flex-col gap-4">

        <InviteForm />
      </div>
      {/* <Separator />
      <div>
        <SendMailToAll />
      </div> */}
      <Separator />
      <UsersList />
    </Container>
  );
};

export default AdminUsersPage;
