import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteFileMutationFn } from "./fn";


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