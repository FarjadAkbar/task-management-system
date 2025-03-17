import TaskList from "@/components/dashboard/tasks/task-list";


interface TaskPageProps {
  params: Promise<{ id: string; taskId: string }>;
}

export default async function TaskPage({ params }: TaskPageProps) {
  const { id, taskId } = await params;
  return (
    <TaskList projectId={id} taskId={taskId} />
  )
}

