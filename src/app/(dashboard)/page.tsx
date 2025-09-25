import type { Metadata } from "next";
import { DashboardCard } from "@/components/dashboard/dashboard-card";
import { getUser } from "@/lib/get-user";
import { 
  Database, 
  CheckSquare, 
  Users, 
  Ticket, 
  Calendar, 
  MessageSquare, 
  FolderOpen,
  Plus,
  BarChart3,
  Clock,
  Settings
} from "lucide-react";

export const metadata: Metadata = {
  title: "Dashboard | WorkSync",
  description: "Access all your workspace tools and resources in WorkSync",
};

const cards = [
  {
    title: "Projects",
    icon: CheckSquare,
    href: "/projects",
    allowedUser: true,
    description: "Manage your projects and tasks"
  },
  {
    title: "Team",
    icon: Users,
    href: "/users",
    allowedUser: false,
    description: "View and manage team members"
  },
  {
    title: "Calendar",
    icon: Calendar,
    href: "/event",
    allowedUser: true,
    description: "Schedule meetings and events"
  },
  {
    title: "Messages",
    icon: MessageSquare,
    href: "/chat",
    allowedUser: true,
    description: "Chat with your team"
  },
  {
    title: "Files",
    icon: FolderOpen,
    href: "/files",
    allowedUser: true,
    description: "Manage your documents"
  },
  {
    title: "Tickets",
    icon: Ticket,
    href: "/tickets",
    allowedUser: true,
    description: "Support ticket system"
  },
];

export default async function Dashboard() {
  const data = await getUser();

  if (!data) {
    return <div className="text-center text-gray-700 dark:text-white">No user data.</div>;
  }

  // Dynamically filter cards based on allowedRoles
  const filteredCards = data.role === "ADMIN"
    ? cards
    : cards.filter((card) => card.allowedUser);

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 rounded-2xl p-8 text-white shadow-xl">
        <div className="max-w-4xl">
          <h1 className="text-3xl md:text-4xl font-bold mb-3">
            Welcome back, {data.name}!
          </h1>
          <p className="text-blue-100 text-lg md:text-xl mb-4">
            <span className="font-semibold bg-white/20 px-3 py-1 rounded-full text-sm">
              {data.role}
            </span> • Manage your projects and collaborate with your team
          </p>
          <div className="flex items-center gap-4 text-blue-100">
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5" />
              <span>Last login: {new Date().toLocaleDateString()}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Active Projects</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">12</p>
            </div>
            <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-full">
              <CheckSquare className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Team Members</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">24</p>
            </div>
            <div className="p-3 bg-green-100 dark:bg-green-900 rounded-full">
              <Users className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Pending Tasks</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">8</p>
            </div>
            <div className="p-3 bg-orange-100 dark:bg-orange-900 rounded-full">
              <Ticket className="w-6 h-6 text-orange-600 dark:text-orange-400" />
            </div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">This Week</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">32h</p>
            </div>
            <div className="p-3 bg-purple-100 dark:bg-purple-900 rounded-full">
              <BarChart3 className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Main Tools Grid */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Workspace Tools
          </h2>
          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
            <span>Quick access to all your tools</span>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCards.map((card, index) => (
            <DashboardCard
              key={index}
              title={card.title}
              icon={card.icon}
              href={card.href}
              description={card.description}
            />
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Recent Activity
        </h3>
        <div className="space-y-3">
          <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span className="text-sm text-gray-600 dark:text-gray-400">
              You completed task "Update project documentation"
            </span>
            <span className="text-xs text-gray-500 ml-auto">2h ago</span>
          </div>
          <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
            <span className="text-sm text-gray-600 dark:text-gray-400">
              New message from John Doe in #general
            </span>
            <span className="text-xs text-gray-500 ml-auto">4h ago</span>
          </div>
          <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
            <span className="text-sm text-gray-600 dark:text-gray-400">
              Meeting "Sprint Planning" scheduled for tomorrow
            </span>
            <span className="text-xs text-gray-500 ml-auto">6h ago</span>
          </div>
        </div>
      </div>
    </div>
  );
}
