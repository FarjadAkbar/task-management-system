"use client";
import { useState, useEffect } from "react";
import { FaRegEdit } from "react-icons/fa";
import AddNoteForm from "@/components/dashboard/databases/AddNoteForm";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { FaEllipsisV } from "react-icons/fa";
import { GrView } from "react-icons/gr";
import EditNoteModal from "@/components/dashboard/databases/EditModal";
import SuspenseLoading from "@/components/loadings/suspense";
import DeleteNoteDialog from "@/components/dashboard/databases/DeleteNoteDailog";
import { toast } from "@/hooks/use-toast";
import { NoteType } from "@/service/notes/type"
import { useGetAllNotesQuery, useDeleteNoteMutation } from "@/service/notes";


export default function Databases() {
  const [notes, setNotes] = useState<NoteType[]>([]);
  const [activeTab, setActiveTab] = useState("shared");
  const [selectedNote, setSelectedNote] = useState<NoteType | null>(null);
  const [modalMode, setModalMode] = useState<"view" | "edit">("view");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data, isLoading, error } = useGetAllNotesQuery();
  const { mutate } = useDeleteNoteMutation();

  if (isLoading) return <SuspenseLoading />;
  if (error) return <p className="text-red-500">Error loading notes.</p>;

  const nots = data?.notes || [];

  const openModal = (note: NoteType, mode: "view" | "edit") => {
    setSelectedNote(note);
    setModalMode(mode);
    setIsModalOpen(true);
  };
  const onDelete = (noteId: string) => {
    mutate(noteId, {
      onSuccess: () => {
        toast({
          title: "Deleted",
          description: "Note has been removed successfully.",
        });
      },
      onError: (error) => {
        toast({
          title: "Error",
          description: error.message || "Could not delete the note",
          variant: "destructive",
        });
      },
    });
  };

  const handleUpdateNote = (updatedNote: NoteType) => {
    setNotes((prevNotes) => prevNotes.map((note) => (note.id === updatedNote.id ? updatedNote : note)));
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-6">
      <div className="w-full max-w-8xl grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white p-6 shadow-lg py-12">
          <h1 className="text-3xl font-bold text-black mb-12 text-center">📝 Add a Note</h1>
          <AddNoteForm />
        </div>
        <div className="bg-white p-6 shadow-lg">
          <h2 className="text-2xl font-bold mb-4">📌 My Notes</h2>

          {/* Tabs */}
          <div className="flex border-b mb-4">
            <button
              className={`p-2 w-1/2 text-center border-b-4 ${activeTab === "shared" ? "bg-gold text-black font-bold border-black" : "bg-black text-gold border-black"
                }`}
              onClick={() => setActiveTab("shared")}
            >
              Shared Notes
            </button>
            <button
              className={`p-2 w-1/2 text-center border-b-4 ${activeTab === "private" ? "bg-gold text-black border-black font-bold" : "bg-black text-gold border-black"
                }`}
              onClick={() => setActiveTab("private")}
            >
              Private Notes
            </button>
          </div>

          {/*Notes Display */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {nots
              .filter((note) => activeTab === "shared" || note.visibility === "private")
              .map((note) => (
                <div
                  key={note.id}
                  className="p-5 bg-white border border-gray-400 shadow-lg transform hover:scale-105 transition-all relative overflow-hidden rounded-xl"
                >
                  <h2 className="text-xl font-semibold text-black mt-4">{note.title}</h2>
                  <p className="text-black mt-2">{note.content}</p>

                  {activeTab === "shared" && (
                    <p className="text-gray-500 text-sm mt-2">Shared By: {note.authorId}</p>
                  )}

                  <div className="absolute top-4 right-2">
                    <DropdownMenu>
                      <DropdownMenuTrigger className="text-gray-600 hover:text-black">
                        <FaEllipsisV />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-36">
                        <DropdownMenuItem onClick={() => openModal(note, "view")}>
                          <GrView className="mr-2" /> View
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => openModal(note, "edit")}>
                          <FaRegEdit className="mr-2" /> Edit
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-red-600" asChild>
                          <DeleteNoteDialog noteId={note.id} onDelete={onDelete} />
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
      <EditNoteModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} note={selectedNote} mode={modalMode} onUpdate={handleUpdateNote} />
    </div>
  );
}