import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { AllToolsPayloadType } from "./type"; // Adjust import path accordingly
import { createToolMutationFn, deleteToolMutationFn, editToolMutationFn, getAllToolsQueryFn } from "./fn";

export const useGetToolsQuery = ({
  pageSize = 10,
  pageNumber = 1,
  keyword = "",
  department = "",
  skip = false,
}: AllToolsPayloadType) => {
  const query = useQuery({
    queryKey: ["tools", pageNumber, pageSize, keyword, department],
    queryFn: () =>
      getAllToolsQueryFn({
        pageSize,
        pageNumber,
        keyword,
        department,
      }),
    staleTime: 1000 * 60 * 5, // 5 minutes
    placeholderData: skip ? undefined : keepPreviousData,
    enabled: !skip,
  });

  return query;
};

export const useCreateToolMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createToolMutationFn,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["tools"],
      });
    },
  });
};


export const useUpdateToolMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: editToolMutationFn,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["tools"],
      });
    },
  });
};

export const useDeleteToolMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteToolMutationFn,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["tools"],
      });
    },
  });
};
