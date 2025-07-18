"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Menu, X, User, LogOut, Settings } from "lucide-react"
import { useAuthStore } from "@/stores/auth-store"
import { NotificationBell } from "@/components/notification-bell"

interface ClubRole {
  clubId: string;
  clubName: string;
  role: string;
}

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { user, logout } = useAuthStore()

  const navigation = [
    { name: "Trang chủ", href: "/" },
    { name: "Câu lạc bộ", href: "/clubs" },
    { name: "Sự kiện", href: "/events" },
    { name: "Câu lạc bộ của tôi", href: "/club-space" },
  ]

  // Add this after the existing navigation items
  let managedClubs: ClubRole[] = [];
  if (user && user.club_roles) {
    managedClubs = user.club_roles.filter((club) => club.role === "club_manager");
    if (managedClubs.length === 1) {
      navigation.push({
        name: "Quản lý CLB",
        href: `/clubs/${managedClubs[0].clubId}/manage`,
      });
    }
    // Nếu nhiều hơn 1 club, không push vào navigation, sẽ render dropdown riêng bên dưới
  }

  const getInitials = (name: string | undefined) => {
    if (!name) return "U" // Default fallback
    return name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  return (
    <header className="bg-white shadow-sm border-b sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <div className="text-2xl font-bold text-blue-600">UniVibe</div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-gray-700 hover:text-blue-600 px-3 py-2 text-sm font-medium transition-colors"
              >
                {item.name}
              </Link>
            ))}
            {/* Dropdown Quản lý CLB nếu có nhiều hơn 1 club */}
            {managedClubs.length > 1 && (
              <div className="relative group">
                <Button
                  variant="ghost"
                  className="text-gray-700 hover:text-blue-600 px-3 py-2 text-sm font-medium flex items-center"
                >
                  Quản lý CLB
                  <svg className="ml-1 w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
                </Button>
                <div className="absolute left-0 mt-2 w-56 bg-white border rounded shadow-lg opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity z-50">
                  {managedClubs.map((club) => (
                    <Link
                      key={club.clubId}
                      href={`/clubs/${club.clubId}/manage`}
                      className="block px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600 text-sm"
                    >
                      {club.clubName}
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </nav>

          {/* Desktop Auth */}
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <div className="flex items-center space-x-3">
                <NotificationBell />
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                      <Avatar className="h-8 w-8">
                        <AvatarImage
                          src={user.profile_picture_url || "/placeholder.svg"}
                          alt={user.full_name || user.email}
                        />
                        <AvatarFallback className="bg-blue-600 text-white text-xs">
                          {getInitials(user.full_name)}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56" align="end" forceMount>
                    <div className="flex items-center justify-start gap-2 p-2">
                      <div className="flex flex-col space-y-1 leading-none">
                        <p className="font-medium">{user.full_name || user.email}</p>
                        <p className="w-[200px] truncate text-sm text-muted-foreground">{user.email}</p>
                      </div>
                    </div>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link href="/profile">
                        <User className="mr-2 h-4 w-4" />
                        Hồ sơ cá nhân
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/profile?tab=settings">
                        <Settings className="mr-2 h-4 w-4" />
                        Cài đặt
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={logout}>
                      <LogOut className="mr-2 h-4 w-4" />
                      Đăng xuất
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ) : (
              <>
                <Button asChild variant="ghost" size="sm">
                  <Link href="/login">Đăng nhập</Link>
                </Button>
                <Button asChild size="sm" className="bg-blue-600 hover:bg-blue-700">
                  <Link href="/signup">Đăng ký</Link>
                </Button>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button variant="ghost" size="sm" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 border-t">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="text-gray-700 hover:text-blue-600 block px-3 py-2 text-base font-medium"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              {/* Dropdown Quản lý CLB cho mobile nếu có nhiều hơn 1 club */}
              {managedClubs.length > 1 && (
                <div className="border-t pt-2 mt-2">
                  <div className="font-semibold px-3 py-2 text-gray-700">Quản lý CLB</div>
                  {managedClubs.map((club) => (
                    <Link
                      key={club.clubId}
                      href={`/clubs/${club.clubId}/manage`}
                      className="block px-5 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600 text-base"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {club.clubName}
                    </Link>
                  ))}
                </div>
              )}
              <div className="border-t pt-4 mt-4">
                {user ? (
                  <>
                    <div className="flex items-center px-3 py-2">
                      <Avatar className="h-8 w-8 mr-3">
                        <AvatarImage
                          src={user.profile_picture_url || "/placeholder.svg"}
                          alt={user.full_name || user.email}
                        />
                        <AvatarFallback className="bg-blue-600 text-white text-xs">
                          {getInitials(user.full_name)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium text-sm">{user.full_name || user.email}</p>
                        <p className="text-xs text-gray-500">{user.email}</p>
                      </div>
                    </div>
                    <Link
                      href="/profile"
                      className="text-gray-700 hover:text-blue-600 block px-3 py-2 text-base font-medium"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Hồ sơ cá nhân
                    </Link>
                    <button
                      onClick={() => {
                        logout()
                        setIsMenuOpen(false)
                      }}
                      className="text-gray-700 hover:text-blue-600 block px-3 py-2 text-base font-medium w-full text-left"
                    >
                      Đăng xuất
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      href="/login"
                      className="text-gray-700 hover:text-blue-600 block px-3 py-2 text-base font-medium"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Đăng nhập
                    </Link>
                    <Link
                      href="/signup"
                      className="text-blue-600 hover:text-blue-700 block px-3 py-2 text-base font-medium"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Đăng ký
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}
