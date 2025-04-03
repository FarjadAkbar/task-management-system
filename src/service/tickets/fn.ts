import API from "@/lib/axios-client";
import { TicketPayloadType, TicketsResponseType, TicketType, UpdateTicketPayloadType } from "./type";

export const getTickestFn = async (
    search: string
  ): Promise<TicketsResponseType> => {
    const response = await API.get(`/tickets?search=${search}`);
    return response.data;
  };


  export const ticketMutationFn = async (
    data: TicketPayloadType
  ): Promise<{ message: string; tool: TicketType }> => {
    const response = await API.post(`/tickets`, data);
    return response.data;
  };

  
  export const updateTicketMutationFn = async (
    data: UpdateTicketPayloadType
  ): Promise<{ message: string; user: TicketType }> => {
    const response = await API.put(`/tickets/${data.id}`, data);
    return response.data;
  };


  export const deleteTicketMutationFn = async (
    ticketId: string
  ): Promise<{ message: string }> => {
    const response = await API.delete(`/tickets/${ticketId}`);
    return response.data;
  };