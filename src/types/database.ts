// Database model types (generated from Prisma)

import { Prisma } from '@prisma/client'

// Project types
export type Project = Prisma.ProjectGetPayload<{
  include: {
    members: true
    tasks: true
    sprints: true
  }
}>

export type ProjectWithMembers = Prisma.ProjectGetPayload<{
  include: {
    members: {
      include: {
        user: true
      }
    }
  }
}>

// Task types
export type Task = Prisma.TasksGetPayload<{
  include: {
    assignee: true
    project: true
    sprint: true
    comments: true
    attachments: true
  }
}>

export type TaskWithDetails = Prisma.TasksGetPayload<{
  include: {
    assignee: true
    project: true
    sprint: true
    comments: {
      include: {
        author: true
      }
    }
    attachments: true
    checklist: true
  }
}>

// User types
export type User = Prisma.UsersGetPayload<{
  include: {
    projects: true
    tasks: true
    comments: true
  }
}>

// Sprint types
export type Sprint = Prisma.SprintGetPayload<{
  include: {
    project: true
    tasks: true
  }
}>

// Chat types
export type ChatRoom = Prisma.ChatRoomGetPayload<{
  include: {
    messages: {
      include: {
        sender: true
      }
    }
    participants: {
      include: {
        user: true
      }
    }
  }
}>

export type ChatMessage = Prisma.ChatMessageGetPayload<{
  include: {
    sender: true
    room: true
  }
}>

// Calendar types
export type CalendarEvent = Prisma.CalendarEventGetPayload<{
  include: {
    creator: true
    attendees: {
      include: {
        user: true
      }
    }
  }
}>

// File types
export type Document = Prisma.DocumentsGetPayload<{
  include: {
    uploader: true
    project: true
    task: true
  }
}>

// Ticket types
export type Ticket = Prisma.TicketGetPayload<{
  include: {
    creator: true
    assignee: true
    project: true
  }
}>

// Note types
export type Note = Prisma.NotesGetPayload<{
  include: {
    author: true
  }
}>
