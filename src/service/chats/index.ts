"use client";

import { useEffect, useRef, useState } from "react";
import { io, type Socket } from "socket.io-client";
import { User } from "next-auth";
import API from "@/lib/axios-client";
import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { addMembersToGroupFn, createChatMutationFn, getChatRoomsFn, getRoomFn, leaveGroupFn, removeMemberFromGroupFn, sendMessageFn } from "./fn";
import { AllChatRoomPayloadType, GetRoomPayloadType, TypingUserType } from "./type";

export const useChatSocket = (activeUser: User, roomId?: string) => {
  const socket = useRef<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [typingUsers, setTypingUsers] = useState<TypingUserType[]>([]);

  useEffect(() => {
    // Initialize socket connection
    const initSocket = async () => {
      await API.get("/socket");

      if (!socket.current) {
        socket.current = io({
          path: "/api/socket",
        });

        socket.current.on("connect", () => {
          console.log("Socket connected");
          setIsConnected(true);
        });

        socket.current.on("disconnect", () => {
          console.log("Socket disconnected");
          setIsConnected(false);
        });

        socket.current.on("user-typing", ({ userId, username }: TypingUserType) => {
          setTypingUsers((prev) => {
            if (!prev.some((user) => user.userId === userId)) {
              return [...prev, { userId, username }];
            }
            return prev;
          });
        });

        socket.current.on(
          "user-stop-typing",
          ({ userId }: { userId: string }) => {
            setTypingUsers((prev) =>
              prev.filter((user) => user.userId !== userId)
            );
          }
        );

        socket.current.on("new-message", (message) => {
          // This will be handled by the chat context
        });
      }
    };

    initSocket();

    return () => {
      if (socket.current) {
        socket.current.disconnect();
      }
    };
  }, []);

  // Join/leave room when roomId changes
  useEffect(() => {
    if (socket.current && isConnected && roomId) {
      // Join the room
      socket.current.emit("join-room", roomId);

      return () => {
        // Leave the room when component unmounts or roomId changes
        socket.current?.emit("leave-room", roomId);
      };
    }
  }, [roomId, isConnected]);

  // Function to emit typing event
  const emitTyping = () => {
    if (socket.current && roomId && activeUser) {
      socket.current.emit("typing", {
        roomId,
        userId: activeUser.id,
        username: activeUser.name || activeUser.email,
      });
    }
  };

  // Function to emit stop typing event
  const emitStopTyping = () => {
    if (socket.current && roomId && activeUser) {
      socket.current.emit("stop-typing", {
        roomId,
        userId: activeUser.id,
      });
    }
  };

  // Function to emit new message event
  const emitNewMessage = (message: any) => {
    if (socket.current && roomId) {
      socket.current.emit("new-message", {
        roomId,
        message,
      });
    }
  };

  return {
    socket: socket.current,
    isConnected,
    typingUsers,
    emitTyping,
    emitStopTyping,
    emitNewMessage,
  };
};

export const useGetChatRoomsQuery = ({
  pageSize = 30,
  pageNumber = 1,
  keyword = "",
  skip = false,
}: AllChatRoomPayloadType) => {
  const query = useQuery({
    queryKey: ["chatRooms", pageNumber, pageSize, keyword],
    queryFn: () =>
      getChatRoomsFn({
        pageSize,
        pageNumber,
        keyword,
      }),
    staleTime: 1000 * 60 * 5, // 5 minutes
    placeholderData: skip ? undefined : keepPreviousData,
    enabled: !skip,
  });

  return query;
};

// Create a new chat room
export const useCreateChatRoomMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createChatMutationFn,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["chatRooms"],
      });
    },
  });
};

// Get a specific chat room with messages

export const useGetChatRoomQuery = ({ roomId = "", limit = 50, before }: GetRoomPayloadType) => {
  return useQuery({
    queryKey: ["chatRoom", roomId, limit, before],
    queryFn: () => getRoomFn({ roomId, limit, before }),
    staleTime: 1000 * 60 * 5,
    enabled: !!roomId, 
  });
};


export const useLoadMoreMessagesQuery = ({
  roomId = "",
  limit = 50,
  before,
}: GetRoomPayloadType) => {
  return useQuery({
    queryKey: ["chatMessages", roomId, limit, before],
    queryFn: () =>
      getRoomFn({
        roomId,
        limit,
        before,
      }),
    staleTime: 1000 * 60, // 1 minute
    enabled: !!roomId && !!before,
  });
};




// Send a new message
export const useSendMessageMutation = (activeUser: User, roomId: string) => {
    const queryClient = useQueryClient()
    const { emitNewMessage } = useChatSocket(activeUser, roomId)
  
    return useMutation({
      mutationFn: sendMessageFn,
      onSuccess: (data) => {
        // Invalidate queries to refresh the chat room
        queryClient.invalidateQueries({ queryKey: ["chatRoom", roomId] })
        queryClient.invalidateQueries({ queryKey: ["chatRooms"] })
  
        // Emit the new message via socket
        emitNewMessage(data.chatMessage)
      },
    })
  }
  

  
// Hook for adding members to a group
export const useAddMembersToGroup = (roomId: string) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (userIds: string[]) => addMembersToGroupFn({ roomId, userIds }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["chatRooms"],
      })
      queryClient.invalidateQueries({
        queryKey: ["chatRoom", roomId],
      })
    },
  })
}

// Hook for removing a member from a group
export const useRemoveMemberFromGroup = (roomId: string) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (memberId: string) => removeMemberFromGroupFn({ roomId, memberId }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["chatRooms"],
      })
      queryClient.invalidateQueries({
        queryKey: ["chatRoom", roomId],
      })
    },
  })
}

// Hook for leaving a group
export const useLeaveGroup = (roomId: string) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: () => leaveGroupFn(roomId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["chatRooms"],
      })
    },
  })
}