import { prismadb } from "@/lib/prisma";
import { NextResponse } from "next/server";

export const getBoards = async (userId: string) => {
  if (!userId) {
    return null;
  }

  const boards = await prismadb.boards.findMany({
    where: {
      OR: [
        { user: userId },
        { visibility: "public" },
      ],
    },
    include: {
      sections: {
        select: {
          id: true,
          position: true,
        },
      },
      assigned_user: {
        select: {
          name: true,
        },
      },
    },
    orderBy: {
      updatedAt: "desc",
    },
  });
  
  // Map boards and fetch task counts in a single query per board
  const boardsWithTaskCounts = await Promise.all(
    boards.map(async (board) => {
      // Find the first section (ordered by position)
      const section = board.sections?.sort((a, b) => a.position - b.position)[0];
      if (!section) {
        return { ...board, total_task: 0, completed_task: 0 }; // Skip boards without sections
      }
  
      // Fetch task counts directly in the database
      const taskCounts = await prismadb.tasks.groupBy({
        by: ["taskStatus"],
        _count: {
          id: true,
        },
        where: {
          section: section.id,
        },
      });
  
      // Calculate completed and total tasks
      const totalTaskCount = taskCounts.reduce((sum, group) => sum + group._count.id, 0);
      const completedTaskCount = taskCounts
        .filter((group) => group.taskStatus === "COMPLETE")
        .reduce((sum, group) => sum + group._count.id, 0);
  
      return {
        ...board,
        total_task: totalTaskCount,
        completed_task: completedTaskCount,
      };
    })
  );
  
  return boardsWithTaskCounts;
  
};

