import ProjectDetail from "@/components/dashboard/projects/project-detail";

interface ProjectPageProps {
  params: Promise<{ id: string }>;
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { id } = await params;
  return (
    <ProjectDetail projectId={id} />
  )
}

