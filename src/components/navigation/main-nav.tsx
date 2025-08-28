"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Home, BarChart3, Settings, Plus } from "lucide-react";
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
              pathname === item.href
                ? "text-black"
                : "text-muted-foreground"
            )}
          >
            <div className="flex items-center space-x-2">
              <item.icon className="h-4 w-4" />
              <span>{item.title}</span>
            </div>
          </Link>
        ))}
      </div>

      <div className="ml-auto flex items-center space-x-4">
        <Link href="/editor/new">
          <Button size="sm" className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            <span className="hidden sm:inline">New Page</span>
          </Button>
        </Link>
      </div>
    </nav>
  );
}
