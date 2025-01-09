import React from 'react';
import Navbar from '@/components/Navbar';
import Image from "next/image";
import canva from '@/components/ui/images/canva.png';
import envato from '@/components/ui/images/Envato-Logo.webp';
import chatgpt from '@/components/ui/images/chatgpt.png';
import elevenLabs from '@/components/ui/images/voiceAi.png';
import adobe from '@/components/ui/images/adobe-suite.png';

const toolsData = [
    { name: "Canva", image: canva },
    { name: "Envato", image: envato },
    { name: "ChatGPT", image: chatgpt },
    { name: "ElevenLabs", image: elevenLabs, subtitle: "Generative Voice AI" },
    { name: "Adobe Suite", image: adobe },
];

const page = () => {
    return (
        <>
            <Navbar />
            <div className='px-6 py-6 mx-16'>
                <h1 className="text-xl font-bold text-left">TOOLS</h1>
                <h2 className="text-2xl mt-4 text-center font-semibold">Paid Tools By DolceFrutti</h2>
            </div>
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
                                className="object-contain"
                            />
                            <h3 className="font-semibold text-lg mt-4">{tool.name}</h3>
                            {tool.subtitle && (
                                <p className="text-sm text-gray-600">{tool.subtitle}</p>
                            )}
                            <div className="mt-4">
                                <p className="text-sm text-gray-500">User Name</p>
                                <p className="text-sm text-gray-500">Password</p>
                            </div>
                        </div>
                    ))}
                </section>
            </main>
        </>
    )
}

export default page
