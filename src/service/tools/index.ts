import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import API from "@/lib/axios-client"; // Adjust the import path based on your project structure
import {
  CreateToolPayloadType,
  UpdateToolPayloadType,
  AllToolsPayloadType,
  ToolType,
  AllToolsResponseType,
} from "./type"; // Adjust import path accordingly

export const createToolMutationFn = async (
  data: CreateToolPayloadType
): Promise<{ message: string; tool: ToolType }> => {
  console.log(data, "data");
  const response = await API.post(`/tool`, data);
  return response.data;
};

export const editToolMutationFn = async (
  data: UpdateToolPayloadType
): Promise<{ message: string; tool: ToolType }> => {
  const response = await API.put(`/tool/${data.id}`, data);
  return response.data;
};

export const getAllToolsQueryFn = async (
  params: AllToolsPayloadType
): Promise<AllToolsResponseType> => {
  const { keyword, department, pageSize = 10, pageNumber = 1 } = params;
  const response = await API.get(
    `/tool?&keyword=${keyword || ""}&department=${department || ""}&pageSize=${pageSize}&pageNumber=${pageNumber}`
  );
  return response.data;
};

export const getToolByIdQueryFn = async (
  toolId: string
): Promise<{ message: string; tool: ToolType }> => {
  const response = await API.get(`/tool/${toolId}`);
  return response.data;
};

export const deleteToolMutationFn = async (
  toolId: string
): Promise<{ message: string }> => {
  const response = await API.delete(`/tool/${toolId}`);
  return response.data;
};

// HOOKS

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
