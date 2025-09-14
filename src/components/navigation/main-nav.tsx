"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, BarChart3, Settings, Palette } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: Home,
  },
  {
    title: "Analytics",
    href: "/analytics",
    icon: BarChart3,
  },
  {
    title: "Themes",
    href: "/themes",
    icon: Palette,
  },
  {
    title: "Settings",
    href: "/settings",
    icon: Settings,
  },
];

export function MainNav() {
  const pathname = usePathname();

  return (
    <nav className="flex items-center space-x-4 lg:space-x-6">
      <Link href="/dashboard" className="flex items-center space-x-2">
        <div className="font-bold text-xl">Wilnk</div>
      </Link>

      <div className="hidden md:flex items-center space-x-4 ml-8">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "text-sm font-medium transition-colors hover:text-primary",
              pathname === item.href ? "text-black" : "text-muted-foreground",
            )}
          >
            <div className="flex items-center space-x-2">
              <item.icon className="h-4 w-4" />
              <span>{item.title}</span>
            </div>
          </Link>
        ))}
      </div>
    </nav>
  );
}
