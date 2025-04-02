import {
  ActiveStatus,
  RoleEnum,
  TicketPriority,
  TicketStatus,
} from "@prisma/client";
import { UserType } from "../users/type";

export type TicketType = {
  id: string;
  title: string;
  description: string;
  status: TicketStatus;
  priority: TicketPriority;
  createdAt: Date;
  updatedAt: Date;
  createdById: String;
  assignedToId: String;
  createdBy: UserType;
  assignedTo: UserType;
};

export type TicketsResponseType = {
  message: string;
  tickets: TicketType[];
};


export type TicketPayloadType = {
  title: string;
  description: string;
  priority: string;
};

export type UpdateTicketPayloadType = TicketPayloadType & {
  id: string;
}