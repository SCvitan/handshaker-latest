"use client";

import Link from "next/link";
import { useAuth } from "@/components/auth-provider";
import { useLanguage, type Locale } from "@/components/language-provider";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  FileText,
  LogOut,
  User,
  ChevronDown,
  Building2,
  Search,
  Globe,
  Settings,
  Briefcase,
  Heart,
  Crown,
} from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useRouter } from "next/navigation";

export function Navbar() {
  const { user, isLoading, logout } = useAuth();
  const { locale, setLocale, t } = useLanguage();
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    router.push("/");
  };

  const toggleLocale = () => {
    setLocale(locale === "en" ? "hr" : "en");
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2">
          <FileText className="size-6 text-primary" />
          <span className="text-lg font-bold text-foreground">CVBuilder</span>
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          {user && user.role === "USER" && (
            <Link
              href="/profile"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              {t("nav.myProfile")}
            </Link>
          )}
          {user && user.role === "COMPANY" && (
            <>
              <Link
                href="/company-dashboard"
                className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
              >
                Dashboard
              </Link>
              <Link
                href="/search-profiles"
                className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
              >
                {t("nav.searchProfiles")}
              </Link>
              <Link
                href="/my-jobs"
                className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
              >
                {t("nav.myJobs") || "My Jobs"}
              </Link>
            </>
          )}
        </nav>

        <div className="flex items-center gap-3">
          {/* Language toggle */}
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleLocale}
            className="gap-1.5 text-muted-foreground hover:text-foreground"
          >
            <Globe className="size-4" />
            <span className="text-xs font-semibold uppercase">{locale}</span>
          </Button>

          {isLoading ? (
            <div className="h-9 w-20 animate-pulse rounded-md bg-muted" />
          ) : user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center gap-2">
                  <Avatar className="size-8">
                    <AvatarImage
                      src={user.profileImageUrl ?? undefined}
                      alt={user.email}
                    />
                    <AvatarFallback className="text-xs font-semibold">
                      {user.role === "COMPANY" ? (
                        <Building2 className="size-4" />
                      ) : (
                        <User className="size-4" />
                      )}
                    </AvatarFallback>
                  </Avatar>
                  <span className="hidden text-sm font-medium sm:inline-block">
                    {user.email || t("nav.account")}
                  </span>
                  <ChevronDown className="size-4 text-muted-foreground" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col gap-1">
                    <p className="text-sm font-medium">
                      {user.email || t("nav.account")}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {user.role === "COMPANY"
                        ? t("nav.companyAccount")
                        : t("nav.userAccount")}
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
                    {t("nav.myProfile")}
                  </DropdownMenuItem>
                )}
                {user.role === "COMPANY" && (
                  <>
                    <DropdownMenuItem
                      onClick={() => router.push("/company-profile")}
                      className="cursor-pointer"
                    >
                      <Building2 className="mr-2 size-4" />
                      {t("nav.companyProfile")}
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => router.push("/my-jobs")}
                      className="cursor-pointer"
                    >
                      <Briefcase className="mr-2 size-4" />
                      {t("nav.myJobs") || "My Jobs"}
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => router.push("/search-profiles")}
                      className="cursor-pointer"
                    >
                      <Search className="mr-2 size-4" />
                      {t("nav.searchProfiles")}
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => router.push("/subscription")}
                      className="cursor-pointer"
                    >
                      <Crown className="mr-2 size-4" />
                      {t("nav.subscription") || "Pricing"}
                    </DropdownMenuItem>
                  </>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => router.push("/settings")}
                  className="cursor-pointer"
                >
                  <Settings className="mr-2 size-4" />
                  {t("nav.settings")}
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={handleLogout}
                  className="cursor-pointer text-destructive focus:text-destructive"
                >
                  <LogOut className="mr-2 size-4" />
                  {t("nav.logOut")}
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
                {t("nav.logIn")}
              </Button>
              <Button
                size="sm"
                onClick={() => router.push("/auth?mode=register")}
              >
                {t("nav.register")}
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
