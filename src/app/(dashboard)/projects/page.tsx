import React, { Suspense } from "react";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Session } from "next-auth";

import ProjectsView from "./_components/ProjectsView";
import SuspenseLoading from "@/components/loadings/suspense";
import { ProjectList } from "@/components/dashboard/projects/project-list";

export const maxDuration = 300;

const ProjectsPage = async () => {
  const session: Session | null = await getServerSession(authOptions);

  if (!session) return redirect("/sign-in");

  return (
    <Suspense fallback={<SuspenseLoading />}>
      <ProjectList />
    </Suspense>
  );
};

export default ProjectsPage;
