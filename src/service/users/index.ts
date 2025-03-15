import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { UsersResponseType } from "./type";
import { deleteUserMutationFn, editUserStatusMutationFn, getUserFn, inviteUserMutationFn } from "./fn";


export const useGetUsersQuery = ({ search = "" }: { search: string }) => {
    return useQuery<UsersResponseType>({
      queryKey: ["users", search],
      queryFn: () => getUserFn(search), // Call the function properly
      staleTime: 1000 * 60 * 5, // 5 minutes
    });
  };
  

export const useInviteUserMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: inviteUserMutationFn,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["users"],
      });
    },
  });
};


export const useDeleteUserMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteUserMutationFn,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["users"],
      });
    },
  });
};


export const useUserUpdateStatusMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: editUserStatusMutationFn,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] })
    },
  })
}