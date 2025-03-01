import { getTask } from "@/actions/projects/get-task";
import { getUserTasks } from "@/actions/projects/get-user-tasks";
import React from "react";
import { columns } from "../components/columns";
import Container from "@/app/(dashboard)/components/ui/Container";
import { requireUser } from "@/lib/user";
import { DataTable } from "@/app/(dashboard)/components/table-components/data-table";
import { priorities, statuses } from "../data/data";

type TaskDetailPageProps = {
  params: Promise<{
    userId: string;
    username: string;
  }>;
};

const TaskDetailPage = async (props: TaskDetailPageProps) => {
  const params = await props.params;
  const user = await requireUser();
  const { userId } = params;

  const tasks: any = await getUserTasks(userId);

  return (
    <Container
      title={`${user?.name}'s Tasks`}
      description={"Everything you need to know about tasks"}
    >
 <DataTable data={tasks} columns={columns} 
        filters={[
                            { label: "Title", name: "title", isInput: true }, // Input search
                            { label: "Status", name: "taskStatus", options: statuses },
                            { label: "Priority", name: "priority", options: priorities },
                          ]} />
    </Container>
  );
};

export default TaskDetailPage;
