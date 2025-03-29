"use client";

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger
} from "@/components/ui/alert-dialog";
import { RiDeleteBin6Line } from "react-icons/ri";
import { Button } from "../ui/button";

interface DeleteConfirmationDialogProps {
    name: string;
    onDelete: (name: string) => void;
}

const DeleteConfirmationDialog: React.FC<DeleteConfirmationDialogProps> = ({ name, onDelete }) => {
    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                <Button variant="destructive" size="sm">
                    <RiDeleteBin6Line /> Delete
                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent className="bg-white shadow-lg text-left">
                <AlertDialogHeader>
                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete <strong>{name}</strong>.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel className="mt-0 bg-gray-100 hover:bg-gray-200">Cancel</AlertDialogCancel>
                    <AlertDialogAction className="text-gold hover:bg-gold hover:text-black" onClick={() => onDelete(name)}>Delete</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
};

export default DeleteConfirmationDialog;
