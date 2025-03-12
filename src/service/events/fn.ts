import API from "@/lib/axios-client";
import {
  AvailablityType,
  CalendarViewRangeType,
  CreateEventInputType,
  EventWithRelationsType,
  UpdateEventInputType,
} from "./type";

export const getEventsFn = async (range?: CalendarViewRangeType) => {
  const params = new URLSearchParams();
  if (range?.start) params.append("start", range.start.toISOString());
  if (range?.end) params.append("end", range.end.toISOString());

  const response = await API.get<{ events: EventWithRelationsType[] }>(
    `/calendar/events?${params}`
  );
  return response.data.events;
};

export const getEventFn = async (eventId: string | null) => {
  if (!eventId) return null;
  const response = await API.get<{ event: EventWithRelationsType }>(
    `/calendar/events/${eventId}`
  );
  return response.data.event;
};

export const createEventFn = async (data: CreateEventInputType) => {
  const response = await API.post<{ event: EventWithRelationsType }>(
    "/calendar/events",
    data
  );
  return response.data.event;
};

export const updateEventFn = async (data: UpdateEventInputType) => {
  const response = await API.put<{ event: EventWithRelationsType }>(
    `/calendar/events/${data.id}`,
    data
  );
  return response.data.event;
};

export const deleteEventFn = async (eventId: string) => {
  await API.delete(`/calendar/events/${eventId}`);
  return eventId;
};

export const getAvailabilityFn = async (userId?: string) => {
  const params = new URLSearchParams();
  if (userId) params.append("userId", userId);

  const response = await API.get<{ availability: AvailablityType[] }>(
    `/calendar/availability?${params}`
  );
  return response.data.availability;
};

export const updateAvailabilityFn = async (data: {
  day: string;
  startTime: string;
  endTime: string;
  isActive: boolean;
  id?: string;
}) => {
  if (data.id) {
    const response = await API.put<{ availability: AvailablityType }>(
      `/calendar/availability/${data.id}`,
      data
    );
    return response.data.availability;
  } else {
    const response = await API.post<{ availability: AvailablityType }>(
      "/calendar/availability",
      data
    );
    return response.data.availability;
  }
};

export const syncEventsFn = async () => {
  const response = await API.post("/calendar/sync");
  return response.data;
};
