"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { Home, BookOpen, BarChart3 } from "lucide-react";

const AdminBottomNav = () => {
  const pathname = usePathname();

  const navItems = [
    {
      label: "Asosiy",
      href: "/admin/dashboard",
      icon: Home,
      active: pathname === "/admin/dashboard",
    },
    {
      label: "Matnlar",
      href: "/admin/passages",
      icon: BookOpen,
      active: pathname === "/admin/passages",
    },
    {
      label: "Natijalar",
      href: "/admin/results",
      icon: BarChart3,
      active: pathname === "/admin/results",
    },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-border z-40">
      <div className="container max-w-360 mx-auto px-4">
        <div className="flex items-center justify-around h-20">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex flex-col items-center justify-center gap-1 px-4 py-2 rounded-lg transition-all ${
                  item.active
                    ? "text-primary bg-primary/10"
                    : "text-muted-foreground hover:text-primary hover:bg-primary/5"
                }`}
              >
                <Icon className="w-6 h-6" />
                <span className="text-xs font-medium">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
};

export default AdminBottomNav;
