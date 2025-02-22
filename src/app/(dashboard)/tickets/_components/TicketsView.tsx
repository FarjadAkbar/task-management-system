import React from "react";
import Link from "next/link";
import { getServerSession } from "next-auth";
import { getTickets } from "@/actions/tickets/get-tickets";

import { authOptions } from "@/lib/auth";

import NewTicketDialog from "../dialogs/NewTicket";

import { Button } from "@/components/ui/button";
import H2Title from "@/components/typography/h2";

import { DataTable } from "../../components/table-components/data-table";
import { columns } from "../table-components/columns";
import { priorities } from "../data/data";

const TicketsView = async () => {
  const session = await getServerSession(authOptions);

  if (!session) return null;

  const userId = session.user.id;
  const tickets: any = await getTickets(userId!);
  console.log(tickets);
  return (
    <>
      <div className="pt-2 space-y-3">
        <div className="flex justify-between items-center">
          <H2Title>Tickets</H2Title>
          <div className="flex gap-3">
            <NewTicketDialog />
          </div>
        </div>
        <DataTable data={tickets} columns={columns} 
          filters={[
            { name: "title", isInput: true }, // Input search
            { name: "priority", options: priorities },
          ]} />
      </div>
    </>
  );
};

export default TicketsView;
