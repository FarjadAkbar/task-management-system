import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: FormData) => void;
}

const formSchema = z.object({
    title: z.string().min(2, "Title must be at least 2 characters."),
    department: z.string().nonempty("Department is required."),
    image: z.any().refine((file) => file instanceof File, "Image is required."),
    platform: z.string().min(2, "Platform name must be at least 2 characters."),
    password: z.string().min(6, "Password must be at least 6 characters."),
});

type FormData = z.infer<typeof formSchema>;

const AddToolModal: React.FC<ModalProps> = ({ isOpen, onClose, onSubmit }) => {
    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors },
    } = useForm<FormData>({
        resolver: zodResolver(formSchema),
    });

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="bg-gray-50 text-black border p-8  shadow-lg w-[550px]">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-bold border-b border-gray-500 pb-3">Add New Tool</DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
                    <div>
                        <Label htmlFor="title">Title</Label>
                        <Input id="title" {...register("title")}
                            className="w-full py-1 bg-white text-black rounded-md focus:border-gold  focus-visible:ring-transparent focus-visible:ring-offset-0" />
                        {errors.title && <p className="text-red-500 text-sm">{errors.title.message}</p>}
                    </div>

                    <div>
                        <Label htmlFor="department">Department</Label>
                        <Select onValueChange={(val) => setValue("department", val)}>
                            <SelectTrigger className="w-full py-1 bg-white text-black rounded-md border border-gray-300 focus:ring-0 focus:border-gold focus-visible:ring-transparent focus-visible:ring-offset-0">
                                <SelectValue placeholder="Select a department" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Web Developer">Web Developer</SelectItem>
                                <SelectItem value="Graphic Designer">Graphic Designer</SelectItem>
                                <SelectItem value="SEO Content Writer">SEO Content Writer</SelectItem>
                                <SelectItem value="SEO Specialist">SEO Specialist</SelectItem>
                            </SelectContent>
                        </Select>
                        {errors.department && <p className="text-red-500 text-sm">{errors.department.message}</p>}
                    </div>

                    <div>
                        <Label htmlFor="image">Upload Image</Label>
                        <Input
                            id="image"
                            type="file"
                            accept="image/*"
                            onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) {
                                    setValue("image", file);
                                }
                            }}
                            className="w-full py-1 bg-white text-black rounded-md focus:border-gold  focus-visible:ring-transparent focus-visible:ring-offset-0"
                        />
                    </div>

                    <div>
                        <Label htmlFor="platform">Platform</Label>
                        <Input id="platform" {...register("platform")}
                            className="w-full py-1 bg-white text-black rounded-md focus:border-gold  focus-visible:ring-transparent focus-visible:ring-offset-0" />
                        {errors.platform && <p className="text-red-500 text-sm">{errors.platform.message}</p>}
                    </div>

                    <div>
                        <Label htmlFor="password">Password</Label>
                        <Input id="password" type="password" {...register("password")}
                            className="w-full py-1 bg-white text-black rounded-md focus:border-gold  focus-visible:ring-transparent focus-visible:ring-offset-0" />
                        {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}
                    </div>

                    <DialogFooter className="mt-4">
                        <Button type="button" className="bg-gray-200 text-black hover:bg-gray-300 font-bold" onClick={onClose}>
                            Cancel
                        </Button>
                        <Button type="submit" className="bg-black text-gold hover:text-black hover:bg-gold font-bold">Submit</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default AddToolModal;
