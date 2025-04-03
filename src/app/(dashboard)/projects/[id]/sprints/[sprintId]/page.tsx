import SprintDetail from "@/components/dashboard/projects/sprint";


interface SprintPageProps {
  params: Promise<{ id: string; sprintId: string }>;
}

export default async function SprintPage({ params }: SprintPageProps) {
  const { id, sprintId } = await params;
  return <SprintDetail projectId={id} sprintId={sprintId} />
}

