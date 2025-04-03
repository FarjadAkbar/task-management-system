import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { TicketsResponseType, TicketType } from "./type";
import { deleteTicketMutationFn, getTickestFn, ticketMutationFn, updateTicketMutationFn } from "./fn";


export const useGetTicketsQuery = ({ search = "" }: { search: string }) => {
    return useQuery<TicketsResponseType>({
      queryKey: ["tickets", search],
      queryFn: () => getTickestFn(search), // Call the function properly
      staleTime: 1000 * 60 * 5, // 5 minutes
    });
  };
  

export const useTicketMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ticketMutationFn,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["tickets"],
      });
    },
  });
};


export const useDeleteTicketMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteTicketMutationFn,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["tickets"],
      });
    },
  });
};


export const useUpdateTicketMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: updateTicketMutationFn,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tickets"] })
    },
  })
}