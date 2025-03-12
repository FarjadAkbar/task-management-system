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
import DeleteNoteDialog from "@/components/dashboard/databases/DeleteNoteDailog";
import { toast } from "react-toastify";
import { NoteType } from "@/service/notes/type"
import { useGetAllNotesQuery } from "@/service/notes";


export default function Databases() {
  const [notes, setNotes] = useState<NoteType[]>([]);
  const [activeTab, setActiveTab] = useState("shared");
  const [selectedNote, setSelectedNote] = useState<NoteType | null>(null);
  const [modalMode, setModalMode] = useState<"view" | "edit">("view");
  const [isModalOpen, setIsModalOpen] = useState(false);

  // const { data, isLoading, error } = useGetAllNotesQuery();
  // const deleteNoteMutation = useDeleteNoteMutation();

  // if (isLoading) return <SuspenseLoading />;
  // if (error) return <p className="text-red-500">Error loading notes.</p>;

  // const notes: NoteType[] = data?.notes || [];

  useEffect(() => {
    fetchNotes();
  }, []);

  const fetchNotes = async () => {
    try {
      const res = await fetch("/api/notes");
      const data = await res.json();
      if (data.notes && Array.isArray(data.notes)) {
        const formattedNotes = data.notes.map((note: any) => ({
          id: note.id,
          title: note.title,
          content: note.content,
          visibility: note.is_public ? "shared" : "private",
          creatorName: note.authorId,
        }));
        setNotes(formattedNotes);
      } else {
        console.log("Invalid data format", data);
        setNotes([]);
      }
    } catch (error) {
      console.log("Failed to fetch notes:", error);
      setNotes([]);
    }
  };
  const openModal = (note: NoteType, mode: "view" | "edit") => {
    setSelectedNote(note);
    setModalMode(mode);
    setIsModalOpen(true);
  };

  const handleUpdateNote = (updatedNote: NoteType) => {
    setNotes(notes.map((note) => (note?.id === updatedNote.id ? updatedNote : note)));
  };
  const handleDelete = async (noteId: string) => {
    try {
      const res = await fetch(`/api/notes`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: noteId }),
      });

      if (!res.ok) {
        const errorMessage = await res.text();
        throw new Error(`Failed to delete note: ${errorMessage}`);
      }

      setNotes((prevNotes) => prevNotes.filter((note) => note.id !== noteId));
    } catch (error) {
      console.error("Error deleting note:", error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-6">
      <div className="w-full max-w-8xl grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white p-6 shadow-lg py-12">
          <h1 className="text-3xl font-bold text-black mb-12 text-center">📝 Add a Note</h1>
          <AddNoteForm onNoteAdded={fetchNotes} />
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
            {notes
              .filter((note) => activeTab === "shared" || note.visibility === "private")
              .map((note) => (
                <div
                  key={note.id}
                  className="p-5 bg-white border border-gray-400 shadow-lg transform hover:scale-105 transition-all relative overflow-hidden rounded-xl"
                >
                  <h2 className="text-xl font-semibold text-black mt-4">{note.title}</h2>
                  <p className="text-black mt-2">{note.content}</p>

                  {activeTab === "shared" && (
                    <p className="text-gray-500 text-sm mt-2">Shared By: {note.creatorName}</p>
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
                          <DeleteNoteDialog noteId={note.id} onDelete={handleDelete} />
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
