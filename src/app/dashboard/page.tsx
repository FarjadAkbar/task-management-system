import React from 'react';
import Navbar from '@/components/Navbar';
import database from '@/components/ui/images/database.png';
import task from '@/components/ui/images/task.png';
import team from '@/components/ui/images/team.png';
import ticket from '@/components/ui/images/ticket.png';
import meetings from '@/components/ui/images/meetings.png';
import messages from '@/components/ui/images/messages.png';
import PFolder from '@/components/ui/images/personalfolder.png';
import SFolder from '@/components/ui/images/sharedfolder.png';
import Image from 'next/image';
import Link from 'next/link';

const cards = [
    { title: "Database", src: database, href: "" },
    { title: "Task Manager", src: task, href: "" },
    { title: "Our Team", src: team, href: "dashboard/our-team" },
    { title: "Ticket", src: ticket, href: "" },
    { title: "Events and Meeting", src: meetings, href: "" },
    { title: "Messages", src: messages, href: "" },
    { title: "Personal Folder", src: PFolder, href: "" },
    { title: "Share Folder", src: SFolder, href: "" },
];

const Dashboard = () => {
    return (
        <div className='min-h-screen'>
            <Navbar />
            <div className="px-6 py-8 mt-0 m-16">
                <h1 className="text-xl font-semibold text-center md:text-left">MY DASHBOARD</h1>
                <p className="text-center text-lg mt-4">
                    Employee Name and job title
                    <br />
                    <span className="font-bold">Ayesha Khan Marketing Manager</span>
                </p>
                <div className="flex flex-wrap justify-center mt-8">
                    {cards.map((card, index) => (
                        <Link href={card.href} key={index} className="w-full sm:w-1/2 lg:w-1/3">
                            <div className="flex flex-col items-center p-4 bg-white shadow-[0_4px_12px_rgba(0,0,0,0.25)] rounded-lg hover:scale-105 transform transition-transform duration-300 ease-in-out m-6">
                                <div className="w-36 mb-4">
                                    <Image
                                        src={card.src}
                                        alt={card.title}
                                        className="rounded-md h-32 object-cover"
                                    />
                                </div>
                                <h3 className="text-md font-semibold">{card.title}</h3>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Dashboard;