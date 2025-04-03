"use client"
import EmployeeGuidelines from '@/components/dashboard/team/EmployeeGuidelines';
import { useRouter } from 'next/navigation'
import React from 'react';

const Page = () => {
    const router = useRouter();

    const cards = [
        { title: "Tools", description: "All Tools credentials", path: "/tools" },
        { title: "Tasks", description: "See All Tasks", path: "/projects/67dfb82f97615f9768c9824f/board" },
        { title: "Meetings", description: "See All Meetings", path: "/event" },
    ];

    return (
        <div className=" min-h-screen flex items-center justify-center p-1">
            <div className="max-w-7xl w-full bg-white shadow-xl rounded-lg py-4 sm:p-10 p-2">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-center text-gray-900">Shipping and Labels Handling</h1>
                <p className="sm:text-lg text-sm text-gray-600 text-center mt-2">Employee Guidelines & Responsibilities</p>
                <div className="mt-6 border-t border-gray-300 pt-6">
                    <EmployeeGuidelines />
                </div>

                <section className="mt-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                    {cards.map(({ title, description, path }) => (
                        <div
                            key={title}
                            className="border border-gray-300 shadow-md rounded-lg p-2 flex flex-col items-center text-center transition-all duration-300 hover:shadow-lg hover:scale-105 cursor-pointer bg-black hover:bg-gold text-gold hover:text-black"
                            onClick={() => router.push(path)}
                        >
                            <h3 className="text-xl">{title}</h3>
                            <p className="text-sm mt-1">{description}</p>
                        </div>
                    ))}
                </section>
            </div>
        </div>
    );
};

export default Page;