import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { getUser } from '@/actions/get-user';

const cards = [
    { title: "Database", src: "/images/database.png", href: "" },
    { title: "Task Manager", src: "/images/task.png", href: "" },
    { title: "Our Team", src: "/images/team.png", href: "/team" },
    { title: "Ticket", src: "/images/ticket.png", href: "" },
    { title: "Events and Meeting", src: "/images/meetings.png", href: "" },
    { title: "Messages", src: "/images/messages.png", href: "" },
    { title: "Personal Folder", src: "/images/personalfolder.png", href: "" },
    { title: "Share Folder", src: "/images/sharedfolder.png", href: "" },
];


export default async function Dashboard() {
    const data = await getUser();
    if (!data) {
        return <div>No user data.</div>;
      }
    return (
        <div className="px-6 py-8 mt-0 m-16">
            <h1 className="text-xl font-semibold text-center md:text-left">MY DASHBOARD</h1>
            <p className="text-center text-lg mt-4">
                
                <span className="font-bold">{data.name} - {data.job_title}</span>
            </p>
            <div className="flex flex-wrap justify-center mt-8">
                {cards.map((card, index) => (
                    <Link href={card.href} key={index} className="w-full sm:w-1/2 lg:w-1/3">
                        <div className="flex flex-col items-center p-4 bg-white shadow-[0_4px_12px_rgba(0,0,0,0.25)] rounded-lg hover:scale-105 transform transition-transform duration-300 ease-in-out m-6">
                            <div className="w-36 mb-4">
                                <Image
                                    src={card.src}
                                    alt={card.title}
                                    height={200}
                                    width={144}
                                    className="rounded-md h-32 object-cover"
                                />
                            </div>
                            <h3 className="text-md font-semibold">{card.title}</h3>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
};
