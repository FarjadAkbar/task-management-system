import { notFound } from "next/navigation";
import React from "react";
import { EventForm } from "../_components/EventForm";
import { requireUser } from "@/lib/user";
import { getUsers } from "../actions/get-users";
import { getEventData } from "../actions/get-event";

const EditEventPage = async ({ params }: { params: { eventId: string } }) => {
  const { eventId } = await params;
  console.log(eventId);
  const user = await requireUser();
  const [employees, eventData] = await Promise.all([
    getUsers(user.id),
    getEventData(eventId),
  ]);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Add new appointment type</h1>
        <p className="text-muted-foreground mb-8">
          Create a new appointment type that allows people to book times.
        </p>
        <EventForm
          employees={employees}
          eventData={eventData}
          isEditMode={true}
          nylasEventId={eventId}
        />
      </div>
    </div>
  );
};

export default EditEventPage;
