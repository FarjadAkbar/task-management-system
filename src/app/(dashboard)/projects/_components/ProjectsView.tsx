import React from "react";
import Link from "next/link";
import { getServerSession } from "next-auth";

import { getActiveUsers } from "@/actions/get-users";
import { getBoards } from "@/actions/projects/get-boards";

import { authOptions } from "@/lib/auth";

import NewTaskDialog from "../dialogs/NewTask";
import NewProjectDialog from "../dialogs/NewProject";

import { Button } from "@/components/ui/button";
import H2Title from "@/components/typography/h2";

import { DataTable } from "../../components/table-components/data-table";
import { columns } from "../table-components/columns";
import { visibility } from "../data/data";
// import AiAssistant from "./AiAssistant";

const ProjectsView = async () => {
  const session = await getServerSession(authOptions);

  if (!session) return null;

  const userId = session.user.id;

  const users = await getActiveUsers();
  const boards: any = await getBoards(userId!);
  console.log(boards, "boards");
  
  return (
    <>
      <div className="pt-2 space-y-3">
        <div className="flex justify-between items-center">
          <H2Title>Projects</H2Title>
          <div className="flex gap-3">
            <NewProjectDialog />
            <NewTaskDialog users={users} boards={boards} />
            <Button asChild>
              <Link href="/projects/tasks">All Tasks</Link>
            </Button>
            <Button asChild>
              <Link href={`/projects/tasks/${userId}`}>My Tasks</Link>
            </Button>
            {/* <Button asChild>
              <Link href="/projects/dashboard">Dashboard</Link>
            </Button> */}
            {/* <AiAssistant session={session} /> */}
          </div>
        </div>
        <DataTable data={boards} columns={columns}
        filters={[
                    { name: "title", isInput: true }, // Input search
                    { name: "visibility", options: visibility },
                  ]}/>
      </div>
    </>
  );
};

export default ProjectsView;
