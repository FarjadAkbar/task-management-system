import type { Server as NetServer } from "http"
import { Server as SocketIOServer } from "socket.io"
import { NextApiRequest, NextApiResponse } from "next";

export type NextApiResponseWithSocket = NextApiResponse & {
    socket: {
      server: NetServer & {
        io?: SocketIOServer
      }
    }
  }

export const initSocket = (req: NextApiRequest, res: NextApiResponseWithSocket) => {
    if (!res.socket.server.io) {
        const io = new SocketIOServer(res.socket.server)
        res.socket.server.io = io


        io.on("connection", (socket) => {
            console.log("a user connected")

            socket.on("join-room", (roomId: string) => {
                socket.join(roomId)
                console.log(`user joined room ${roomId}`)
            })

            socket.on("leave-room", (roomId: string) => {
                socket.leave(roomId)
                console.log(`user left room ${roomId}`)
            })

            socket.on("typing", ({ roomId, userId, username }: { roomId: string; userId: string; username: string }) => {
                socket.to(roomId).emit("user-typing", { userId, username })
            })

            socket.on("stop-typing", ({ roomId, userId }: { roomId: string; userId: string }) => {
                socket.to(roomId).emit("user-stop-typing", { userId })
            })

            socket.on("disconnect", () => {
                console.log("user disconnected")
            })
        })
    }
}