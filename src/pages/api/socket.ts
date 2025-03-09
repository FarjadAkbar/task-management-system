import type { NextApiRequest } from "next"
import { initSocket, type NextApiResponseWithSocket } from "@/lib/socket"

export default function handler(req: NextApiRequest, res: NextApiResponseWithSocket) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" })
  }

  // Initialize socket
  initSocket(req, res)

  res.status(200).json({ message: "Socket server is running" })
}

