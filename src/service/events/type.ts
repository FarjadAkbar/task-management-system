import type { CalendarEvent, EventAttendee, MeetingRoom, Day } from "@prisma/client";
import { UserType } from "../users/type";

export type EventWithRelationsType = CalendarEvent & {
  attendees: EventAttendee[];
  meetingRoom?: MeetingRoom | null;
};

export type CreateEventInputType = {
  title: string;
  description?: string;
  startTime: Date;
  endTime: Date;
  location?: string;
  attendees?: {
    email: string;
    name?: string;
    optional?: boolean;
  }[];
  createMeeting?: boolean;
  recurrence?: string[];
  allDay?: boolean;
};

export type UpdateEventInputType = Partial<CreateEventInputType> & {
  id: string;
};

export type CalendarViewRangeType = {
  start: Date;
  end: Date;
};


export type AvailablityType = {
  id: string;
  day: Day;
  startTime: string;
  endTime: string;
  isActive: boolean;
  userId: string;
  user: UserType;
}