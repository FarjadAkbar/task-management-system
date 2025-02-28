import { z } from "zod";

// We're keeping a simple non-relational schema here.
// IRL, you will have a schema for your data models.
export const ticketSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  priority: z.string(),
  createdBy: z.object({
    name: z.string(),
  }),
  assignedTo: z.object({
    name: z.string(),
  }),
});

export type Ticket = z.infer<typeof ticketSchema>;
