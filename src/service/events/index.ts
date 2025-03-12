import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { CalendarViewRangeType } from "./type";
import {
  createEventFn,
  deleteEventFn,
  getAvailabilityFn,
  getEventFn,
  getEventsFn,
  syncEventsFn,
  updateAvailabilityFn,
  updateEventFn,
} from "./fn";
import { createEvent, updateEvent } from "@/lib/google-calendar";

// Fetch events for the current user
export function useEvents(range?: CalendarViewRangeType) {
  return useQuery({
    queryKey: [
      "events",
      range?.start?.toISOString(),
      range?.end?.toISOString(),
    ],
    queryFn: async () => getEventsFn(range),
  });
}

// Fetch a single event
export function useEvent(eventId: string | null) {
  return useQuery({
    queryKey: ["event", eventId],
    queryFn: async () => getEventFn(eventId),
    enabled: !!eventId,
  });
}

// Create a new event
export function useCreateEvent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createEventFn,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["events"] });
    },
  });
}

// Update an existing event
export function useUpdateEvent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateEventFn,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["events"] });
      queryClient.invalidateQueries({ queryKey: ["event", variables.id] });
    },
  });
}

// Delete an event
export function useDeleteEvent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteEventFn,
    onSuccess: (eventId) => {
      queryClient.invalidateQueries({ queryKey: ["events"] });
      queryClient.invalidateQueries({ queryKey: ["event", eventId] });
    },
  });
}

// Fetch user availability
export function useAvailability(userId?: string) {
  return useQuery({
    queryKey: ["availability", userId],
    queryFn: async () => getAvailabilityFn(userId),
    enabled: !!userId,
  });
}

// Update user availability
export function useUpdateAvailability() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateAvailabilityFn,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["availability"] });
    },
  });
}

// Sync events from Google Calendar
export function useSyncEvents() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: syncEventsFn,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["events"] });
    },
  });
}
