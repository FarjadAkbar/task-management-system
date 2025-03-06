import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";

interface Tool {
    name: string;
    image: string;
    username: string;
    password: string;
    subtitle?: string;
    department: string;
}

interface ToolModalProps {
    isOpen: boolean;
    onClose: () => void;
    tool: Tool | null;
    onSave: (updatedTool: Tool) => void;
    mode: "view" | "edit";
}

const EditToolModal: React.FC<ToolModalProps> = ({ isOpen, onClose, tool, onSave, mode }) => {
    const [previewImage, setPreviewImage] = useState<string | null>(null);

    const form = useForm<Tool>({
        defaultValues: tool || {
            name: "",
            image: "",
            username: "",
            password: "",
            subtitle: "",
            department: "",
        }
    });

    useEffect(() => {
        if (tool) {
            form.reset({ ...tool });
            setPreviewImage(tool.image);
        }
    }, [tool, form]);

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => setPreviewImage(reader.result as string);
            reader.readAsDataURL(file);
            form.setValue("image", URL.createObjectURL(file));
        }
    };

    const handleSave = () => {
        onSave(form.getValues());
        onClose();
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-md">
                <DialogHeader>
                    <DialogTitle className="text-2xl">{mode === "view" ? "Tool Details" : "Edit Tool"}</DialogTitle>
                </DialogHeader>

                {mode === "view" && tool && (
                    <div className="space-y-4">
                        <img src={tool.image} alt={tool.name} className="w-20 h-20 mx-auto rounded-lg" />
                        <p><strong>Name:</strong> {tool.name}</p>
                        {tool.subtitle && <p><strong>Subtitle:</strong> {tool.subtitle}</p>}
                        <p><strong>Email:</strong> {tool.username}</p>
                        <p><strong>Password:</strong> {tool.password}</p>
                        <p><strong>Department:</strong> {tool.department}</p>
                    </div>
                )}

                {mode === "edit" && (
                    <Form {...form}>
                        <form className="space-y-2">
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Tool Name</FormLabel>
                                        <FormControl>
                                            <Input {...field} placeholder="Tool Name"
                                                className="focus:border-gold  focus-visible:ring-transparent focus-visible:ring-offset-0" />
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
                                        <FormLabel>Username</FormLabel>
                                        <FormControl>
                                            <Input {...field} placeholder="Email"
                                                className="focus:border-gold  focus-visible:ring-transparent focus-visible:ring-offset-0" />
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
                                        <FormLabel>Password</FormLabel>
                                        <FormControl>
                                            <Input type="password" {...field} placeholder="Password"
                                                className="focus:border-gold  focus-visible:ring-transparent focus-visible:ring-offset-0" />
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
                                        <FormLabel>Department</FormLabel>
                                        <Select
                                            onValueChange={field.onChange}
                                            value={field.value}
                                        >
                                            <SelectTrigger className="focus:border-gold  focus-visible:ring-transparent focus-visible:ring-offset-0">
                                                <SelectValue placeholder="Select department" />
                                            </SelectTrigger>
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
                                        <FormLabel>Tool Image</FormLabel>
                                        <FormControl>
                                            <Input type="file" accept="image/*" onChange={handleImageUpload}
                                                className="focus:border-gold  focus-visible:ring-transparent focus-visible:ring-offset-0" />
                                        </FormControl>
                                        {previewImage && <img src={previewImage} alt="Preview" className="mt-2 w-24 h-24 rounded-md" />}
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </form>
                    </Form>
                )}

                <DialogFooter>
                    <Button type="button" className="bg-gray-200 text-black hover:bg-gray-300 font-bold" onClick={onClose}>
                        {mode === "edit" ? "Cancel" : "Close"}
                    </Button>
                    {mode === "edit" && (
                        <Button onClick={handleSave} className="bg-black text-gold hover:text-black hover:bg-gold font-bold">
                            Save Changes
                        </Button>
                    )}
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default EditToolModal;
