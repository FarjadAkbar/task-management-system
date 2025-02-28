import { prismadb } from "@/lib/prisma";
import { NextResponse } from "next/server";

export const getTickets = async (userId: string) => {
  if (!userId) {
    return null;
  }

  const tickets = await prismadb.ticket.findMany({
    where: {
      OR: [
        { createdById: userId },
      ],
    },
    include: {
      createdBy: {
        select: {
          name: true,
        }
      },
      assignedTo: {
        select: {
          name: true,
        }
      }
    },
    orderBy: {
      updatedAt: "desc",
    },
  });
  
  return tickets;
};

