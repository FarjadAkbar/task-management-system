"use client";

import { DotsHorizontalIcon } from "@radix-ui/react-icons";
import { Row } from "@tanstack/react-table";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { ticketSchema } from "../data/schema";
import { useRouter } from "next/navigation";
import AlertModal from "@/components/modals/alert-modal";
import { useState } from "react";
import axios from "axios";
import {
  Eye,
  EyeIcon,
  EyeOff,
  Glasses,
  Magnet,
  Pencil,
  Trash,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

import UpdateTicketForm from "../forms/UpdateTicket";

interface DataTableRowActionsProps<TData> {
  row: Row<TData>;
}

export function DataTableRowActions<TData>({
  row,
}: DataTableRowActionsProps<TData>) {
  const router = useRouter();
  const ticket = ticketSchema.parse(row.original);

  const [open, setOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const { toast } = useToast();

  const onDelete = async () => {
    setLoading(true);
    try {
      await axios.delete(`/api/tickets/${ticket.id}`);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error, ticket not deleted. Please try again.",
      });
      console.log(error);
    } finally {
      toast({
        title: "Success",
        description: `Ticket: ${ticket.title}, deleted successfully`,
      });
      router.refresh();
      setOpen(false);
      setLoading(false);
    }
  };


  return (
    <>
      <AlertModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={onDelete}
        loading={loading}
      />
      <Sheet open={editOpen} onOpenChange={() => setEditOpen(false)}>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>Edit your ticket data</SheetTitle>
            <SheetDescription></SheetDescription>
          </SheetHeader>
          <UpdateTicketForm initialData={ticket} openEdit={setEditOpen} />
        </SheetContent>
      </Sheet>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="flex h-8 w-8 p-0 data-[state=open]:bg-muted"
          >
            <DotsHorizontalIcon className="h-4 w-4" />
            <span className="sr-only">Open menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-[260px]">
          <DropdownMenuItem onClick={() => setEditOpen(true)}>
            <Pencil className="mr-2 w-4 h-4" />
            Edit
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => setOpen(true)}>
            <Trash className="mr-2 w-4 h-4" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}
