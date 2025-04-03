"use client";
import React from "react";
import { useGetTicketsQuery } from "@/service/tickets";
import SuspenseLoading from "@/components/loadings/suspense";
import { DataTable } from "@/components/table-components/data-table";
import { priorities, columns } from "./columns";

export default function TicketsList() {
  const { data, isLoading, isError } = useGetTicketsQuery({ search: "" });
  

  return isLoading ? (
    <SuspenseLoading />
  ) : data?.tickets?.length === 0 ? (
    <h4 className="scroll-m-20 text-xl font-semibold tracking-tight">
      No users found
    </h4>
  ) : (
    data?.tickets && (
      <DataTable
        data={data.tickets}
        columns={columns}
        filters={[
            { label: "Title", name: "title", isInput: true },
            { label: "Priority", name: "priority", options: priorities },
        ]}
      />
    )
  );
}
