"use client"
import React, { useState } from "react";
import Image from "next/image";
import AddToolModal from "./components/AddToolModal";
import { toast } from "react-toastify";

const toolsData = [
    { name: "Canva", image: "/images/canva.png", username: "user_canva", password: "pass123" },
    { name: "Envato", image: "/images/Envato-Logo.webp", username: "user_envato", password: "envato456" },
    { name: "ChatGPT", image: "/images/chatgpt.png", username: "user_chatgpt", password: "chatgpt789" },
    { name: "ElevenLabs", image: "/images/voiceAi.png", subtitle: "Generative Voice AI", username: "user_eleven", password: "voiceAI111" },
    { name: "Adobe Suite", image: "/images/adobe-suite.png", username: "user_adobe", password: "adobeSuite999" },
];

const page = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState({
        title: "",
        department: "Web Developer",
        image: "",
        creds: { platform: "", password: "" },
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleCredsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            creds: { ...prev.creds, [name]: value },
        }));
    };

    const handleCopy = (text: string) => {
        navigator.clipboard.writeText(text);
        toast.success("Copied to clipboard!");
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setFormData((prev) => ({
                ...prev,
                image: URL.createObjectURL(file),
            }));
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log("Submitted Data:", formData);
        setIsModalOpen(false);
    };

    return (
        <>
            <div className="flex justify-between items-center px-6 py-6 mx-16">
                <h1 className="text-xl font-bold">TOOLS</h1>
                <button
                    className="bg-black text-gold px-4 py-2 rounded-md hover:bg-gold hover:text-black font-semibold"
                    onClick={() => setIsModalOpen(true)}
                >
                    Add Tools
                </button>
            </div>
            <h2 className="text-2xl mt-4 text-center font-semibold">Paid Tools By DolceFrutti</h2>
            <main className="px-4 sm:px-8 md:px-16">
                <section className="max-w-3xl mx-auto">
                    <h2 className="text-2xl text-left">
                        For Better Implementation and Efficiency
                    </h2>
                    <p className='font-semibold'>
                        To support your work and ensure smooth operations, Dolce Frutti provides access to essential tools. Please read the following important guidelines on their use to maintain security and compliance.
                    </p>
                    <div className="text-left mt-4 text-sm list-disc list-inside">
                        <p>
                            <strong>Note 1</strong>: All tools and accounts provided by Dolce Frutti are strictly for company use. Do not share access credentials, files, or information with unauthorized persons.
                        </p>
                        <p>
                            <strong>Note 2</strong>: These tools are licensed and paid by the company. Misuse or
                            sharing may result in penalties or loss of access.
                        </p>
                        <p>
                            <strong>Note 3</strong>: Ensure that you log out after using shared accounts and keep
                            passwords secure.
                        </p>
                        <p>
                            <strong>Note 4</strong>: You are directly responsible for any activity under your access.
                            If you encounter an issue, report it to your manager immediately.
                        </p>
                    </div>
                </section>
                <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-12 mt-12 px-6">
                    {toolsData.map((tool, index) => (
                        <div
                            key={index}
                            className="border border-gray-300 shadow-md rounded-lg p-4 flex flex-col items-center text-center"
                        >
                            <Image
                                src={tool.image}
                                alt={tool.name}
                                width={80}
                                height={80}
                            />
                            <h3 className="font-semibold text-lg mt-4">{tool.name}</h3>
                            {tool.subtitle && (
                                <p className="text-sm text-gray-600">{tool.subtitle}</p>
                            )}
                            <div className="mt-4">
                                <p
                                    className="text-sm text-gray-500 cursor-pointer hover:text-black"
                                    onClick={() => handleCopy(tool.username)}
                                >
                                    User Name: <span className="font-semibold">{tool.username}</span>
                                </p>
                                <p
                                    className="text-sm text-gray-500 cursor-pointer hover:text-black"
                                    onClick={() => handleCopy(tool.password)}
                                >
                                    Password: <span className="font-semibold">{tool.password}</span>
                                </p>
                            </div>
                        </div>
                    ))}
                </section>
            </main>
            {/* Modal Component */}
            <AddToolModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                formData={formData}
                handleInputChange={handleInputChange}
                handleCredsChange={handleCredsChange}
                handleImageChange={handleImageChange}
                handleSubmit={handleSubmit}
            />
        </>
    )
}

export default page
