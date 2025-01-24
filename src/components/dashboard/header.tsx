"use client";
import React, { useState } from "react";
import Image from "next/image";
import { FaUserCircle, FaBell, FaBars, FaTimes } from "react-icons/fa";
import Link from "next/link";
import { useRouter } from "next/navigation";
import AvatarDropdown from "./avatar-dropdown";

type Props = {
  id: string;
  name: string;
  email: string;
  avatar: string;
};

const Header = ({ id, name, email, avatar }: Props) => {
  const router = useRouter();
  // const { data: session } = useSession();
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  return (
    <header className="bg-black text-white px-4 py-1 flex items-center justify-between relative">
      <div className="flex items-center space-x-4">
        <Image src={"/images/logo.png"} alt="Logo" width={120} height={120} />
      </div>
      <div className="hidden md:flex space-x-6">
        <nav className="space-x-6">
          <Link href="/dashboard" passHref>
            <span className="hover:text-gold font-semibold text-lg">
              Dashboard
            </span>
          </Link>
          <Link href="/task" passHref>
            <span className="hover:text-gold font-semibold text-lg">Task</span>
          </Link>
          <Link href="/tools" passHref>
            <span className="hover:text-gold font-semibold text-lg">Tools</span>
          </Link>
          <Link href="/guidelines" passHref>
            <span className="hover:text-gold font-semibold text-lg">
              Guidelines
            </span>
          </Link>
          <Link href="/zoom" passHref>
            <span className="hover:text-gold font-semibold text-lg">
              Zoom Meeting
            </span>
          </Link>
          <Link href="/suggestion" passHref>
            <span className="hover:text-gold font-semibold text-lg">
              Suggestion
            </span>
          </Link>
        </nav>
      </div>
      <AvatarDropdown avatar={avatar} userId={id} name={name} email={email} />

      <div className="md:hidden flex items-center">
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="text-2xl ml-4"
        >
          {menuOpen ? <FaTimes /> : <FaBars />}
        </button>
      </div>
      {menuOpen && (
        <div className="absolute top-full left-0 right-0 bg-black text-white p-4 space-y-4 md:hidden z-10">
          <Link href="#" passHref>
            <span className="block px-4 py-2 hover:text-gold font-semibold text-lg">
              My Dashboard
            </span>
          </Link>
          <Link href="#" passHref>
            <span className="block px-4 py-2 hover:text-gold font-semibold text-lg">
              Task
            </span>
          </Link>
          <Link href="#" passHref>
            <span className="block px-4 py-2 hover:text-gold font-semibold text-lg">
              Tools
            </span>
          </Link>
          <Link href="#" passHref>
            <span className="block px-4 py-2 hover:text-gold font-semibold text-lg">
              Guidelines
            </span>
          </Link>
          <Link href="#" passHref>
            <span className="block px-4 py-2 hover:text-gold font-semibold text-lg">
              Zoom Meeting
            </span>
          </Link>
          <Link href="#" passHref>
            <span className="block px-4 py-2 hover:text-gold font-semibold text-lg">
              Suggestion
            </span>
          </Link>
        </div>
      )}
    </header>
  );
};

export default Header;
