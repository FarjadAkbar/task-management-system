import type { Metadata } from "next";
import { DashboardCard } from "@/components/dashboard/dashboard-card";
import { getUser } from "@/lib/get-user";

export const metadata: Metadata = {
  title: "Dashboard | Team Workspace",
  description: "Access all your workspace tools and resources",
};

const cards = [
  {
    title: "Database",
    src: "/images/database.png",
    href: "/databases",
    allowedUser: true,
  },
  {
    title: "Task Manager",
    src: "/images/task.png",
    href: "/projects/67dfb82f97615f9768c9824f/board",
    allowedUser: true,
  },
  {
    title: "Our Team",
    src: "/images/team.png",
    href: "/users",
    allowedUser: false,
  },
  {
    title: "Ticket",
    src: "/images/ticket.png",
    href: "/tickets",
    allowedUser: true,
  },
  {
    title: "Events and Meeting",
    src: "/images/meetings.png",
    href: "/event",
    allowedUser: true,
  },
  {
    title: "Messages",
    src: "/images/messages.png",
    href: "/chat",
    allowedUser: true,
  },
  {
    title: "Personal Folder",
    src: "/images/personalfolder.png",
    href: "/files",
    allowedUser: true,
  },
  {
    title: "Share Folder",
    src: "/images/sharedfolder.png",
    href: "/files/shared",
    allowedUser: true,
  },
];

export default async function Dashboard() {
  const data = await getUser();

  if (!data) {
    return <div>No user data.</div>;
  }

  // Dynamically filter cards based on allowedRoles
  const filteredCards = data.role === "ADMIN"
    ? cards
    : cards.filter((card) => card.allowedUser);

  return (
    <>
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-amber-300 to-gold rounded-2xl p-8 mb-8 shadow-lg">
        <div className="max-w-3xl">
          <h1 className="text-3xl font-bold text-black mb-2">
            Welcome back, {data.name}!
          </h1>
          <p className="text-black text-lg">
            <span className="font-medium">{data.role}</span> • Access all your
            workspace tools and resources
          </p>
        </div>
      </div>

      {/* Cards Grid */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-6 text-gray-800 dark:text-white">
          Workspace Tools
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredCards.map((card, index) => (
            <DashboardCard
              key={index}
              title={card.title}
              src={card.src}
              href={card.href}
            />
          ))}
        </div>
      </div>
    </>
  );
}
