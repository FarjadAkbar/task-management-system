import React from "react";

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    formData: {
        title: string;
        department: string;
        image: string;
        creds: { platform: string; password: string };
    };
    handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
    handleCredsChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    handleImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    handleSubmit: (e: React.FormEvent) => void;
}

const AddToolModal: React.FC<ModalProps> = ({
    isOpen,
    onClose,
    formData,
    handleInputChange,
    handleCredsChange,
    handleImageChange,
    handleSubmit,
}) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center">
            <div className="bg-white text-black border border-gray-600 p-8 rounded-xl shadow-lg w-[600px]">
                {/* Header */}
                <div className="flex justify-between items-center border-b border-gray-500 pb-3">
                    <h2 className="text-2xl font-bold">Add New Tool</h2>
                    <button onClick={onClose} className="text-black hover:text-gold text-xl">&times;</button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4 mt-4">
                    <div className="col-span-2">
                        <label className="block text-sm font-semibold text-black">Title:</label>
                        <input
                            type="text"
                            name="title"
                            value={formData.title}
                            onChange={handleInputChange}
                            required
                            className="w-full px-3 py-2 bg-gray-100 text-black border border-gray-600 rounded-md focus:outline-none focus:border-gold"
                        />
                    </div>
                    <div className="col-span-1">
                        <label className="block text-sm font-semibold text-black">Department:</label>
                        <select
                            name="department"
                            value={formData.department}
                            onChange={handleInputChange}
                            required
                            className="w-full px-3 py-2 bg-gray-100 text-black border border-gray-600 rounded-md focus:outline-none focus:border-gold"
                        >
                            <option value="Web Developer">Web Developer</option>
                            <option value="Graphic Designer">Graphic Designer</option>
                            <option value="SEO Content Writer">SEO Content Writer</option>
                            <option value="SEO Specialist">SEO Specialist</option>
                        </select>
                    </div>
                    <div className="col-span-1">
                        <label className="block text-sm font-semibold text-black">Upload Image:</label>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                            className="w-full bg-white h-10 p-1 text-black border border-gray-600 rounded-md cursor-pointer"
                        />
                    </div>
                    <div className="col-span-1">
                        <label className="block text-sm font-semibold text-black">Platform:</label>
                        <input
                            type="text"
                            name="platform"
                            value={formData.creds.platform}
                            onChange={handleCredsChange}
                            required
                            className="w-full px-3 py-2 bg-gray-100 text-black border border-gray-600 rounded-md focus:outline-none focus:border-gold"
                        />
                    </div>
                    <div className="col-span-1">
                        <label className="block text-sm font-semibold text-black">Password:</label>
                        <input
                            type="text"
                            name="creds"
                            value={formData.creds.password}
                            onChange={handleCredsChange}
                            required
                            className="w-full px-3 py-2 bg-gray-100 text-black border border-gray-600 rounded-md focus:outline-none focus:border-gold"
                        />
                    </div>
                    <div className="col-span-2 flex justify-end gap-3 mt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 transition"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="bg-gold text-black px-4 py-2 rounded-md hover:bg-black hover:text-gold transition font-semibold"
                        >
                            Submit
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddToolModal;
