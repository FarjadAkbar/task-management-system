"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { keepPreviousData } from "@tanstack/react-query";
import {
  createChatMutationFn,
  createVonageSessionFn,
  getChatRoomsFn,
  getRoomFn,
  sendMessageFn,
} from "./fn";
import { AllChatRoomPayloadType, GetRoomPayloadType } from "./type";

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
    staleTime: 1000 * 60 * 5,
    placeholderData: skip ? undefined : keepPreviousData,
    enabled: !skip,
  });

  return query;
};

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

export const useGetChatRoomQuery = ({ roomId = "", limit = 50, before }: GetRoomPayloadType) => {
  return useQuery({
    queryKey: ["chatRoom", roomId, limit, before],
    queryFn: () => getRoomFn({ roomId, limit, before }),
    staleTime: 1000 * 60 * 5,
    enabled: !!roomId,
    refetchInterval: roomId ? 5000 : false,
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
    staleTime: 1000 * 60,
    enabled: !!roomId && !!before,
  });
};

export const useSendMessageMutation = (roomId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: sendMessageFn,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["chatRoom", roomId] });
      queryClient.invalidateQueries({ queryKey: ["chatRooms"] });
    },
  });
};

export const useCreateVonageSessionMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createVonageSessionFn,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vonageSession"] });
    },
  });
};