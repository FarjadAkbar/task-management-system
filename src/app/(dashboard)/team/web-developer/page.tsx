import EmployeeGuidelines from '@/components/dashboard/team/employee-guidelines'
import React from 'react'


const page = () => {
    return (
        <div>
            <div className="bg-gray-100 min-h-screen p-6">
                <div className="max-w-7xl mx-auto">
                    <h1 className="text-2xl font-bol mb-4 font-semibold">Web-Developer</h1>
                    <EmployeeGuidelines />
                    {/* Role-Specific Guidelines Section */}
                    <section className="bg-white p-6 rounded-lg shadow-md mb-8">
                        <h2 className="text-2xl font-bold text-gray-800 mb-4">
                            Role-Specific Guidelines: Full Stack Developer
                        </h2>
                        <ul className="list-disc list-inside space-y-2 text-gray-700 text-sm">
                            <li>
                                Collaborate with the team to design, develop, test, and deploy web applications aligned with company goals.
                            </li>
                            <li>
                                Ensure the application and website are fully responsive and optimized for mobile and tablet devices.
                            </li>
                            <li>
                                Maintain and test the Dolce Frutti website regularly, conducting a detailed overview weekly to ensure seamless core functions.
                            </li>
                            <li>
                                Implement UI designs and interactive components according to specifications and design mockups.
                            </li>
                            <li>
                                Follow clean coding principles and best practices, such as MVP architecture, Clean Architecture, and unit testing.
                            </li>
                            <li>
                                Encrypt sensitive payment and customer information to comply with data protection regulations.
                            </li>
                            <li>
                                Maintain accurate documentation for project requirements, workflows, and technical solutions.
                            </li>
                            <li>
                                Be available for emergency fixes or deployments as needed.
                            </li>
                            <li>
                                Regularly audit application and payment gateway logs to detect unusual activities or potential security breaches.
                            </li>
                            <li>
                                Maintain an intuitive admin panel for managing inventory, orders, customer data, and reports.
                            </li>
                            <li>
                                Optimize database queries and ensure data security.
                            </li>
                            <li>
                                Create responsive, SEO-optimized, and user-friendly interfaces.
                            </li>
                            <li>
                                Develop and maintain robust APIs and server-side logic.
                            </li>
                            <li>
                                Maintain secure payment gateways, ensuring compatibility with multiple options like credit cards, digital wallets, and bank transfers.
                            </li>
                            <li>
                                Generate automated reports to review payment gateway analytics and flag potential issues early.
                            </li>
                            <li>
                                Identify potential bottlenecks or issues before they arise and communicate them proactively to the team.
                            </li>
                            <li>
                                Avoid conflicts of interest in any development-related activities.
                            </li>
                            <li>
                                Meet project deadlines and milestones while ensuring code quality and performance.
                            </li>
                            <li>
                                Propose alternative solutions or strategies when challenges occur.
                            </li>
                            <li>
                                Test for edge cases, such as failed payments, incomplete orders, or admin panel errors.
                            </li>
                            <li>
                                Ensure all features and updates are thoroughly tested before deployment.
                            </li>
                            <li>
                                Collaborate with UI/UX designers to ensure applications meet user needs and provide a seamless experience.
                            </li>
                            <li>
                                Stay updated with the latest security standards (e.g., PCI DSS compliance) to ensure safe and secure transactions.
                            </li>
                            <li>
                                Develop and manage third-party integrations such as payment gateways, shipping APIs (e.g., FedEx), and analytics tools.
                            </li>
                            <li>
                                Maintain proficiency in the core technologies used.
                            </li>
                            <li>
                                Maintain automated backup solutions for critical application and database components.
                            </li>
                            <li>
                                Have all features and bug fixes tested and reviewed in the test environment by a senior developer and supervisors before deploying to live.
                            </li>
                            <li>
                                Ensure that all web applications comply with accessibility standards (e.g., WCAG) to provide an inclusive experience for all users.
                            </li>
                            <li>
                                Update team documentation regularly to reflect any changes in architecture or tools.
                            </li>
                            <li>
                                Draft a detailed blueprint for any proposed improvements or new features, including Purpose, Implementation Plan, Impact Analysis, Cost & Resource Requirements. Present the blueprint during a team meeting or one-on-one with the manager for discussion & seek authorization only after the blueprint has been reviewed and approved.
                            </li>
                        </ul>
                    </section>

                    {/* API Section */}
                    <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                        {["API", "User Name", "Password"].map((title, index) => (
                            <div
                                key={index}
                                className="bg-white border border-gray-200 shadow-md rounded-lg p-6 flex flex-col items-center justify-center"
                            >
                                <h3 className="text-lg font-bold text-gray-800">{title}</h3>
                                <p className="text-sm text-gray-600 mt-2">User Name</p>
                                <p className="text-sm text-gray-600">Password</p>
                            </div>
                        ))}
                    </section>
                </div>
            </div>
        </div >
    )
}

export default page
