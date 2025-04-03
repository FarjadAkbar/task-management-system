import API from "@/lib/axios-client";
import { InvitePayloadType, UpdateStatusPayloadType, UsersResponseType, UserType } from "./type";

export const getUserFn = async (
    search: string
  ): Promise<UsersResponseType> => {
    const response = await API.get(`/users?search=${search}`);
    return response.data;
  };
  

  export const inviteUserMutationFn = async (
    data: InvitePayloadType
  ): Promise<{ message: string; tool: UserType }> => {
    const response = await API.post(`/users/invite`, data);
    return response.data;
  };

  
  export const editUserStatusMutationFn = async (
    data: UpdateStatusPayloadType
  ): Promise<{ message: string; user: UserType }> => {
    const response = await API.put(`/users/${data.id}`, data);
    return response.data;
  };


  export const deleteUserMutationFn = async (
    userId: string
  ): Promise<{ message: string }> => {
    const response = await API.delete(`/users/${userId}`);
    return response.data;
  };