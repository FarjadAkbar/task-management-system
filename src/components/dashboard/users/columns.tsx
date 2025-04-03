"use client";
import moment from "moment";
import { ColumnDef } from "@tanstack/react-table";
import { DataTableRowActions } from "./data-table-row-actions";
import { formatDistanceToNowStrict } from "date-fns";
import { UserType } from "@/service/users/type";
import { DataTableColumnHeader } from "@/components/table-components/data-table-column-header";
import { ActiveStatus, RoleEnum } from "@prisma/client";

export const columns: ColumnDef<UserType>[] = [
  /*   {
    accessorKey: "id",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="id" />
    ),
    cell: ({ row }) => <div className="">{row.getValue("id")}</div>,
    enableSorting: false,
    enableHiding: false,
  }, */
  {
    accessorKey: "created_at",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Date created" />
    ),
    cell: ({ row }) => (
      <div className="w-[130px]">
        {moment(row.getValue("created_at")).format("YYYY/MM/DD-HH:mm")}
      </div>
    ),
    enableSorting: true,
    enableHiding: true,
  },
  {
    accessorKey: "lastLoginAt",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Last login" />
    ),
    cell: ({ row }) => (
      <div className="min-w-[150px]">
        {/*   {moment(row.getValue("lastLoginAt")).format("YYYY/MM/DD-HH:mm")} */}
        {formatDistanceToNowStrict(
          new Date(row.original.lastLoginAt || new Date()),
          {
            addSuffix: true,
          }
        )}
      </div>
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Name" />
    ),

    cell: ({ row }) => <div className="">{row.getValue("name")}</div>,
    enableSorting: true,
    enableHiding: true,
  },
  {
    accessorKey: "email",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="E-mail" />
    ),

    cell: ({ row }) => <div className="">{row.getValue("email")}</div>,
    enableSorting: true,
    enableHiding: true,
  },
  {
    accessorKey: "role",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Role" />
    ),

    cell: ({ row }) => (
      <div className="">{row.getValue("role")}</div>
    ),
    enableSorting: true,
    enableHiding: true,
  },

  {
    accessorKey: "userStatus",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Status" />
    ),
    cell: ({ row }) => {
      const status = ActiveStatus[row.getValue("userStatus") as ActiveStatus];

      if (!status) {
        return null;
      }

      return (
        <div className="flex items-center">
          {/* {status.icon && (
            <status.icon className="mr-2 h-4 w-4 text-muted-foreground" />
          )} */}
          <span>{status}</span>
        </div>
      );
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    id: "actions",
    cell: ({ row }) => <DataTableRowActions row={row} />,
  },
];
