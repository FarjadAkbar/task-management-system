import type { Sprint, Boards } from "@prisma/client"
import { UserType } from "../users/type"


export type CreateSprintPayloadType = {
  name: string
  goal?: string
  startDate: Date
  endDate: Date
  status?: string
}

export type SprintType = Sprint & {
  createdBy: UserType;
  project: {
    id: string
    name: string
    boards: Boards[]
  }
}