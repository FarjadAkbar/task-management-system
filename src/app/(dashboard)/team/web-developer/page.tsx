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
            <div className="max-w-7xl w-full bg-white shadow-xl rounded-lg p-10">
                <h1 className="text-3xl font-extrabold text-center text-gray-900">Web Developer</h1>
                <p className="text-lg text-gray-600 text-center mt-2">Employee Guidelines & Responsibilities</p>

                <div className="mt-6 border-t border-gray-300 pt-6">
                    <EmployeeGuidelines />
                </div>

                {/* Role-Specific Guidelines Section */}
                <section className="mt-10">
                    <h2 className="text-2xl font-bold text-black mb-6 text-center">Role-Specific Guidelines</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-gray-50 p-6 rounded-lg shadow-md">
                            <ul className="list-disc list-inside space-y-3 text-black text-base">
                                <li>Collaborate on web app design, development & deployment.</li>
                                <li>Ensure full responsiveness & mobile optimization.</li>
                                <li>Conduct weekly website audits to maintain functionality.</li>
                                <li>Implement UI components per design specs.</li>
                                <li>Follow clean coding, MVP, and unit testing principles.</li>
                                <li>Encrypt sensitive payment & user data securely.</li>
                                <li>Identify & report potential issues before escalation.</li>
                                <li>Avoid conflicts of interest in development tasks.</li>
                                <li>Meet project deadlines with high code quality.</li>
                                <li>Propose alternative solutions when needed.</li>
                                <li>Test for edge cases like failed payments or admin errors.</li>
                                <li>Ensure all updates & features are thoroughly tested.</li>
                                <li>Work with UI/UX designers for seamless experiences.</li>
                                <li>Update documentation to reflect system changes.</li>
                                <li>Prepare blueprints for new features & seek approval.</li>
                            </ul>
                        </div>
                        <div className="bg-gray-50 p-6 rounded-lg shadow-md">
                            <ul className="list-disc list-inside space-y-3 text-black text-base">
                                <li>Maintain clear project documentation & workflows.</li>
                                <li>Be available for urgent fixes or deployments.</li>
                                <li>Audit payment logs to detect security threats.</li>
                                <li>Manage an intuitive admin panel for operations.</li>
                                <li>Optimize database queries & ensure data security.</li>
                                <li>Develop responsive, SEO-friendly interfaces.</li>
                                <li>Maintain & optimize APIs and backend logic.</li>
                                <li>Secure payment gateways supporting various methods.</li>
                                <li>Automate reports for payment analytics.</li>
                                <li>Stay updated on security standards (e.g., PCI DSS).</li>
                                <li>Integrate third-party APIs like payments & shipping.</li>
                                <li>Stay proficient in core tech & frameworks.</li>
                                <li>Implement automated backups for databases.</li>
                                <li>Test all features in a staging environment before live deployment.</li>
                                <li>Ensure compliance with web accessibility standards.</li>
                            </ul>
                        </div>
                    </div>
                </section>

                {/* API Section */}
                {/* <section className="mt-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                    {["API", "User Name", "Password"].map((title, index) => (
                        <div
                            key={index}
                            className="bg-gray-50 border border-gray-300 shadow-md rounded-lg p-6 flex flex-col items-center text-center transition-all duration-300 hover:shadow-lg hover:scale-105"
                        >
                            <h3 className="text-xl font-semibold text-gray-800">{title}</h3>
                            <p className="text-sm text-gray-600 mt-2">Secure credentials stored safely</p>
                        </div>
                    ))}
                </section> */}
                <section className="mt-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                    {cards.map(({ title, description, path }) => (
                        <div
                            key={title}
                            className="bg-gray-50 border border-gray-300 shadow-md rounded-lg p-2 flex flex-col items-center text-center transition-all duration-300 hover:shadow-lg hover:scale-105 cursor-pointer"
                            onClick={() => router.push(path)}
                        >
                            <h3 className="text-xl font-semibold text-gray-800">{title}</h3>
                            <p className="text-sm text-gray-600 mt-1">{description}</p>
                        </div>
                    ))}
                </section>
            </div>
        </div>
    );
};

export default Page;