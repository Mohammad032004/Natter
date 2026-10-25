"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  MessageCircle,
  Search,
  Newspaper,
  Settings,
  LogOut,
} from "lucide-react";

const navigationItems = [
  {
    label: "Chats",
    href: "/dashboard",
    icon: MessageCircle,
  },
  {
    label: "Search",
    href: "/search",
    icon: Search,
  },
  {
    label: "Feed",
    href: "/feed",
    icon: Newspaper,
  },
];

export default function NavRail() {
  const pathname = usePathname();

  function isActive(href: string) {
    if (href === "/dashboard") {
      return pathname === "/dashboard" || pathname.startsWith("/chats");
    }

    return pathname === href || pathname.startsWith(`${href}/`);
  }

  async function handleLogout() {
    try {
      const response = await fetch("/api/auth/logout", {
        method: "POST",
      });

      if (response.ok) {
        window.location.href = "/login";
      }
    } catch (error) {
      console.error("[NAV] Logout failed:", error);
    }
  }

  return (
    <aside className="z-20 flex h-full w-[68px] shrink-0 flex-col items-center border-r border-slate-200 bg-white py-4">
      {/* Natter Logo */}
      <Link
        href="/dashboard"
        aria-label="Natter home"
        className="mb-8 flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-500 text-white shadow-sm transition hover:bg-emerald-600"
      >
        <MessageCircle className="h-6 w-6 fill-white/10" />
      </Link>

      {/* Main navigation */}
      <nav className="flex flex-1 flex-col items-center gap-3">
        {navigationItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              title={item.label}
              aria-label={item.label}
              aria-current={active ? "page" : undefined}
              className={`group relative flex h-11 w-11 items-center justify-center rounded-xl transition ${
                active
                  ? "bg-emerald-50 text-emerald-600"
                  : "text-slate-500 hover:bg-slate-100 hover:text-slate-800"
              }`}
            >
              {active && (
                <span className="absolute -left-[13px] h-6 w-1 rounded-r-full bg-emerald-500" />
              )}

              <Icon className="h-5 w-5" />

              {/* Tooltip */}
              <span className="pointer-events-none absolute left-14 z-50 whitespace-nowrap rounded-lg bg-slate-900 px-3 py-2 text-xs font-medium text-white opacity-0 shadow-lg transition group-hover:opacity-100">
                {item.label}
              </span>
            </Link>
          );
        })}
      </nav>

      {/* Bottom navigation */}
      <div className="flex flex-col items-center gap-3">
        <Link
          href="/settings"
          title="Settings"
          aria-label="Settings"
          aria-current={isActive("/settings") ? "page" : undefined}
          className={`flex h-11 w-11 items-center justify-center rounded-xl transition ${
            isActive("/settings")
              ? "bg-emerald-50 text-emerald-600"
              : "text-slate-500 hover:bg-slate-100 hover:text-slate-800"
          }`}
        >
          <Settings className="h-5 w-5" />
        </Link>

        <button
          type="button"
          onClick={handleLogout}
          title="Log out"
          aria-label="Log out"
          className="flex h-11 w-11 items-center justify-center rounded-xl text-slate-500 transition hover:bg-red-50 hover:text-red-500"
        >
          <LogOut className="h-5 w-5" />
        </button>
      </div>
    </aside>
  );
}