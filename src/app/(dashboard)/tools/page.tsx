"use client";
import React, { useState } from "react";
import Image from "next/image";
import AddToolModal from "./components/AddToolModal";
import { toast } from "react-toastify";
import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { FaEllipsisV } from "react-icons/fa";
import { GrView } from "react-icons/gr";
import { FaRegEdit } from "react-icons/fa";
import EditToolModal from "./components/EditToolModal";
import DeleteToolDialog from "./components/DeleteToolModal";


interface Tool {
    name: string;
    image: string;
    username: string;
    password: string;
    subtitle?: string;
    department: string;
}

const initialtools: Tool[] = [
    { name: "Canva", image: "/images/canva.png", username: "user1@gmail.com", password: "pass123", department: "" },
    { name: "Envato", image: "/images/Envato-Logo.webp", username: "user2@gmail.com", password: "envato456", department: "" },
    { name: "ChatGPT", image: "/images/chatgpt.png", username: "user3@gmail.com", password: "chatgpt789", department: "" },
    { name: "ElevenLabs", image: "/images/voiceAi.png", subtitle: "Generative Voice AI", username: "user4@gmail.com", password: "voiceAI111", department: "" },
    { name: "Adobe Suite", image: "/images/adobe-suite.png", username: "user5@gmail.com", password: "adobeSuite999", department: "" },
];

const Page = () => {
    const [tools, setTools] = useState(initialtools);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [selectedTool, setSelectedTool] = useState<any>(null);
    const [modalMode, setModalMode] = useState<"view" | "edit">("view");

    const handleFormSubmit = (newTool: any) => {
        setTools((prevTools) => [...prevTools, newTool]);
        setTimeout(() => {
            toast.success("Tool added successfully!");
            setIsAddModalOpen(false);
        }, 1000);
    };

    const handleCopy = (text: string) => {
        navigator.clipboard.writeText(text);
        toast.success("Copied to clipboard!");
    };

    const openModal = (tool: Tool, mode: "view" | "edit") => {
        setSelectedTool(tool);
        setModalMode(mode);
        setIsEditModalOpen(true);
    };
    const closeModal = () => {
        setIsEditModalOpen(false);
        setSelectedTool(null);
    };

    const handleSave = (updatedTool: Tool) => {
        setTools((prevTools) =>
            prevTools.map((t) => (t.name === selectedTool?.name ? updatedTool : t))
        );
        setIsEditModalOpen(false);
        toast.success("Tool updated successfully!");
    };

    const handleDelete = (toolName: string) => {
        setTools((prevTools) => prevTools.filter((tool) => tool.name !== toolName));
        toast.success(`${toolName} deleted successfully!`);
    };
    return (
        <div className="min-h-screen bg-gray-50 text-gray-900">
            {/* Header */}
            <div className="flex justify-between items-center px-8 py-6 bg-white shadow-md">
                <h1 className="text-2xl font-extrabold tracking-wide text-gray-800">TOOLS</h1>
                <button
                    className="bg-black text-gold hover:bg-gold hover:text-black px-5 py-2 rounded-lg shadow-lg hover:scale-105 transition duration-300 font-semibold"
                    onClick={() => setIsAddModalOpen(true)}
                >
                    + Add Tools
                </button>
            </div>

            {/* Main Content */}
            <main className="px-4 sm:px-8 md:px-16 mt-8">
                <h2 className="text-3xl text-center font-bold text-gray-800 mb-8">Paid Tools By DolceFrutti</h2>
                <section className="max-w-3xl mx-auto bg-white p-8 shadow-lg rounded-xl mb-12">
                    <h2 className="text-xl font-bold text-gray-700 mb-4">For Better Implementation and Efficiency</h2>
                    <p className="font-medium text-gray-600 mb-6">
                        To support your work and ensure smooth operations, Dolce Frutti provides access to essential tools. Please read the following guidelines to maintain security and compliance.
                    </p>
                    <div className="space-y-4 text-gray-700">
                        <p><strong>Note 1:</strong> All tools and accounts provided by Dolce Frutti are strictly for company use. Do not share access credentials, files, or information with unauthorized persons.</p>
                        <p><strong>Note 2:</strong> These tools are licensed and paid by the company. Misuse or sharing may result in penalties or loss of access.</p>
                        <p><strong>Note 3:</strong> Ensure that you log out after using shared accounts and keep passwords secure.</p>
                        <p><strong>Note 4:</strong> You are directly responsible for any activity under your access. If you encounter an issue, report it to your manager immediately.</p>
                    </div>
                </section>
                <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
                    {tools.map((tool, index) => (
                        <div
                            key={index}
                            className="relative bg-white shadow-lg hover:shadow-xl transition-shadow duration-300 rounded-xl p-6 flex flex-col items-center text-center"
                        >
                            <div className="absolute top-4 right-2">
                                <DropdownMenu>
                                    <DropdownMenuTrigger className="text-gray-600 hover:text-black">
                                        <FaEllipsisV className="text-xl" />
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end" className="w-36">
                                        <DropdownMenuItem onClick={() => openModal(tool, "view")}>
                                            <GrView className="mr-2" /> View
                                        </DropdownMenuItem>
                                        <DropdownMenuItem onClick={() => openModal(tool, "edit")} >
                                            <FaRegEdit className="mr-2" /> Edit
                                        </DropdownMenuItem>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem asChild>
                                            <DeleteToolDialog toolName={tool.name} onDelete={handleDelete} />
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>
                            <div className="w-24 h-24 rounded-lg overflow-hidden">
                                <Image
                                    src={typeof tool.image === "string" && tool.image?.trim() !== ""
                                        ? tool.image
                                        : "/images/default.png"}
                                    alt={tool.name || "Tool Image"}
                                    width={96}
                                    height={96}
                                    className="object-cover"
                                />
                            </div>
                            <h3 className="font-bold text-lg mt-4">{tool.name}</h3>
                            {tool.subtitle && <p className="text-sm text-gray-600 mt-2">{tool.subtitle}</p>}
                            <div className="mt-4 w-full space-y-2">
                                <p
                                    className="text-sm text-gray-500 cursor-pointer hover:text-gray-900 transition"
                                    onClick={() => handleCopy(tool.name)}
                                >
                                    <span className="font-semibold">User Email:</span> {tool.username}
                                </p>
                                <p
                                    className="text-sm text-gray-500 cursor-pointer hover:text-gray-900 transition"
                                    onClick={() => handleCopy(tool.password)}
                                >
                                    <span className="font-semibold">Password:</span> {tool.password}
                                </p>
                            </div>
                        </div>
                    ))}
                </section>
            </main>

            {/* Modal Component */}
            <AddToolModal
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                onSubmit={handleFormSubmit}
            />
            <EditToolModal
                isOpen={isEditModalOpen}
                onClose={closeModal}
                tool={selectedTool}
                onSave={handleSave}
                mode={modalMode}
            />
        </div>
    );
};

export default Page;
