"use client"

import Link from "next/link"
import { useState } from "react"
import { usePathname } from "next/navigation"
import { Menu, User, LogOut, Settings, Heart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { useAuth } from "@/lib/auth"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { toast } from "@/components/ui/use-toast"

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const pathname = usePathname()
  const { user, isAuthenticated, logout } = useAuth()

  // 受保护导航：未登录时给出提示
  const handleProtectedNav = (href: string) => (e: React.MouseEvent) => {
    if (!isAuthenticated) {
      e.preventDefault()
      toast({
        title: "Authentication Required",
        description: (
          <span>
            Please{" "}
            <Link href="/login" className="underline text-cyan-700">
              log in
            </Link>{" "}
            or{" "}
            <Link href="/register" className="underline text-cyan-700">
              sign up
            </Link>{" "}
            to use this feature.
          </span>
        ),
      })
    }
  }

  const isActive = (path: string) => {
    if (path === "/") return pathname === "/"
    return pathname?.startsWith(path)
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white">
      <div className="container flex h-16 items-center justify-between px-4">
        {/* 品牌：昊甲能源 + Haojia Energy（小字） */}
        <div className="flex items-center gap-2">
          <Link href="/" className="flex flex-col leading-tight">
            <span className="text-xl font-bold text-cyan-700">昊甲能源</span>
            <span className="text-xs text-gray-500 -mt-1">Haojia Energy</span>
          </Link>
        </div>

        {/* 桌面导航 */}
        <nav className="hidden md:flex items-center gap-6">
          <Link
            href="/"
            className={`text-sm font-medium transition-colors ${
              isActive("/") ? "text-cyan-700" : "hover:text-cyan-700"
            } animated-underline`}
          >
            Home
          </Link>

          <Link
            href="/resources"
            className={`text-sm font-medium transition-colors ${
              isActive("/resources") ? "text-cyan-700" : "hover:text-cyan-700"
            } animated-underline`}
            onClick={handleProtectedNav("/resources")}
          >
            Resources
          </Link>

          <Link
            href="/category"
            className={`text-sm font-medium transition-colors ${
              isActive("/category") ? "text-cyan-700" : "hover:text-cyan-700"
            } animated-underline`}
          >
            Category
          </Link>

          <Link
            href="/meter-detection"
            className={`text-sm font-medium transition-colors ${
              isActive("/meter-detection") ? "text-cyan-700" : "hover:text-cyan-700"
            } animated-underline`}
            onClick={handleProtectedNav("/meter-detection")}
          >
            Meter-Detection
          </Link>

          <Link
            href="/#about"
            className="text-sm font-medium hover:text-cyan-700 transition-colors animated-underline"
          >
            About
          </Link>
        </nav>

        {/* 右侧头像/登录 */}
        <div className="hidden md:flex items-center gap-4">
          {isAuthenticated ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user?.avatar || "/placeholder.svg"} alt={user?.name} />
                    <AvatarFallback>{user?.name?.charAt(0) || "U"}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <div className="flex flex-col space-y-1 p-2">
                  <p className="text-sm font-medium leading-none">{user?.name}</p>
                  <p className="text-xs leading-none text-muted-foreground">{user?.email}</p>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/profile" className="cursor-pointer">
                    <User className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/profile/favorites" className="cursor-pointer">
                    <Heart className="mr-2 h-4 w-4" />
                    <span>Favorites</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/profile/settings" className="cursor-pointer">
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Settings</span>
                  </Link>
                </DropdownMenuItem>
                {/* 后台管理入口 */}
                <DropdownMenuItem asChild>
                  <Link href="/admin" className="cursor-pointer">
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Admin Panel</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={logout} className="cursor-pointer">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <>
              <Button asChild variant="ghost">
                <Link href="/login">Log in</Link>
              </Button>
              <Button asChild>
                <Link href="/register">Sign up</Link>
              </Button>
            </>
          )}
        </div>

        {/* 移动端导航抽屉 */}
        <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
          <SheetTrigger asChild className="md:hidden">
            <Button variant="ghost" size="icon" aria-label="Menu">
              <Menu className="h-6 w-6" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-[300px] sm:w-[400px]">
            {/* 移动端品牌 */}
            <div className="mt-2">
              <Link href="/" onClick={() => setIsMenuOpen(false)} className="flex flex-col leading-tight">
                <span className="text-lg font-bold text-cyan-700">昊甲能源</span>
                <span className="text-xs text-gray-500 -mt-0.5">Haojia Energy</span>
              </Link>
            </div>

            <nav className="flex flex-col gap-4 mt-6">
              <Link
                href="/"
                className={`text-lg font-medium transition-colors ${
                  isActive("/") ? "text-cyan-700" : "hover:text-cyan-700"
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>

              <Link
                href="/resources"
                className={`text-lg font-medium transition-colors ${
                  isActive("/resources") ? "text-cyan-700" : "hover:text-cyan-700"
                }`}
                onClick={(e) => {
                  handleProtectedNav("/resources")(e)
                  if (isAuthenticated) setIsMenuOpen(false)
                }}
              >
                Resources
              </Link>

              <Link
                href="/category"
                className={`text-lg font-medium transition-colors ${
                  isActive("/category") ? "text-cyan-700" : "hover:text-cyan-700"
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                Category
              </Link>

              <Link
                href="/meter-detection"
                className={`text-lg font-medium transition-colors ${
                  isActive("/meter-detection") ? "text-cyan-700" : "hover:text-cyan-700"
                }`}
                onClick={(e) => {
                  handleProtectedNav("/meter-detection")(e)
                  if (isAuthenticated) setIsMenuOpen(false)
                }}
              >
                Meter-Detection
              </Link>

              <Link
                href="/#about"
                className="text-lg font-medium hover:text-cyan-700 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                About
              </Link>

              <div className="border-t pt-4 mt-4">
                {isAuthenticated ? (
                  <>
                    <div className="flex items-center gap-4 mb-4">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={user?.avatar || "/placeholder.svg"} alt={user?.name} />
                        <AvatarFallback>{user?.name?.charAt(0) || "U"}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{user?.name}</p>
                        <p className="text-sm text-gray-500">{user?.email}</p>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Button asChild variant="outline" className="w-full justify-start" size="sm">
                        <Link href="/profile" onClick={() => setIsMenuOpen(false)}>
                          <User className="mr-2 h-4 w-4" />
                          Profile
                        </Link>
                      </Button>
                      <Button asChild variant="outline" className="w-full justify-start" size="sm">
                        <Link href="/profile/favorites" onClick={() => setIsMenuOpen(false)}>
                          <Heart className="mr-2 h-4 w-4" />
                          Favorites
                        </Link>
                      </Button>
                      <Button asChild variant="outline" className="w-full justify-start" size="sm">
                        <Link href="/profile/settings" onClick={() => setIsMenuOpen(false)}>
                          <Settings className="mr-2 h-4 w-4" />
                          Settings
                        </Link>
                      </Button>
                      {/* 登录用户后台入口 */}
                      <Button asChild variant="outline" className="w-full justify-start" size="sm">
                        <Link href="/admin" onClick={() => setIsMenuOpen(false)}>
                          <Settings className="mr-2 h-4 w-4" />
                          Admin Panel
                        </Link>
                      </Button>
                      <Button
                        variant="outline"
                        className="w-full justify-start"
                        size="sm"
                        onClick={() => {
                          logout()
                          setIsMenuOpen(false)
                        }}
                      >
                        <LogOut className="mr-2 h-4 w-4" />
                        Log out
                      </Button>
                    </div>
                  </>
                ) : (
                  <div className="space-y-2">
                    <Button asChild className="w-full">
                      <Link href="/login" onClick={() => setIsMenuOpen(false)}>
                        Log in
                      </Link>
                    </Button>
                    <Button asChild variant="outline" className="w-full">
                      <Link href="/register" onClick={() => setIsMenuOpen(false)}>
                        Sign up
                      </Link>
                    </Button>
                  </div>
                )}
              </div>
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  )
}
