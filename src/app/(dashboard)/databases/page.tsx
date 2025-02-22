"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface Note {
  id: string;
  title: string;
  content: string;
  visibility: "shared" | "private";
  creatorName?: string;
}

export default function Databases() {
  const [notes, setNotes] = useState<Note[]>([]);;
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [visibility, setVisibility] = useState("shared");
  const [activeTab, setActiveTab] = useState("shared"); // Default tab

  const router = useRouter();

  useEffect(() => {
    fetchNotes();
  }, []);

  const fetchNotes = async () => {
    const res = await fetch("/api/notes?userId=user123"); // Replace with actual user ID
    const data: Note[] = await res.json();
    const updatedNotes = data.map((note: any) => ({
      ...note,
      visibility: note.visibility || "private",
    }));

    setNotes(updatedNotes);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch("/api/notes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, content, userId: "user123", visibility }), // Replace with actual user ID
    });
    if (res.ok) {
      setTitle("");
      setContent("");
      setVisibility("shared");
      fetchNotes();
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-6">
      <div className="w-full max-w-8xl grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Left Section - Form */}
        <div className="bg-white p-6 shadow-lg py-12">
          <h1 className="text-3xl font-bold text-black mb-12 text-center">📝 Add a Note</h1>

          <form onSubmit={handleSubmit}>
            <div className="relative mb-4">
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter title..."
                className="w-full p-4 text-gray-800 border border-gray-700 rounded-lg shadow-inner focus:outline-none focus:ring-2 focus:ring-gold"
              />
            </div>

            <div className="relative mb-2">
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Write your note here..."
                className="w-full p-4 text-gray-800 border border-gray-700 rounded-lg shadow-inner focus:outline-none focus:ring-2 focus:ring-gold resize-none h-24"
              />
            </div>

            <div className="relative mb-4">
              <select
                value={visibility}
                onChange={(e) => setVisibility(e.target.value)}
                className="w-full p-4 text-gray-800 border border-gray-700 rounded-lg shadow-inner focus:outline-none focus:ring-2 focus:ring-gold"
              >
                <option value="">Select users to share with</option>
                <option value="shared">Shared</option>
                <option value="private">Private</option>
              </select>
            </div>

            <button
              type="submit"
              className="w-full px-6 py-3 bg-black text-gold hover:text-black font-bold rounded-lg hover:bg-gold transition-all transform hover:scale-105 active:scale-95"
            >
              Add Note
            </button>
          </form>
        </div>

        {/* Right Section - Notes Display with Tabs */}
        <div className="bg-white p-6 shadow-lg">
          <h2 className="text-2xl font-bold mb-4">📌 My Notes</h2>

          {/* Tabs */}
          <div className="flex border-b mb-4">
            <button
              className={`p-3 w-1/2 text-center ${activeTab === "shared" ? "bg-gold text-black font-bold" : "bg-gray-200"
                }`}
              onClick={() => setActiveTab("shared")}
            >
              Shared Notes
            </button>
            <button
              className={`p-3 w-1/2 text-center ${activeTab === "private" ? "bg-gold text-black font-bold" : "bg-gray-200"
                }`}
              onClick={() => setActiveTab("private")}
            >
              Private Notes
            </button>
          </div>

          {/* Filtered Notes Display */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {notes.map((note) => (
              <div
                key={note.id}
                className="p-5 bg-white border border-gray-400 shadow-lg transform hover:scale-105 transition-all relative overflow-hidden rounded-xl"
              >
                <h2 className="text-xl font-semibold text-black mt-4">{note.title}</h2>
                <p className="text-black mt-2">{note.content}</p>

                {activeTab === "shared" && (
                  <p className="text-gray-500 text-sm mt-2">Shared By: {note.creatorName}</p>
                )}

                <div className="absolute top-0 right-0 bg-gold text-black px-1 py-1 text-sm font-bold rounded-bl-xl">
                  {activeTab === "shared" ? "Shared Note" : "Private Note"}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
