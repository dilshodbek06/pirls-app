"use client";

import { useState } from "react";
import { Menu, X } from "lucide-react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useUser } from "@/hooks/use-user";
import { UserAvatarDropdown } from "@/components/UserAvatarDropdown";
import { logoutAction } from "@/actions/auth";
import { clearUserCache } from "@/hooks/use-user";

const Header = () => {
  const location = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const { user, isLoggedIn, isLoading } = useUser();

  const navLinks = [
    { path: "/", label: "Asosiy" },
    { path: "/passages", label: "Barcha matnlar" },
    { path: "/about", label: "Biz haqimizda" },
    { path: "/contact", label: "Aloqa" },
  ];

  return (
    <header className="relative z-50 w-full">
      <div className="container max-w-360 mx-auto sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div>
              <Image
                className="rounded-full"
                alt="PIRLS EDU"
                src={"/images/logo.png"}
                width={50}
                height={50}
              />
            </div>
            <span className="text-xl font-bold text-white drop-shadow-lg">
              PIRLS EDU
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                href={link.path}
                className={`text-sm font-semibold transition-colors hover:text-white/80 relative drop-shadow-md ${
                  location === link.path ? "text-white" : "text-white/90"
                }`}
              >
                {link.label}
                {location === link.path && (
                  <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-white animate-scale-in" />
                )}
              </Link>
            ))}
          </nav>

          {/* Auth Section */}
          <div className="hidden md:flex items-center gap-4">
            {isLoading ? (
              <div className="w-8 h-8 rounded-full bg-white/20 animate-pulse" />
            ) : isLoggedIn && user ? (
              <UserAvatarDropdown user={user} />
            ) : (
              <Link
                href="/auth/login"
                className="text-sm font-semibold text-white hover:text-white/80 transition-colors bg-white/20 px-4 py-2 rounded-lg hover:bg-white/30"
              >
                Kirish
              </Link>
            )}
          </div>

          {/* Mobile Hamburger Button */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden p-2 rounded-lg bg-white/20 border border-white/30 text-white"
          >
            {menuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {menuOpen && (
        <div className="md:hidden bg-black/20 backdrop-blur-sm border-t border-white/20">
          <nav className="flex flex-col items-center gap-4 py-4">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                href={link.path}
                onClick={() => setMenuOpen(false)}
                className={`text-base font-medium transition-colors hover:text-white/80 ${
                  location === link.path ? "text-white" : "text-white/90"
                }`}
              >
                {link.label}
              </Link>
            ))}

            {/* Mobile Auth Section */}
            <div className="w-full px-4 border-t border-white/20 pt-4 mt-2 space-y-2">
              {isLoading ? (
                <div className="w-full h-10 rounded-lg bg-white/20 animate-pulse" />
              ) : isLoggedIn && user ? (
                <>
                  <div className="text-sm font-medium text-white/90 text-center px-4 py-2">
                    {user.email}
                  </div>
                  <Link
                    href="/admin/passages"
                    onClick={() => setMenuOpen(false)}
                    className="block text-center text-sm font-semibold text-white/90 hover:text-white transition-colors bg-white/10 hover:bg-white/20 px-4 py-2 rounded-lg"
                  >
                    Teacher Cabinet
                  </Link>
                  <button
                    onClick={async () => {
                      setMenuOpen(false);
                      clearUserCache();
                      await logoutAction();
                    }}
                    className="block w-full text-center text-sm font-semibold text-red-400 hover:text-red-300 transition-colors bg-white/10 hover:bg-white/20 px-4 py-2 rounded-lg"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <Link
                  href="/auth/teacher-login"
                  onClick={() => setMenuOpen(false)}
                  className="block text-center text-sm font-semibold text-white hover:text-white/80 transition-colors bg-white/20 px-4 py-2 rounded-lg hover:bg-white/30 w-full"
                >
                  Login
                </Link>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
