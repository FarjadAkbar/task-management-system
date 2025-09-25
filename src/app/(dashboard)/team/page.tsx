import React from 'react';
import Link from 'next/link';
import { 
  Code, 
  Palette, 
  PenTool, 
  Search, 
  Truck, 
  ShoppingCart,
  Users,
  Briefcase,
  Target,
  Calendar,
  MessageSquare
} from 'lucide-react';

const teamRoles = [
    { 
      icon: Code, 
      title: 'Web Developer', 
      link: 'team/web-developer',
      description: 'Full-stack development and system architecture'
    },
    { 
      icon: Palette, 
      title: 'Graphic Designer', 
      link: 'team/graphic-designer',
      description: 'Visual design and brand consistency'
    },
    { 
      icon: PenTool, 
      title: 'SEO Content Writer', 
      link: 'team/seo-content-writer',
      description: 'Content creation and SEO optimization'
    },
    { 
      icon: Search, 
      title: 'SEO Specialist', 
      link: 'team/seo-specialist',
      description: 'Search engine optimization and analytics'
    },
    { 
      icon: Truck, 
      title: 'Shipping & Logistics', 
      link: 'team/shipping',
      description: 'Order fulfillment and delivery management'
    },
    { 
      icon: ShoppingCart, 
      title: 'Marketplace Manager', 
      link: 'team/marketplace',
      description: 'Amazon, eBay, Walmart platform management'
    },
];

const quickAccess = [
  { icon: Briefcase, title: 'Projects', href: '/projects', description: 'Manage team projects' },
  { icon: Target, title: 'Tasks', href: '/projects', description: 'View assigned tasks' },
  { icon: Calendar, title: 'Meetings', href: '/event', description: 'Schedule and join meetings' },
  { icon: MessageSquare, title: 'Chat', href: '/chat', description: 'Team communication' },
];

const Ourteam = () => {
    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="container mx-auto px-4">
                {/* Header */}
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">Team Management</h1>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                        Access team guidelines, role-specific resources, and collaboration tools
                    </p>
                </div>

                {/* Quick Access */}
                <div className="mb-12">
                    <h2 className="text-2xl font-semibold text-gray-900 mb-6 text-center">Quick Access</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        {quickAccess.map((item, index) => (
                            <Link key={index} href={item.href} className="group">
                                <div className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border border-gray-200">
                                    <div className="flex items-center gap-3 mb-3">
                                        <div className="p-2 bg-blue-100 rounded-lg group-hover:bg-blue-200 transition-colors">
                                            <item.icon className="w-5 h-5 text-blue-600" />
                                        </div>
                                        <h3 className="font-semibold text-gray-900">{item.title}</h3>
                                    </div>
                                    <p className="text-sm text-gray-600">{item.description}</p>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>

                {/* Team Roles */}
                <div>
                    <h2 className="text-2xl font-semibold text-gray-900 mb-6 text-center">Team Roles & Guidelines</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {teamRoles.map((role, index) => (
                            <Link key={index} href={role.link} className="group">
                                <div className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border border-gray-200">
                                    <div className="flex items-center gap-4 mb-4">
                                        <div className="p-3 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg group-hover:scale-110 transition-transform">
                                            <role.icon className="w-6 h-6 text-white" />
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-semibold text-gray-900">{role.title}</h3>
                                            <p className="text-sm text-gray-600">{role.description}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-between text-sm text-blue-600 group-hover:text-blue-700">
                                        <span>View Guidelines</span>
                                        <span>→</span>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>

                {/* Team Stats */}
                <div className="mt-12 bg-white rounded-xl p-8 shadow-md border border-gray-200">
                    <h2 className="text-2xl font-semibold text-gray-900 mb-6 text-center">Team Overview</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                        <div className="text-center">
                            <div className="text-3xl font-bold text-blue-600 mb-2">24</div>
                            <div className="text-sm text-gray-600">Active Members</div>
                        </div>
                        <div className="text-center">
                            <div className="text-3xl font-bold text-green-600 mb-2">6</div>
                            <div className="text-sm text-gray-600">Specialized Roles</div>
                        </div>
                        <div className="text-center">
                            <div className="text-3xl font-bold text-purple-600 mb-2">12</div>
                            <div className="text-sm text-gray-600">Active Projects</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Ourteam;
