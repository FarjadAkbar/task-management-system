import API from "@/lib/axios-client";
import { UsersResponseType } from "./type";

export const getUserFn = async (
    search: string
  ): Promise<UsersResponseType> => {
    const response = await API.get(`/chat/users?search=${search}`);
    return response.data;
  };
  