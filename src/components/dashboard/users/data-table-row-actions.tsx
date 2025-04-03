"use client";

import { Row } from "@tanstack/react-table";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import AlertModal from "@/components/modals/alert-modal";
import { useState } from "react";
import { toast } from "@/hooks/use-toast";

import { Copy, Edit, MoreHorizontal, Trash } from "lucide-react";
import { UserType } from "@/service/users/type";
import {
  useDeleteUserMutation,
  useUserUpdateStatusMutation,
} from "@/service/users";
import { ActiveStatus } from "@prisma/client";

interface DataTableRowActionsProps<TData> {
  row: Row<TData>;
}

export function DataTableRowActions<TData>({
  row,
}: DataTableRowActionsProps<TData>) {
  const { mutate, isPending } = useDeleteUserMutation();
  const { mutate: mutateStatus, isPending: isLoading } =
    useUserUpdateStatusMutation();
  const [open, setOpen] = useState(false);
  const data = row.original as UserType;
  const userId = data.id;

  //Action triggered when the delete button is clicked to delete the store
  const onDelete = async () => {
    mutate(userId, {
      onSuccess: () => {
        toast({
          title: "Success",
          description: "User deleted successfully",
        });
        setOpen(false)
      },
      onError: (error) => {
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive",
        });
      },
    });
  };

  const onStatusUpdate = async (status: ActiveStatus) => {
    if (isLoading) return;

    const payload = {
      id: userId,
      status: status,
    };

    mutateStatus(payload, {
      onSuccess: (data) => {
        toast({
          title: "Success",
          description: "User updated successfully",
        });
      },
      onError: (error: any) => {
        toast({
          title: "Error",
          description: error.message || "Failed to update user",
          variant: "destructive",
        });
      },
    });
  };

  return (
    <>
      <AlertModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={onDelete}
        loading={isPending}
      />
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant={"ghost"} className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuItem onClick={() => onStatusUpdate(ActiveStatus.ACTIVE)}>
            <Edit className="mr-2 w-4 h-4" />
            Activate
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => onStatusUpdate(ActiveStatus.INACTIVE)}
          >
            <Edit className="mr-2 w-4 h-4" />
            Deactivate
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setOpen(true)}>
            <Trash className="mr-2 w-4 h-4" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}
