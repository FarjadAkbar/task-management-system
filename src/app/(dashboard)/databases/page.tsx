import { AddNoteDialog } from "@/components/dashboard/databases/add-note";
import { Notes } from "@/components/dashboard/databases/notes";

export default function NotesPage() {
  return (
    <div className="container mx-auto py-6 space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Notes</h1>
          <p className="text-muted-foreground">Create and manage your personal and shared notes</p>
        </div>
        <AddNoteDialog />
      </div>
      <Notes />
    </div>
  )
}

