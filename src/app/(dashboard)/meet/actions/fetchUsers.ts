"use server"

import { prismadb } from "@/lib/prisma"
import type { RoleEnum } from "@prisma/client"

export const fetchUsersByRole = async (role: RoleEnum | "ONE_ON_ONE") => {
  try {
    if (role === "ONE_ON_ONE") {
      return await prismadb.users.findMany({
        select: { id: true, name: true, email: true },
      })
    }

    const users = await prismadb.users.findMany({
      where: { role },
      select: { id: true, name: true, email: true },
    })
    return users
  } catch (error) {
    console.error("Error fetching users by role:", error)
    throw new Error("Failed to fetch users")
  }
}

