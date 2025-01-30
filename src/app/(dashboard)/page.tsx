import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { getUser } from '@/actions/get-user';

const cards = [
    { title: "Database", src: "/images/database.png", href: "/databases", allowedUser: true },
    { title: "Task Manager", src: "/images/task.png", href: "/projects", allowedUser: true },
    { title: "Our Team", src: "/images/team.png", href: "/users", allowedUser: false },
    { title: "Ticket", src: "/images/ticket.png", href: "", allowedUser: true },
    { title: "Events and Meeting", src: "/images/meetings.png", href: "/meet", allowedUser: true },
    { title: "Messages", src: "/images/messages.png", href: "", allowedUser: true },
    { title: "Personal Folder", src: "/images/personalfolder.png", href: "/personal-documents", allowedUser: true },
    { title: "Share Folder", src: "/images/sharedfolder.png", href: "/shared-documents", allowedUser: true },
  ];
  
  export default async function Dashboard() {
    const data = await getUser();
    if (!data) {
      return <div>No user data.</div>;
    }
  
    // Dynamically filter cards based on allowedRoles
    const filteredCards = data.is_admin ? cards : cards.filter((card) => {
      return card.allowedUser
    });
  
    return (
      <div className="px-6 py-8 mt-0 m-16">
        <h1 className="text-xl font-semibold text-center md:text-left">MY DASHBOARD</h1>
        <p className="text-center text-lg mt-4">
          <span className="font-bold">{data.name} - {data.role}</span>
        </p>
        <div className="flex flex-wrap justify-center mt-8">
          {filteredCards.map((card, index) => (
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
  }
  