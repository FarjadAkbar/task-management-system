import { prismadb } from "@/lib/prisma"
import { TaskType } from "@/service/tasks/type"
import { MemberContributionType, ProjectWithDetailsType, ProjectWithStatsType } from "@/service/projects/type"


// Get project with basic stats
export async function getProjectWithStats(projectId: string): Promise<ProjectWithStatsType | null> {
  const project = await prismadb.project.findUnique({
    where: { id: projectId },
  })

  if (!project) return null

  // Get task stats
  const totalTasks = await prismadb.tasks.count({
    where: {
      sprint: {
        projectId,
      },
    },
  })

  const completedTasks = await prismadb.tasks.count({
    where: {
      sprint: {
        projectId,
      },
      taskStatus: "COMPLETE",
    },
  })

  const totalMembers = await prismadb.projectMember.count({
    where: { projectId },
  })

  const activeSprints = await prismadb.sprint.count({
    where: {
      projectId,
      status: "ACTIVE",
    },
  })

  return {
    ...project,
    stats: {
      totalTasks,
      completedTasks,
      completionPercentage: totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0,
      totalMembers,
      activeSprints,
    },
  }
}

// Get project with detailed information
export async function getProjectWithDetails(projectId: string): Promise<ProjectWithDetailsType | null> {
  const project = await prismadb.project.findUnique({
    where: { id: projectId },
    include: {
      members: {
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              avatar: true,
            },
          },
        },
      },
      sprints: {
        orderBy: {
          startDate: "desc",
        },
      },
    },
  })

  if (!project) return null

  // Get task stats
  const totalTasks = await prismadb.tasks.count({
    where: {
      sprint: {
        projectId,
      },
    },
  })

  const completedTasks = await prismadb.tasks.count({
    where: {
      sprint: {
        projectId,
      },
      taskStatus: "COMPLETE",
    },
  })

  const activeSprints = await prismadb.sprint.count({
    where: {
      projectId,
      status: "ACTIVE",
    },
  })

  return {
    ...project,
    members: project.members,
    sprints: project.sprints,
    stats: {
      totalTasks,
      completedTasks,
      completionPercentage: totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0,
      totalMembers: project.members.length,
      activeSprints,
    },
  }
}

// Get member contributions for a project
export async function getMemberContribution(projectId: string): Promise<MemberContributionType[]> {
  const members = await prismadb.projectMember.findMany({
    where: { projectId },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          avatar: true,
        },
      },
    },
  })

  const contributions: MemberContributionType[] = []

  for (const member of members) {
    // Get tasks assigned to this member
    const assignedTasks = await prismadb.taskAssignee.findMany({
      where: {
        userId: member.userId,
        task: {
          sprint: {
            projectId,
          },
        },
      },
      include: {
        task: true,
      },
    })

    const tasksAssigned = assignedTasks.length
    const completedTasks = assignedTasks.filter((assignment) => assignment.task.taskStatus === "COMPLETE").length

    // Calculate total weight
    const totalWeight = assignedTasks.reduce((sum, assignment) => sum + assignment.task.weight, 0)
    const completedWeight = assignedTasks
      .filter((assignment) => assignment.task.taskStatus === "COMPLETE")
      .reduce((sum, assignment) => sum + assignment.task.weight, 0)

    // Get average rating
    const ratings = await prismadb.taskFeedback.findMany({
      where: {
        userId: member.userId,
        task: {
          sprint: {
            projectId,
          },
        },
      },
      select: {
        rating: true,
      },
    })

    const averageRating =
      ratings.length > 0 ? ratings.reduce((sum, feedback) => sum + feedback.rating, 0) / ratings.length : null

    contributions.push({
      userId: member.userId,
      name: member.user.name || member.user.email,
      email: member.user.email,
      avatar: member.user.avatar,
      tasksAssigned,
      tasksCompleted: completedTasks,
      totalWeight,
      completedWeight,
      completionPercentage: totalWeight > 0 ? Math.round((completedWeight / totalWeight) * 100) : 0,
      averageRating,
    })
  }

  return contributions
}

// Generate project report
export async function generateProjectReport(projectId: string) {
  const project = await getProjectWithDetails(projectId)
  if (!project) throw new Error("Project not found")

  const contributions = await getMemberContribution(projectId)

  // Get sprint statistics
  const sprintStats = await Promise.all(
    project.sprints.map(async (sprint) => {
      const totalTasks = await prismadb.tasks.count({
        where: { sprintId: sprint.id },
      })

      const completedTasks = await prismadb.tasks.count({
        where: {
          sprintId: sprint.id,
          taskStatus: "COMPLETE",
        },
      })

      return {
        id: sprint.id,
        name: sprint.name,
        startDate: sprint.startDate,
        endDate: sprint.endDate,
        status: sprint.status,
        totalTasks,
        completedTasks,
        completionPercentage: totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0,
      }
    }),
  )

  // Get task completion over time
  const taskCompletionHistory = await prismadb.tasks.findMany({
    where: {
      sprint: {
        projectId,
      },
      taskStatus: "COMPLETE",
      completedAt: {
        not: null,
      },
    },
    select: {
      id: true,
      title: true,
      completedAt: true,
      weight: true,
    },
    orderBy: {
      completedAt: "asc",
    },
  })

  return {
    project: {
      id: project.id,
      name: project.name,
      description: project.description,
      startDate: project.startDate,
      endDate: project.endDate,
      status: project.status,
      stats: project.stats,
    },
    members: contributions,
    sprints: sprintStats,
    taskCompletionHistory,
    generatedAt: new Date(),
  }
}

// Get tasks for a sprint with details
export async function getSprintTasks(sprintId: string) {
  return prismadb.tasks.findMany({
    where: { sprintId },
    include: {
      assignees: {
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              avatar: true,
            },
          },
        },
      },
      subtasks: true,
      checklists: {
        include: {
          completedBy: {
            select: {
              id: true,
              name: true,
              avatar: true,
            },
          },
        },
      },
      documents: {
        include: {
          document: {
            select: {
              id: true,
              document_name: true,
              document_file_url: true,
              document_file_mimeType: true,
            },
          },
        },
      },
      comments: {
        include: {
          assigned_user: {
            select: {
              id: true,
              name: true,
              email: true,
              avatar: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      },
      task_feedback: {
        include: {
          user: {
            select: {
              id: true,
              name: true,
              avatar: true,
            },
          },
        },
      },
      assigned_section: true,
      sprint: {
        include: {
          project: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      },
    },
    orderBy: {
      position: "asc",
    },
  })
}

// Get task details
export async function getTaskDetails(taskId: string): Promise<TaskType | null> {
  const task = await prismadb.tasks.findUnique({
    where: { id: taskId },
    include: {
      assignees: {
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              avatar: true,
            },
          },
        },
      },
      subtasks: {
        include: {
          createdBy: {
            select: {
              id: true,
              name: true,
              email: true,
              avatar: true,
            },
          },
        },
      },
      checklists: {
        include: {
          createdBy: {
            select: {
              id: true,
              name: true,
              email: true,
              avatar: true,
            },
          },
          completedBy: {
            select: {
              id: true,
              name: true,
              email: true,
              avatar: true,
            },
          },
        },
      },
      documents: {
        include: {
          document: {
            select: {
              id: true,
              document_name: true,
              size: true,
              document_file_url: true,
              document_file_mimeType: true,
            },
          },
        },
      },
      comments: {
        include: {
          assigned_user: {
            select: {
              id: true,
              name: true,
              email: true,
              avatar: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      },
      task_feedback: {
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              avatar: true,
              role: true,
            },
          },
        },
      },
      assigned_section: true,
      sprint: {
        include: {
          project: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      },
      childTasks: {
        include: {
          assignees: {
            include: {
              user: {
                select: {
                  id: true,
                  name: true,
                  avatar: true,
                },
              },
            },
          },
        },
      },
    },
  })

  return task as TaskType | null;
}

