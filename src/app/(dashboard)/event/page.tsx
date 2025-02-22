import { Button } from "@/components/ui/button";
import Link from "next/link";
import React from "react";
import { CalendarCheck2 } from "lucide-react";
import { requireUser } from "@/lib/user";
import { getEvents } from "@/actions/events/get-events";
import { EmptyState } from "./_components/EmptyState";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CalendarView } from "./_components/CalendarView";
import NewEventDialog from "./dialogs/NewEvent";
import { IEventProps } from "@/types/event";

const EventPage = async () => {
  const user = await requireUser();
  const events = await getEvents(user?.id as string);

  return (
    <>
      <div className="flex items-center justify-between px-2">
        <div className="sm:grid gap-1 hidden">
          <h1 className="font-heading text-3xl md:text-4xl">Event Types</h1>
          <p className="text-lg text-muted-foreground">
            Create and manage your event types.
          </p>
        </div>
        <div className="flex gap-2">
          <Button asChild variant={"outline"}>
              <Link href="/api/auth">
                <CalendarCheck2 className="size-4 mr-2" />
                Connect Calender to Account
              </Link>
            </Button>
            {
              user?.grantId && (
                <NewEventDialog />
              )
            }
        </div>
      </div>
      {events.data.length === 0 ? (
        <EmptyState
          title="You have no Event"
          description="You can create your first event by clicking the button below."
          grantId={user?.grantId}
        />
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Bookings</CardTitle>
            <CardDescription>
              See upcoming and past events booked through your event type links.
            </CardDescription>
          </CardHeader>
          <CardContent>
          <CalendarView events={events.data as IEventProps[]} />
          </CardContent>
        </Card>
      )}
    </>
  );
};

export default EventPage;
