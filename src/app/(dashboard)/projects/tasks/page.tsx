import React, { Suspense } from "react";
import { getTasks } from "@/actions/projects/get-tasks";
import { TasksDataTable } from "./components/data-table";
import { columns } from "./components/columns";

import { Button } from "@/components/ui/button";
import Container from "../../components/ui/Container";
import H2Title from "@/components/typography/h2";
import SuspenseLoading from "@/components/loadings/suspense";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import Link from "next/link";

const TasksPage = async () => {
  const tasks: any = await getTasks();
  const session = await getServerSession(authOptions);
  
  if (!session) return null;

  const userId = session.user.id;

  return (
    <Suspense fallback={<SuspenseLoading />}>
      <div className="flex justify-between items-center">
          <H2Title>All tasks</H2Title>
          <div className="flex gap-3">
            <Button>New task</Button>
            <Button asChild>
              <Link href={`/projects/tasks/${userId}`}>My Tasks</Link>
            </Button>
          </div>
      </div>
      <div>
        <TasksDataTable data={tasks} columns={columns} />
      </div>
    </Suspense>
  );
};

export default TasksPage;
