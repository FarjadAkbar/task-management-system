
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { addProjectMember, createProject, deleteProject, fetchProject, fetchProjectContributions, fetchProjectMembers, fetchProjects, generateProjectReport, removeProjectMember, updateProject } from "./fn";


export const useProjects = () => {
  return useQuery({
    queryKey: ["projects"],
    queryFn: fetchProjects,
  });
};

export const useProject = (projectId: string | null) => {
  return useQuery({
    queryKey: ["project", projectId],
    queryFn: () => (projectId ? fetchProject(projectId) : null),
    enabled: !!projectId,
  });
};

export const useCreateProject = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createProject,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
    },
  });
};

export const useUpdateProject = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateProject,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      queryClient.invalidateQueries({ queryKey: ["project", variables.projectId] });
    },
  });
};

export const useDeleteProject = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteProject,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
    },
  });
};

export const useProjectMembers = (projectId: string | null) => {
  return useQuery({
    queryKey: ["project-members", projectId],
    queryFn: () => (projectId ? fetchProjectMembers(projectId) : []),
    enabled: !!projectId,
  });
};

export const useAddProjectMember = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: addProjectMember,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["project-members", variables.projectId] });
      queryClient.invalidateQueries({ queryKey: ["project", variables.projectId] });
    },
  });
};

export const useRemoveProjectMember = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: removeProjectMember,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["project-members", variables.projectId] });
      queryClient.invalidateQueries({ queryKey: ["project", variables.projectId] });
    },
  });
};

export const useProjectContributions = (projectId: string | null) => {
  return useQuery({
    queryKey: ["project-contributions", projectId],
    queryFn: () => (projectId ? fetchProjectContributions(projectId) : []),
    enabled: !!projectId,
  });
};

export const useGenerateProjectReport = () => {
  return useMutation({
    mutationFn: generateProjectReport,
  });
};
