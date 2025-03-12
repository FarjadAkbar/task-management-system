"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage
} from "@/components/ui/form";
import {
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem
} from "@/components/ui/select";
// import { useCreateNoteMutation } from "@/service/notes";

const noteSchema = z.object({
    title: z.string().min(3, "Title must be at least 3 characters"),
    content: z.string().min(5, "Content must be at least 5 characters"),
    visibility: z.enum(["shared", "private"]),
});

interface NoteFormProps {
    onNoteAdded: () => void;
}

export default function AddNoteForm({ onNoteAdded }: NoteFormProps) {
    const form = useForm({
        resolver: zodResolver(noteSchema),
        defaultValues: { title: "", content: "", visibility: "" },
    });

    // const { mutate, isPending } = useCreateNoteMutation();

    // const onSubmit = (data: any) => {
    //     mutate(
    //         { ...data, userId: "user123" },
    //         {
    //             onSuccess: () => {
    //                 toast.success("Note added successfully!");
    //                 form.reset();
    //             },
    //             onError: (error) => {
    //                 toast.error("Failed to add note.");
    //                 console.error(error);
    //             },
    //         }
    //     );
    // };

    const onSubmit = async (data: any) => {
        const res = await fetch("/api/notes", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ ...data, userId: "user123" }),
        });

        if (res.ok) {
            form.reset();
            onNoteAdded();
        }
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Title</FormLabel>
                            <FormControl>
                                <Input placeholder="Enter title..." {...field}
                                    className="w-full py-1 bg-white text-black rounded-md focus:border-gold  focus-visible:ring-transparent focus-visible:ring-offset-0" />
                            </FormControl>
                            <FormMessage className="text-red-600" />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="content"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Content</FormLabel>
                            <FormControl>
                                <Textarea placeholder="Write your note here..." {...field}
                                    className="w-full py-1 bg-white text-black rounded-md focus:border-gold  focus-visible:ring-transparent focus-visible:ring-offset-0" />
                            </FormControl>
                            <FormMessage className="text-red-600" />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="visibility"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Visibility</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                    <SelectTrigger className="w-full py-1 bg-white text-black rounded-md focus:border-gold  focus-visible:ring-transparent focus-visible:ring-offset-0">
                                        <SelectValue placeholder="Select visibility" />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    <SelectItem value="shared">Shared</SelectItem>
                                    <SelectItem value="private">Private</SelectItem>
                                </SelectContent>
                            </Select>
                            <FormMessage className="text-red-600" />
                        </FormItem>
                    )}
                />

                <Button type="submit" className="w-full text-gold hover:bg-gold hover:text-black">
                    Add Note
                </Button>
            </form>
        </Form>
    );
}
