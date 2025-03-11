import { useQuery } from "@tanstack/react-query";
import { UsersResponseType } from "./type";
import { getUserFn } from "./fn";


export const useGetUsersQuery = ({ search = "" }: { search: string }) => {
    return useQuery<UsersResponseType>({
      queryKey: ["users", search],
      queryFn: () => getUserFn(search), // Call the function properly
      staleTime: 1000 * 60 * 5, // 5 minutes
    });
  };
  