"use client"
import React, { useState } from "react";

const EditProfileForm: React.FC = () => {
    const [image, setImage] = useState<string | null>(null);

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = () => setImage(reader.result as string);
            reader.readAsDataURL(file);
        }
    };
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex flex-col items-center justify-start">
                <div className="w-32 h-32 bg-gray-200 rounded-full flex items-center justify-center mb-4 overflow-hidden">
                    {image ? (
                        <img
                            src={image}
                            alt="Uploaded"
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <span className="text-gray-500 text-sm">Upload Image</span>
                    )}
                </div>
                <label className="text-sm text-blue-500 hover:underline cursor-pointer">
                    Change Image
                    <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleImageUpload}
                    />
                </label>
            </div>
            <div className="col-span-1 md:col-span-2">
                <form className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="col-span-1 md:col-span-2">
                            <label className="block text-sm font-medium mb-1">Email</label>
                            <input
                                type="email"
                                className="w-full border rounded-md px-3 py-2"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">First Name</label>
                            <input
                                type="text"
                                className="w-full border rounded-md px-3 py-2"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Last Name</label>
                            <input
                                type="text"
                                className="w-full border rounded-md px-3 py-2"
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Company</label>
                        <input
                            type="text"
                            className="w-full border rounded-md px-3 py-2"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Job Title</label>
                        <input
                            type="text"
                            className="w-full border rounded-md px-3 py-2"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Timezone</label>
                        <select className="w-full border rounded-md px-3 py-2">
                            <option>Select your timezone</option>
                        </select>
                    </div>
                    <button className="bg-black text-white px-4 py-2 rounded-md w-full md:w-auto">
                        Save Changes
                    </button>
                </form>
            </div>
        </div>
    );
};

export default EditProfileForm;
