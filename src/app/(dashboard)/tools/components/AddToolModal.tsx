"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Form, FormField, FormItem, FormControl, FormMessage } from "@/components/ui/form";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";

const formSchema = z.object({
    name: z.string().min(2, "Tool name must be at least 2 characters."),
    image: z.custom<FileList>((file) => typeof window !== "undefined" && file instanceof FileList, {
        message: "Image is required.",
    }),
    username: z.string().email("Enter a valid email."),
    password: z.string().min(6, "Password must be at least 6 characters."),
    department: z.string().nonempty("Department is required."),
});

const AddToolModal = ({ isOpen, onClose, onSubmit }: { isOpen: boolean; onClose: () => void; onSubmit: (data: any) => void }) => {
    const [previewImage, setPreviewImage] = useState<string | null>(null);

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: { name: "", image: undefined, username: "", password: "", department: "" },
    });

    const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => setPreviewImage(reader.result as string);
            reader.readAsDataURL(file);
        }
    };

    const onFormSubmit = (values: any) => {
        const file = values.image[0];
        const imageUrl = URL.createObjectURL(file);
        onSubmit({ ...values, image: imageUrl });
        toast.success("Tool added successfully!");
        onClose();
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Add New Tool</DialogTitle>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onFormSubmit)} className="space-y-4">

                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <Label>Tool Name</Label>
                                    <FormControl>
                                        <Input placeholder="Enter tool name" {...field}
                                            className="w-full py-1 bg-white text-black rounded-md focus:border-gold  focus-visible:ring-transparent focus-visible:ring-offset-0" />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="username"
                            render={({ field }) => (
                                <FormItem>
                                    <Label>Username</Label>
                                    <FormControl>
                                        <Input type="email" placeholder="Enter email" {...field}
                                            className="w-full py-1 bg-white text-black rounded-md focus:border-gold  focus-visible:ring-transparent focus-visible:ring-offset-0" />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="password"
                            render={({ field }) => (
                                <FormItem>
                                    <Label>Password</Label>
                                    <FormControl>
                                        <Input type="password" placeholder="Enter password" {...field}
                                            className="w-full py-1 bg-white text-black rounded-md focus:border-gold  focus-visible:ring-transparent focus-visible:ring-offset-0" />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="department"
                            render={({ field }) => (
                                <FormItem>
                                    <Label>Department</Label>
                                    <Select onValueChange={field.onChange}>
                                        <FormControl>
                                            <SelectTrigger className="w-full py-1 bg-white text-black rounded-md focus:border-gold  focus-visible:ring-transparent focus-visible:ring-offset-0">
                                                <SelectValue placeholder="Select department" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value="Web Developer">Web Developer</SelectItem>
                                            <SelectItem value="Graphic Designer">Graphic Designer</SelectItem>
                                            <SelectItem value="SEO Content Writer">SEO Content Writer</SelectItem>
                                            <SelectItem value="SEO Specialist">SEO Specialist</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="image"
                            render={({ field }) => (
                                <FormItem>
                                    <Label>Tool Image</Label>
                                    <FormControl>
                                        <Input type="file" accept="image/*" onChange={(e) => {
                                            field.onChange(e.target.files);
                                            handleImageUpload(e);
                                        }}
                                            className="w-full py-1 bg-white text-black rounded-md focus:border-gold  focus-visible:ring-transparent focus-visible:ring-offset-0" />
                                    </FormControl>
                                    {previewImage && <img src={previewImage} alt="Preview" className="mt-2 w-24 h-24 rounded-md" />}
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <DialogFooter className="mt-4">
                            <Button type="button" className="bg-gray-200 text-black hover:bg-gray-300 font-bold" onClick={onClose}>
                                Cancel
                            </Button>
                            <Button type="submit" className="bg-black text-gold hover:text-black hover:bg-gold font-bold">Submit</Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
};

export default AddToolModal;
