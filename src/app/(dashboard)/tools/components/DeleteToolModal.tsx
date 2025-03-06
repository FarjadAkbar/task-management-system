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

interface DeleteToolDialogProps {
    toolName: string;
    onDelete: (toolName: string) => void;
}

const DeleteToolDialog: React.FC<DeleteToolDialogProps> = ({ toolName, onDelete }) => {
    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                <button className="flex items-center gap-2 w-full text-left px-2 py-1 text-sm hover:bg-gray-100">
                    <RiDeleteBin6Line /> Delete
                </button>
            </AlertDialogTrigger>
            <AlertDialogContent className="bg-white shadow-lg text-left">
                <AlertDialogHeader>
                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete <strong>{toolName}</strong>.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={() => onDelete(toolName)}>Delete</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
};

export default DeleteToolDialog;
