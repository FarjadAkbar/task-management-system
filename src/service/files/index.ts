import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { addShareMutationFn, deleteFileMutationFn, getFilesSharedWithMeFn, getPrivarteFilesQueryFn, getSharedFilesQueryFn, removeShareMutationFn } from "./fn";
import { FileQueryParams } from "./type";



// Get private files
export const useGetPrivateFilesQuery = (params: FileQueryParams = {}) => {
  return useQuery({
    queryKey: ["privateFiles", params],
    queryFn: async () => getPrivarteFilesQueryFn(params),
    staleTime: 1000 * 60, // 1 minute
  })
}

// Get shared files (files that the user has shared with others)
export const useGetSharedFilesQuery = (params: FileQueryParams = {}) => {
  return useQuery({
    queryKey: ["sharedFiles", params],
    queryFn: async () => getSharedFilesQueryFn(params),
    staleTime: 1000 * 60, // 1 minute
  })
}

// Get files shared with me
export const useGetFilesSharedWithMeQuery = (params: FileQueryParams = {}) => {

  return useQuery({
    queryKey: ["filesSharedWithMe", params],
    queryFn: async () => getFilesSharedWithMeFn(params),
    staleTime: 1000 * 60, // 1 minute
  })
}

// Share a file with users
export const useShareFileMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: addShareMutationFn,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["privateFiles"] })
      queryClient.invalidateQueries({ queryKey: ["sharedFiles"] })
    },
  })
}

// Remove file sharing for a user
export const useRemoveShareMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: removeShareMutationFn,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["privateFiles"] })
      queryClient.invalidateQueries({ queryKey: ["sharedFiles"] })
    },
  })
}

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