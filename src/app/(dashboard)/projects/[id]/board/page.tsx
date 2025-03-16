import ProjectBoard from "@/components/dashboard/projects/board"


interface ProjectBoardPageProps {
  params: Promise<{ id: string; }>;
}

export default async function ProjectBoardPage({ params }: ProjectBoardPageProps) {
  const { id } = await params;
  return (
    <ProjectBoard projectId={id} />
  )
}

