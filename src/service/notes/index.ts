import {
    keepPreviousData,
    useMutation,
    useQuery,
    useQueryClient,
  } from "@tanstack/react-query";
  import {
    createNoteMutationFn,
    editNoteMutationFn,
    getAllNotesQueryFn,
    getNoteByIdQueryFn,
    deleteNoteMutationFn,
  } from "./fn";
  import { AllNotesPayloadType } from "./type";

export const useGetAllNotesQuery = () => {
    return useQuery({
      queryKey: ["notes"],
      queryFn: getAllNotesQueryFn,
      staleTime: 1000 * 60 * 5, 
    });
  };
  export const useGetNoteByIdQuery = (noteId?: string) => {
    return useQuery({
      queryKey: ["note", noteId],
      queryFn: () => getNoteByIdQueryFn(noteId!), 
      enabled: !!noteId, 
    });
  };
  export const useCreateNoteMutation = () => {
    const queryClient = useQueryClient();
  
    return useMutation({
      mutationFn: createNoteMutationFn,
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: ["notes"],
        });
      },
    });
  };
  
  export const useUpdateNoteMutation = () => {
    const queryClient = useQueryClient();
  
    return useMutation({
      mutationFn: editNoteMutationFn,
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: ["notes"],
        });
      },
    });
  };
  
  export const useDeleteNoteMutation = () => {
    const queryClient = useQueryClient();
  
    return useMutation({
      mutationFn: deleteNoteMutationFn,
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: ["notes"],
        });
      },
    });
  };
  

  //   export const useGetNotesQuery = ({
//     pageSize = 10,
//     pageNumber = 1,
//     keyword = "",
//     category = "",
//     skip = false,
//   }: AllNotesPayloadType) => {
//     return useQuery({
//       queryKey: ["notes", pageNumber, pageSize, keyword, category],
//       queryFn: () =>
//         getAllNotesQueryFn({
//           pageSize,
//           pageNumber,
//           keyword,
//           category,
//         }),
//       staleTime: 1000 * 60 * 5, // 5 minutes
//       placeholderData: skip ? undefined : keepPreviousData,
//       enabled: !skip,
//     });
//   };