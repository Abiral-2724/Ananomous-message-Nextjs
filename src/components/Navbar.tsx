'use client'

import { useSession, signOut } from "next-auth/react"
import Link from "next/link"
import { User } from 'next-auth'
import { Button } from "@/components/ui/button"
import { Menu, MessageSquare, User as UserIcon } from "lucide-react"
import { useState } from "react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

const Navbar = () => {
  const { data: session } = useSession()
  const user: User = session?.user as User
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  return (
    <nav className="sticky top-0 z-50 bg-gray-900 text-white shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo and Brand */}
          <div className="flex items-center space-x-4">
            <Link href="/" className="flex items-center space-x-2">
              <MessageSquare className="h-6 w-6 text-blue-400" />
              <span className="text-xl font-bold">Mystery Message</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex md:items-center md:space-x-6">
            <Link href="/dashboard" className="hover:text-blue-400 transition-colors">
             Dashboard
            </Link>
            <Link href="/" className="hover:text-blue-400 transition-colors">
              Home
            </Link>

            {session ? (
              <div className="flex items-center space-x-4">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                      <UserIcon className="h-5 w-5" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56" align="end">
                    <DropdownMenuLabel>My Account</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>
                      <span>{user?.username || user?.email}</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Link href="/profile">Profile</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Link href="/settings">Settings</Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => signOut()}>
                      Log out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ) : (
              <Link href="/sign-in">
                <Button className="bg-blue-500 hover:bg-blue-600 text-white">
                  Login
                </Button>
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              className="h-10 w-10 p-0"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <Menu className="h-6 w-6" />
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-4 space-y-4">
            <Link
              href="/dashboard"
              className="block px-4 py-2 hover:bg-gray-800 rounded-md"
            >
              Dashboard
            </Link>
            <Link
              href="/"
              className="block px-4 py-2 hover:bg-gray-800 rounded-md"
            >
              Home
            </Link>
            {session ? (
              <>
                <div className="px-4 py-2 text-sm text-gray-300">
                  {user?.username || user?.email}
                </div>
                <Link
                  href="/profile"
                  className="block px-4 py-2 hover:bg-gray-800 rounded-md"
                >
                  Profile
                </Link>
                <Link
                  href="/settings"
                  className="block px-4 py-2 hover:bg-gray-800 rounded-md"
                >
                  Settings
                </Link>
                <Button
                  className="w-full text-center bg-red-500 hover:bg-red-600"
                  onClick={() => signOut()}
                >
                  Log out
                </Button>
              </>
            ) : (
              <Link href="/sign-in" className="block">
                <Button className="w-full bg-blue-500 hover:bg-blue-600 text-white">
                  Login
                </Button>
              </Link>
            )}
          </div>
        )}
      </div>
    </nav>
  )
}

export default Navbar