import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { MultiSelect } from "@/components/ui/multi-select";
import { Input } from "@/components/ui/input";
import { toast } from "react-toastify";

const options = [
    { label: "Web Developers", value: "Web Developers" },
    { label: "Web Designers", value: "Web Designers" },
    { label: "SEO Content Writers", value: "SEO Content Writers" },
    { label: "SEO Specialist", value: "SEO Specialist" }
];

const FormSchema = z.object({
    title: z.string().min(3, "Title is required"),
    date: z.string().nonempty("Date is required"),
    time: z.string().nonempty("Time is required"),
    recipients: z.array(z.string()).min(1, "At least one recipient is required"),
});

type MeetingFormProps = {
    isOpen: boolean;
    onClose: () => void;
    onSave: (meeting: { title: string; date: string; time: string; recipients: string[] }) => void;
};

const MeetingDialog: React.FC<MeetingFormProps> = ({ isOpen, onClose, onSave }) => {
    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            title: "",
            date: "",
            time: "",
            recipients: [],
        },
    });
    const { handleSubmit, control, formState: { errors } } = form;
    const onSubmit = (data: z.infer<typeof FormSchema>) => {
        if (!data.title || !data.date || !data.time || data.recipients.length === 0) {
            toast.error("Please fill out all fields!");
            return;
        }

        onSave(data);
        form.reset();
        onClose();
    };


    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="bg-white">
                <DialogHeader>
                    <DialogTitle>Schedule a New Meeting</DialogTitle>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <div className="mb-4">
                            <FormField control={control} name="title"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Title</FormLabel>
                                        <FormControl>
                                            <Input {...field} placeholder="Enter meeting title" className="w-full border border-gray-300 rounded-lg p-2" />
                                        </FormControl>
                                        <FormMessage>{errors.title?.message}</FormMessage>
                                    </FormItem>
                                )}>
                            </FormField>
                        </div>
                        <div className="mb-4">
                            <FormField control={control} name="date"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Date</FormLabel>
                                        <FormControl>
                                            <Input {...field} type="date" className="w-full border border-gray-300 rounded-lg p-2" />
                                        </FormControl>
                                        <FormMessage>{errors.date?.message}</FormMessage>
                                    </FormItem>
                                )}>
                            </FormField>
                        </div>
                        <div className="mb-4">
                            <FormField control={control} name="time"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Time</FormLabel>
                                        <FormControl>
                                            <Input {...field} type="time" className="w-full border border-gray-300 rounded-lg p-2" />
                                        </FormControl>
                                        <FormMessage>{errors.time?.message}</FormMessage>
                                    </FormItem>
                                )}>
                            </FormField>
                        </div>
                        <div className="mb-4">
                            <FormField
                                control={control}
                                name="recipients"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Recipients</FormLabel>
                                        <FormControl>
                                            <select
                                                multiple
                                                value={field.value || []}
                                                onChange={(e) =>
                                                    field.onChange(
                                                        Array.from(e.target.selectedOptions, (option) => option.value)
                                                    )
                                                }
                                                className="w-full border border-gray-300 rounded-lg p-2 bg-white text-black"
                                            >
                                                {options.map((option) => (
                                                    <option key={option.value} value={option.value}>
                                                        {option.label}
                                                    </option>
                                                ))}
                                            </select>
                                        </FormControl>
                                        <FormMessage>{errors.recipients?.message}</FormMessage>
                                    </FormItem>
                                )}
                            />
                        </div>
                        <div className="flex justify-between mt-6">
                            <Button type="submit" className="bg-black text-white py-2 px-6 rounded-lg shadow-lg hover:bg-gold hover:text-black transition-all">
                                Add Meeting
                            </Button>
                            <Button type="button" onClick={onClose} className="bg-gray-600 text-white py-2 px-6 rounded-lg shadow-lg hover:bg-gray-700 transition-all">
                                Cancel
                            </Button>
                        </div>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
};

export default MeetingDialog;
