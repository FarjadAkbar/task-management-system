import type { Project, ProjectMember, Sprint } from "@prisma/client"


export type ProjectType = Project & {
  sprints: Sprint[];
  members: ProjectMember[];
  stats: {
    totalTasks: number
    completedTasks: number
    completionPercentage: number
    totalMembers: number
    activeSprints: number
  }
}

// Types
export type CreateProjectPayloadType = {
  name: string
  description?: string
  startDate: Date
  endDate?: Date
  status?: string
  members?: { userId: string; role: string }[]
}

export type ProjectWithStatsType = Project & {
  stats: {
    totalTasks: number
    completedTasks: number
    completionPercentage: number
    totalMembers: number
    activeSprints: number
  }
}

export type ProjectWithDetailsType = Project & {
  members: ProjectMember[]
  sprints: Sprint[]
  stats: {
    totalTasks: number
    completedTasks: number
    completionPercentage: number
    totalMembers: number
    activeSprints: number
  }
}

export type MemberContributionType = {
  userId: string
  name: string
  email: string
  avatar: string | null
  tasksAssigned: number
  tasksCompleted: number
  totalWeight: number
  completedWeight: number
  completionPercentage: number
  averageRating: number | null
}