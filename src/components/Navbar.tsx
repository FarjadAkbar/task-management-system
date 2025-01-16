"use client"
import React, { useState } from 'react';
import logo from "@/components/ui/images/logo.png";
import Image from 'next/image';
import { FaUserCircle, FaBell, FaBars, FaTimes } from "react-icons/fa";
import Link from 'next/link';
import { useRouter } from 'next/navigation';

// import { signIn, signOut, useSession } from 'next-auth/react';


const Navbar: React.FC = () => {
    const router = useRouter()
    // const { data: session } = useSession();
    const [menuOpen, setMenuOpen] = useState(false);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    return (
        <header className="bg-black text-white px-4 py-1 flex items-center justify-between relative">
            <div className="flex items-center space-x-4">
                <Image src={logo} alt="Logo" className="h-18 w-36" />
            </div>
            <div className="hidden md:flex space-x-6">
                <nav className="space-x-6">
                    <Link href="/dashboard" passHref>
                        <span className="hover:text-gold font-semibold text-lg">Dashboard</span>
                    </Link>
                    <Link href="/task" passHref>
                        <span className="hover:text-gold font-semibold text-lg">Task</span>
                    </Link>
                    <Link href="/tools" passHref>
                        <span className="hover:text-gold font-semibold text-lg">Tools</span>
                    </Link>
                    <Link href="/guidelines" passHref>
                        <span className="hover:text-gold font-semibold text-lg">Guidelines</span>
                    </Link>
                    <Link href="/zoom" passHref>
                        <span className="hover:text-gold font-semibold text-lg">Zoom Meeting</span>
                    </Link>
                    <Link href="/suggestion" passHref>
                        <span className="hover:text-gold font-semibold text-lg">Suggestion</span>
                    </Link>
                </nav>
            </div>
            <div className="flex items-center space-x-4 md:space-x-4 md:ml-0 ml-auto relative">
                <button onClick={() => setDropdownOpen(!dropdownOpen)} className="flex items-center space-x-4 font-semibold">
                    <span className="hidden md:flex text-lg">
                        {/* {session?.user?.email || session?.user?.name || ""} */}
                    </span>
                    <FaUserCircle className="text-xl" />
                </button>
                <FaBell className="text-lg cursor-pointer" />
                {dropdownOpen && (
                    <div className="absolute right-10 top-4 mt-2 bg-white text-black shadow-lg rounded-lg z-20 w-48">
                        <Link href="#" passHref>
                            <span className="block px-4 py-2 hover:text-gold font-semibold">My Account</span>
                        </Link>
                        <Link href="#" passHref>
                            <span className="block px-4 py-2 hover:text-gold font-semibold">Support</span>
                        </Link>
                        {/* {session?.user ? ( */}
                        <>
                            <button onClick={() => router.push('/auth/signIn')}>
                                <span className="block px-4 py-2 hover:text-gold font-semibold">LogOut</span>
                            </button>
                        </>

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
                        <span className="block px-4 py-2 hover:text-gold font-semibold text-lg">My Dashboard</span>
                    </Link>
                    <Link href="#" passHref>
                        <span className="block px-4 py-2 hover:text-gold font-semibold text-lg">Task</span>
                    </Link>
                    <Link href="#" passHref>
                        <span className="block px-4 py-2 hover:text-gold font-semibold text-lg">Tools</span>
                    </Link>
                    <Link href="#" passHref>
                        <span className="block px-4 py-2 hover:text-gold font-semibold text-lg">Guidelines</span>
                    </Link>
                    <Link href="#" passHref>
                        <span className="block px-4 py-2 hover:text-gold font-semibold text-lg">Zoom Meeting</span>
                    </Link>
                    <Link href="#" passHref>
                        <span className="block px-4 py-2 hover:text-gold font-semibold text-lg">Suggestion</span>
                    </Link>
                </div>
            )}
        </header>
    );
};

export default Navbar;
