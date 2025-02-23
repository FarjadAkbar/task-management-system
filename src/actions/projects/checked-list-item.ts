"use server"

import { prismadb } from "@/lib/prisma"

export async function checkedListItem(taskId: string, itemId: string, checked: boolean) {
  try {
    const task = await prismadb.tasks.findUnique({
      where: { id: taskId },
      select: { checklist: true },
    })

    if (!task) throw new Error("Task not found")

    const list  = Array.isArray(task.checklist) ? task.checklist : JSON.parse(task.checklist as string);
    const updatedChecklist = list.map((item: any) => {
      if (item.id === itemId) {
        return { ...item, checked }
      }
      return item
    })

    await prismadb.tasks.update({
      where: { id: taskId },
      data: { checklist: updatedChecklist },
    })

    return { success: true }
  } catch (error) {
    console.error("Failed to update checklist item:", error)
    return { success: false, error: "Failed to update checklist item" }
  }
}

