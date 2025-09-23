import { 
  TaskSearchFilters, 
  TaskFilterClause, 
  ProjectSearchFilters, 
  ProjectFilterClause,
  UserSearchFilters,
  UserFilterClause,
  FileSearchFilters,
  FileFilterClause
} from "@/types/type"

/**
 * Build task filter clauses from search filters
 */
export function buildTaskFilters(filters: TaskSearchFilters, userId: string): TaskFilterClause[] {
  const filterClauses: TaskFilterClause[] = []

  if (filters.query) {
    filterClauses.push({
      OR: [
        { title: { contains: filters.query, mode: "insensitive" } },
        { content: { contains: filters.query, mode: "insensitive" } },
      ],
    })
  }

  if (filters.priority) {
    filterClauses.push({ priority: filters.priority })
  }

  if (filters.status) {
    filterClauses.push({ taskStatus: filters.status })
  }

  if (filters.assignedToMe) {
    filterClauses.push({
      assignees: {
        some: {
          userId,
        },
      },
    })
  }

  if (filters.createdByMe) {
    filterClauses.push({ createdBy: userId })
  }

  if (filters.sprintId) {
    filterClauses.push({ sprintId: filters.sprintId })
  }

  if (filters.projectId) {
    filterClauses.push({
      sprint: {
        projectId: filters.projectId,
      },
    })
  }

  return filterClauses
}

/**
 * Build project filter clauses from search filters
 */
export function buildProjectFilters(filters: ProjectSearchFilters, userId: string): ProjectFilterClause[] {
  const filterClauses: ProjectFilterClause[] = []

  if (filters.query) {
    filterClauses.push({
      name: { contains: filters.query, mode: "insensitive" }
    })
  }

  if (filters.status) {
    filterClauses.push({ status: filters.status })
  }

  if (filters.createdByMe) {
    filterClauses.push({ createdById: userId })
  }

  if (filters.memberOf) {
    filterClauses.push({
      members: { some: { userId } }
    })
  }

  return filterClauses
}

/**
 * Build user filter clauses from search filters
 */
export function buildUserFilters(filters: UserSearchFilters): UserFilterClause[] {
  const filterClauses: UserFilterClause[] = []

  if (filters.query) {
    filterClauses.push({
      OR: [
        { name: { contains: filters.query, mode: "insensitive" } },
        { email: { contains: filters.query, mode: "insensitive" } },
      ],
    })
  }

  if (filters.role) {
    filterClauses.push({ role: filters.role })
  }

  if (filters.status) {
    filterClauses.push({ userStatus: filters.status })
  }

  return filterClauses
}

/**
 * Build file filter clauses from search filters
 */
export function buildFileFilters(filters: FileSearchFilters): FileFilterClause[] {
  const filterClauses: FileFilterClause[] = []

  if (filters.query) {
    filterClauses.push({
      name: { contains: filters.query, mode: "insensitive" }
    })
  }

  if (filters.type) {
    filterClauses.push({ type: filters.type })
  }

  if (filters.mimeType) {
    filterClauses.push({ mimeType: filters.mimeType })
  }

  if (filters.uploadedBy) {
    filterClauses.push({ uploadedBy: filters.uploadedBy })
  }

  return filterClauses
}

/**
 * Parse URL search parameters into filter objects
 */
export function parseSearchParams(searchParams: URLSearchParams) {
  return {
    query: searchParams.get("q") || undefined,
    page: parseInt(searchParams.get("page") || "1"),
    limit: parseInt(searchParams.get("limit") || "10"),
    sortBy: searchParams.get("sortBy") || undefined,
    sortOrder: (searchParams.get("sortOrder") as "asc" | "desc") || "desc",
  }
}

/**
 * Build task access control where clause
 */
export function buildTaskAccessClause(userId: string) {
  return {
    OR: [
      // Tasks created by the user
      { createdBy: userId },
      // Tasks assigned to the user
      { assignees: { some: { userId } } },
      // Tasks in projects where the user is a member
      {
        sprint: {
          project: {
            members: {
              some: {
                userId,
              },
            },
          },
        },
      },
      // Tasks in projects created by the user
      {
        sprint: {
          project: {
            createdById: userId,
          },
        },
      },
    ],
  }
}
