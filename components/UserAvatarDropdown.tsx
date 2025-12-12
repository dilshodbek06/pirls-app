"use client";

import { ClipboardCheck, LogOut, UserCircle } from "lucide-react";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { User } from "@/lib/session";
import { logoutAction, logoutPupil } from "@/actions/auth";
import { clearUserCache } from "@/hooks/use-user";

interface UserAvatarDropdownProps {
  user: User;
}

export function UserAvatarDropdown({ user }: UserAvatarDropdownProps) {
  const linksByRole: Record<
    User["role"],
    { dashboard?: string; results?: string }
  > = {
    TEACHER: { dashboard: "/teacher/dashboard", results: "/teacher/results" },
    ADMIN: { dashboard: "/admin/dashboard", results: "/admin/dashboard" },
    USER: { results: "/results" },
    GUEST: { dashboard: "/" },
  };

  // Derive user initials with sensible fallback
  const initials =
    (user.email || user.fullName || "")
      .split("@")[0]
      .split(".")
      .filter(Boolean)
      .map((part) => part[0]?.toUpperCase())
      .join("")
      .slice(0, 2) || "U";

  const roleLinks = linksByRole[user.role] ?? linksByRole.GUEST;

  const handleLogOut = async () => {
    // Clear the user cache before logging out
    clearUserCache();
    if (user.role === "USER") {
      await logoutPupil();
    } else {
      await logoutAction();
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="flex items-center gap-2 hover:opacity-80 transition-opacity cursor-pointer">
          <Avatar className="h-8 w-8 bg-white/30 border border-white/40">
            <AvatarFallback className="bg-linear-to-br from-blue-400 to-blue-600 text-white font-semibold text-xs">
              {initials || "U"}
            </AvatarFallback>
          </Avatar>
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{user.email}</p>
            <p className="text-xs leading-none text-muted-foreground capitalize">
              {user.role === "USER" ? "O'quvchi" : user.role.toLowerCase()}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {roleLinks.dashboard && (
          <Link href={roleLinks.dashboard} className="w-full">
            <DropdownMenuItem className="cursor-pointer hover:text-black hover:bg-gray-200/70">
              <UserCircle className="mr-2 h-4 w-4 " />
              <span>Mening kabinetim</span>
            </DropdownMenuItem>
          </Link>
        )}

        {roleLinks.results && (
          <Link href={roleLinks.results} className="w-full">
            <DropdownMenuItem className="cursor-pointer hover:text-black hover:bg-gray-200/70 group">
              <ClipboardCheck className="mr-2 h-4 w-4 group-hover:text-white" />
              <span>Natijalar</span>
            </DropdownMenuItem>
          </Link>
        )}
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={handleLogOut}
          className="cursor-pointer group hover:bg-gray-200/70"
        >
          <LogOut className="mr-2 h-4 w-4 group-hover:text-red-500" />
          <span className="group-hover:text-red-500">Logout</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
