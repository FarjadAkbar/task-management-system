"use client";
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogTitle, DialogDescription, DialogClose } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { toast } from "react-toastify";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useUpdateNoteMutation } from "@/service/notes";
import { NoteType } from "@/service/notes/type";

interface NoteModalProps {
    isOpen: boolean;
    onClose: () => void;
    note: NoteType | null;
    mode: "view" | "edit";
    onUpdate: (updatedNote: NoteType) => void;
}

const NoteModal: React.FC<NoteModalProps> = ({ isOpen, onClose, note, mode, onUpdate }) => {
    const [editedNote, setEditedNote] = useState<NoteType | null>(null);
    const [isUpdating, setIsUpdating] = useState(false);
    const { mutate: updateNote, isPending: isMutating } = useUpdateNoteMutation();

    useEffect(() => {
        if (note) {
            setEditedNote({ ...note, visibility: note.visibility || "shared" });
        }
    }, [note]);

    if (!note) return null;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        if (editedNote) {
            setEditedNote({ ...editedNote, [e.target.name]: e.target.value });
        }
    };

    const handleVisibilityChange = (value: "shared" | "private") => {
        if (editedNote) {
            setEditedNote({ ...editedNote, visibility: value });
        }
    };

    const handleSave = async () => {
        if (!editedNote) return;
        setIsUpdating(true);

        updateNote(editedNote, {
            onSuccess: (data) => {
                toast.success("Note updated successfully!");
                onUpdate(data.note);
                onClose();
                setIsUpdating(false);
            },
            onError: (error: any) => {
                toast.error(error.message || "Failed to update the note.");
                setIsUpdating(false);
            },
        });
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose} >
            <DialogContent className="bg-gray-50 text-black border p-8  shadow-lg w-[550px]">
                <DialogTitle className="font-bold">{mode === "edit" ? "Edit Note" : "View Note"}</DialogTitle>
                <DialogDescription>{mode === "edit" ? "Update your note below:" : "Here is your note:"}</DialogDescription>
                <Label htmlFor="title">Title:</Label>
                {mode === "edit" ? (
                    <Input name="title" value={editedNote?.title || ""} onChange={handleChange}
                        className="focus:border-gold  focus-visible:ring-transparent focus-visible:ring-offset-0" />
                ) : (
                    <h2 className="text-xl font-semibold border-b-2">{note.title}</h2>
                )}
                <Label htmlFor="content">Content:</Label>
                {mode === "edit" ? (
                    <Textarea name="content" value={editedNote?.content || ""} onChange={handleChange}
                        className="focus:border-gold  focus-visible:ring-transparent focus-visible:ring-offset-0" />
                ) : (
                    <p className="text-gray-700 border-b-2">{note.content}</p>
                )}
                <Label htmlFor="visibility">Visibility</Label>
                {mode === "edit" ? (
                    <Select value={editedNote?.visibility} onValueChange={handleVisibilityChange}>
                        <SelectTrigger className="focus:border-gold  focus-visible:ring-transparent focus-visible:ring-offset-0">
                            <SelectValue placeholder="Select visibility" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="shared">Shared</SelectItem>
                            <SelectItem value="private">Private</SelectItem>
                        </SelectContent>
                    </Select>
                ) : (
                    <p className="text-gray-600 border-b-2">Visibility: {note.visibility === "shared" ? "Shared" : "Private"}</p>
                )}

                {note.visibility === "shared" && note.creatorName && (
                    <p className="text-gray-500">Shared by: {note.creatorName}</p>
                )}

                <div className="flex justify-end space-x-2">
                    {mode === "edit" && (
                        <Button onClick={handleSave} className="bg-gold text-black hover:bg-black hover:text-gold">
                            {isMutating ? "Updating..." : "Update"}
                        </Button>
                    )}
                    <DialogClose asChild>
                        <Button variant="ghost">Close</Button>
                    </DialogClose>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default NoteModal;