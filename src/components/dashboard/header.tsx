"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Menu, X } from 'lucide-react'

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { AvatarDropdown } from "@/components/ui/avatar-dropdown"

type HeaderProps = {
  id: string
  name: string
  email: string
  avatar: string
}

export function Header({ id, name, email, avatar }: HeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false)

  const navItems = [
    { name: "Dashboard", href: "/" },
    { name: "Tasks", href: "/projects/67dfb82f97615f9768c9824f/board" },
    { name: "Tools", href: "/tools" },
    { name: "Guidelines", href: "/team" },
    { name: "Meeting", href: "/event" },
    { name: "Suggestion", href: "/suggestion" },
  ]

  return (
    <header className="sticky top-0 z-50 w-full bg-black border-b border-white/10 backdrop-blur-sm">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center">
          <Link href="/" className="flex items-center">
            <Image
              src="/images/logo.png"
              alt="Logo"
              width={100}
              height={40}
              className="h-10 w-auto"
            />
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="flex items-center space-x-1">
          {navItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              prefetch={true}
              className="px-3 py-2 text-sm font-medium text-white hover:text-gold transition-colors relative group"
            >
              {item.name}
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gold transition-all duration-300 group-hover:w-full"></span>
            </Link>
          ))}
        </nav>

        <div className="flex items-center">
          <AvatarDropdown
            avatar={avatar}
            userId={id}
            name={name}
            email={email}
          />

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="ml-2 md:hidden text-white"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div className={cn(
        "md:hidden absolute w-full bg-black/95 backdrop-blur-sm transition-all duration-300 ease-in-out border-b border-white/10",
        menuOpen ? "max-h-[400px] py-4 opacity-100" : "max-h-0 py-0 opacity-0 overflow-hidden"
      )}>
        <nav className="container mx-auto px-4 flex flex-col space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="px-4 py-3 text-white hover:bg-white/10 rounded-md transition-colors"
              onClick={() => setMenuOpen(false)}
            >
              {item.name}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  )
}
