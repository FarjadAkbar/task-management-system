"use client";
import React from "react";
import { useGetUsersQuery } from "@/service/users";
import SuspenseLoading from "@/components/loadings/suspense";
import { DataTable } from "@/components/table-components/data-table";
import { columns } from "./columns";
import { RoleEnum } from "@prisma/client";

export default function UsersList() {
  const { data, isLoading, isError } = useGetUsersQuery({ search: "" });
  const roleOptions = Object.entries(RoleEnum).map(([key, value]) => ({
    label: key.replaceAll("_", " "), // Format the label if needed
    value: value,
  }));

  return isLoading ? (
    <SuspenseLoading />
  ) : data?.users?.length === 0 ? (
    <h4 className="scroll-m-20 text-xl font-semibold tracking-tight">
      No users found
    </h4>
  ) : (
    data?.users && (
      <DataTable
        data={data.users}
        columns={columns}
        filters={[
            { label: "Name", name: "name", isInput: true },
            { label: "Role", name: "role", options: roleOptions },
        ]}
      />
    )
  );
}
