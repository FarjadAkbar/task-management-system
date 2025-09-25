"use client"

import { useState } from "react"
import Link from "next/link"
import { Menu, X, Zap } from 'lucide-react'
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
    { name: "Projects", href: "/projects" },
    { name: "Team", href: "/users" },
    { name: "Calendar", href: "/event" },
    { name: "Messages", href: "/chat" },
    { name: "Files", href: "/files" },
    { name: "Tickets", href: "/tickets" },
    { name: "Databases", href: "/databases" },
  ]

  return (
    <header className="sticky top-0 z-50 w-full bg-black border-b border-white/10 backdrop-blur-sm">
      <div className="container mx-auto px-4 py-2 flex items-center justify-between">
        <div className="flex items-center">
          <Link href="/" className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg">
              <Zap className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold text-white">WorkSync</span>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-1">
          {navItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="px-4 py-2 text-sm font-medium text-white hover:text-blue-300 transition-colors relative group rounded-lg hover:bg-white/10"
            >
              {item.name}
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-400 transition-all duration-300 group-hover:w-full"></span>
            </Link>
          ))}
        </nav>

        <div className="flex items-center space-x-3">
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
            className="md:hidden text-white"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div className={cn(
        "md:hidden absolute w-full top-full left-0 bg-black/95 backdrop-blur-sm transition-all duration-300 ease-in-out border-b border-white/10",
        menuOpen ? "max-h-[400px] py-4 opacity-100" : "max-h-0 py-0 opacity-0 overflow-hidden"
      )}>
        <nav className="container mx-auto px-4 flex flex-col space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="px-4 py-3 text-white hover:bg-white/10 rounded-lg transition-colors font-medium"
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
