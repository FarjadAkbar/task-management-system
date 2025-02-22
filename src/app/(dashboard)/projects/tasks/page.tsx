import React, { Suspense } from "react";
import { getTasks } from "@/actions/projects/get-tasks";
import { columns } from "./components/columns";

import { Button } from "@/components/ui/button";
import H2Title from "@/components/typography/h2";
import SuspenseLoading from "@/components/loadings/suspense";
import Link from "next/link";
import { requireUser } from "@/lib/user";
import { DataTable } from "../../components/table-components/data-table";
import { priorities, statuses } from "./data/data";

const TasksPage = async () => {
  const tasks: any = await getTasks();
  const user = await requireUser();
  const userId = user?.id;

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
        <DataTable data={tasks} columns={columns} 
        filters={[
                            { name: "title", isInput: true }, // Input search
                            { name: "taskStatus", options: statuses },
                            { name: "priority", options: priorities },
                          ]} />
      </div>
    </Suspense>
  );
};

export default TasksPage;
