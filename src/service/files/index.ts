import API from "@/lib/axios-client";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const deleteFileMutationFn = async (
  fileId: string
): Promise<{ message: string }> => {
  const response = await API.delete(`/uploadthing/${fileId}`);
  return response.data;
};



// HOOKS
  
export const useDeleteFileMutation = () => {
  // const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteFileMutationFn,
    // onSuccess: () => {
    //   queryClient.invalidateQueries({
    //     queryKey: ["tools"],
    //   });
    // },
  });
};