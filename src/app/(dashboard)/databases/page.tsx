"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
interface SharedNote {
  id: string;
  title: string;
  content: string;
  accessRole: string;
}

export default function SharedNotesPage() {
  const [notes, setNotes] = useState<SharedNote[]>([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [accessRole, setAccessRole] = useState("");
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [deleteNoteId, setDeleteNoteId] = useState<string | null>(null);

  useEffect(() => {
    fetchNotes();
  }, []);

  const fetchNotes = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/database/shared-database");
      if (!response.ok) throw new Error("Failed to fetch notes");
      const data = await response.json();
      setNotes(data);
    } catch {
      toast({
        title: "Error",
        description: "Failed to fetch notes",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !accessRole) {
      toast({ title: "Validation Error", description: "Title and Access Role are required", variant: "destructive" });
      return;
    }
    try {
      setLoading(true);
      const response = await fetch("/api/database/shared-database", {
        method: editingNoteId ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, content, accessRole, createdById: "679a46d0cfbb1ee3b2ac916a" }),
      });
      if (!response.ok) throw new Error("Failed to save note");
      await fetchNotes();
      resetForm();
      toast({
        title: "Success",
        description: editingNoteId ? "Note updated successfully" : "Note created successfully",
      });
    } catch {
      toast({
        title: "Error",
        description: "Failed to save note",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (note: SharedNote) => {
    setTitle(note.title);
    setContent(note.content);
    setAccessRole(note.accessRole);
    setEditingNoteId(note.id);
  };

  const resetForm = () => {
    setTitle("");
    setContent("");
    setAccessRole("");
    setEditingNoteId(null);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Shared Notes</h1>

      <Card>
        <CardHeader>
          <CardTitle>{editingNoteId ? "Edit Shared Note" : "Create a New Shared Note"}</CardTitle>
          <CardDescription>Add or edit a note in the shared database.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="grid w-full items-center gap-4">
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="title">Title</Label>
                <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Note title" />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="content">Content</Label>
                <Textarea
                  id="content"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Note content"
                />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="accessRole">Access Role</Label>
                <Select value={accessRole} onValueChange={setAccessRole}>
                  <SelectTrigger id="accessRole">
                    <SelectValue placeholder="Select access role" />
                  </SelectTrigger>
                  <SelectContent position="popper">
                    <SelectItem value="READ">Read Access</SelectItem>
                    <SelectItem value="WRITE">Write Access</SelectItem>
                    <SelectItem value="ADMIN">Admin Access</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <CardFooter className="flex justify-between mt-4">
              <Button type="button" variant="outline" onClick={resetForm}>
                Cancel
              </Button>
              <Button type="submit">{editingNoteId ? "Update" : "Save"}</Button>
            </CardFooter>
          </form>
        </CardContent>
      </Card>

      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Shared Notes List</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center items-center h-20">Loading..</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Access Role</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {notes.map((note) => (
                  <TableRow key={note.id}>
                    <TableCell>{note.title}</TableCell>
                    <TableCell>{note.accessRole}</TableCell>
                    <TableCell>
                      <Button variant="outline" className="mr-2" onClick={() => handleEdit(note)}>
                        Edit
                      </Button>
                      <Button variant="destructive" onClick={() => setDeleteNoteId(note.id)}>
                        Delete
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
