"use client"

import Link from "next/link"
import { useAuth } from "@/components/auth-provider"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { FileText, LogOut, User, ChevronDown, Building2, Search } from "lucide-react"
import { useRouter } from "next/navigation"

export function Navbar() {
  const { user, isLoading, logout } = useAuth()
  const router = useRouter()

  const handleLogout = async () => {
    await logout()
    router.push("/")
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2">
          <FileText className="size-6 text-primary" />
          <span className="text-lg font-bold text-foreground">HandShaker</span>
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          <Link
            href="/"
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            Home
          </Link>
          {user && user.role === "USER" && (
            <Link
              href="/profile"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              My Profile
            </Link>
          )}
          {user && user.role === "COMPANY" && (
            <>
              <Link
                href="/company-profile"
                className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
              >
                My Company Profile
              </Link>
              <Link
                href="/search-profiles"
                className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
              >
                Search Profiles
              </Link>
            </>
          )}
        </nav>

        <div className="flex items-center gap-3">
          {isLoading ? (
            <div className="h-9 w-20 animate-pulse rounded-md bg-muted" />
          ) : user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center gap-2">
                  <div className="flex size-8 items-center justify-center rounded-full bg-primary text-primary-foreground">
                    {user.role === "COMPANY" ? (
                      <Building2 className="size-4" />
                    ) : (
                      <User className="size-4" />
                    )}
                  </div>
                  <span className="hidden text-sm font-medium sm:inline-block">
                    {user.email || "Account"}
                  </span>
                  <ChevronDown className="size-4 text-muted-foreground" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col gap-1">
                    <p className="text-sm font-medium">{user.email || "Account"}</p>
                    <p className="text-xs text-muted-foreground">
                      {user.role === "COMPANY" ? "Company Account" : "User Account"}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                {user.role === "USER" && (
                  <DropdownMenuItem
                    onClick={() => router.push("/profile")}
                    className="cursor-pointer"
                  >
                    <User className="mr-2 size-4" />
                    My Profile
                  </DropdownMenuItem>
                )}
                {user.role === "COMPANY" && (
                  <>
                    <DropdownMenuItem
                      onClick={() => router.push("/company-profile")}
                      className="cursor-pointer"
                    >
                      <Building2 className="mr-2 size-4" />
                      My Company Profile
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => router.push("/search-profiles")}
                      className="cursor-pointer"
                    >
                      <Search className="mr-2 size-4" />
                      Search Profiles
                    </DropdownMenuItem>
                  </>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={handleLogout}
                  className="cursor-pointer text-destructive focus:text-destructive"
                >
                  <LogOut className="mr-2 size-4" />
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => router.push("/auth?mode=login")}
              >
                Log in
              </Button>
              <Button size="sm" onClick={() => router.push("/auth?mode=register")}>
                Register
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  )
}
