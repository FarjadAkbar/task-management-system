"use client"
import React, { useState } from 'react';
import logo from "@/components/ui/images/logo.png";
import Image from 'next/image';
import { FaUserCircle, FaBell, FaBars, FaTimes } from "react-icons/fa";
import Link from 'next/link';

const Navbar: React.FC = () => {
    const [menuOpen, setMenuOpen] = useState(false);
    const [dropdownOpen, setDropdownOpen] = useState(false);

    return (
        <header className="bg-black text-white px-4 py-1 flex items-center justify-between relative">
            <div className="flex items-center space-x-4">
                <Image src={logo} alt="Logo" className="h-16 w-36" />
            </div>
            <div className="hidden md:flex space-x-6">
                <nav className="space-x-6">
                    <Link href="/dashboard" passHref>
                        <span className="hover:text-yellow-500 font-semibold">My Dashboard</span>
                    </Link>
                    <Link href="/task" passHref>
                        <span className="hover:text-yellow-500 font-semibold">Task</span>
                    </Link>
                    <Link href="/tools" passHref>
                        <span className="hover:text-yellow-500 font-semibold">Tools</span>
                    </Link>
                    <Link href="/guidelines" passHref>
                        <span className="hover:text-yellow-500 font-semibold">Guidelines</span>
                    </Link>
                    <Link href="/zoom" passHref>
                        <span className="hover:text-yellow-500 font-semibold">Zoom Meeting</span>
                    </Link>
                    <Link href="/suggestion" passHref>
                        <span className="hover:text-yellow-500 font-semibold">Suggestion</span>
                    </Link>
                </nav>
            </div>
            <div className="flex items-center space-x-4 md:space-x-6 md:ml-0 ml-auto relative">
                <button onClick={() => setDropdownOpen(!dropdownOpen)} className="flex items-center space-x-2 font-semibold">
                    <span className="hidden md:flex">Ayesha T</span>
                    <FaUserCircle className="text-xl" />
                </button>
                <FaBell className="text-lg cursor-pointer" />
                {dropdownOpen && (
                    <div className="absolute right-10 top-4 mt-2 bg-white text-black shadow-lg rounded-lg z-20 w-48">
                        <Link href="#" passHref>
                            <span className="block px-4 py-2 hover:bg-gray-100">My Account</span>
                        </Link>
                        <Link href="#" passHref>
                            <span className="block px-4 py-2 hover:bg-gray-100">Support</span>
                        </Link>
                        <Link href="#" passHref>
                            <span className="block px-4 py-2 hover:bg-gray-100">Sign Out</span>
                        </Link>
                    </div>
                )}
            </div>
            <div className="md:hidden flex items-center">
                <button onClick={() => setMenuOpen(!menuOpen)} className="text-2xl ml-4">
                    {menuOpen ? <FaTimes /> : <FaBars />}
                </button>
            </div>
            {menuOpen && (
                <div className="absolute top-full left-0 right-0 bg-black text-white p-4 space-y-4 md:hidden z-10">
                    <Link href="#" passHref>
                        <span className="block px-4 py-2 hover:bg-gray-700 font-semibold">My Dashboard</span>
                    </Link>
                    <Link href="#" passHref>
                        <span className="block px-4 py-2 hover:bg-gray-700 font-semibold">Task</span>
                    </Link>
                    <Link href="#" passHref>
                        <span className="block px-4 py-2 hover:bg-gray-700 font-semibold">Tools</span>
                    </Link>
                    <Link href="#" passHref>
                        <span className="block px-4 py-2 hover:bg-gray-700 font-semibold">Guidelines</span>
                    </Link>
                    <Link href="#" passHref>
                        <span className="block px-4 py-2 hover:bg-gray-700 font-semibold">Zoom Meeting</span>
                    </Link>
                    <Link href="#" passHref>
                        <span className="block px-4 py-2 hover:bg-gray-700 font-semibold">Suggestion</span>
                    </Link>
                </div>
            )}
        </header>
    );
};

export default Navbar;
