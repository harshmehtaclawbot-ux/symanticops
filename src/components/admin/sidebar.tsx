"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Building2,
  Mail,
  Users,
  BarChart3,
  Settings,
  LogOut,
} from "lucide-react";
import { signOut } from "next-auth/react";

const navItems = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/admin/customers", label: "Customers", icon: Building2 },
  { href: "/admin/campaigns", label: "Campaigns", icon: Mail },
  { href: "/admin/users", label: "Users", icon: Users },
  { href: "/admin/analytics", label: "Analytics", icon: BarChart3 },
];

export function AdminSidebar() {
  const pathname = usePathname();

  function isActive(href: string, exact?: boolean) {
    return exact ? pathname === href : pathname.startsWith(href);
  }

  return (
    <aside className="w-[260px] min-h-screen bg-white/80 backdrop-blur-xl border-r border-[#d2d2d7]/50 flex flex-col">
      <div className="px-6 py-5 border-b border-[#d2d2d7]/50">
        <Link href="/admin" className="flex items-center gap-2.5">
          <span className="text-[17px] font-semibold tracking-tight text-[#1d1d1f]">SymanticOps</span>
          <span className="text-[10px] font-semibold text-[#0071e3] bg-[#0071e3]/8 px-2 py-0.5 rounded-full uppercase tracking-wide">Admin</span>
        </Link>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-0.5">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex items-center gap-3 px-3 py-2 rounded-lg text-[13px] font-medium transition-all",
              isActive(item.href, item.exact)
                ? "bg-[#0071e3] text-white shadow-sm"
                : "text-[#424245] hover:bg-[#f5f5f7]"
            )}
          >
            <item.icon className="w-[18px] h-[18px]" strokeWidth={1.8} />
            {item.label}
          </Link>
        ))}
      </nav>

      <div className="px-3 py-4 border-t border-[#d2d2d7]/50 space-y-0.5">
        <Link
          href="/admin/settings"
          className="flex items-center gap-3 px-3 py-2 rounded-lg text-[13px] font-medium text-[#424245] hover:bg-[#f5f5f7] transition-all"
        >
          <Settings className="w-[18px] h-[18px]" strokeWidth={1.8} />
          Settings
        </Link>
        <button
          onClick={() => signOut({ callbackUrl: "/login" })}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-[13px] font-medium text-[#424245] hover:bg-red-50 hover:text-red-600 transition-all"
        >
          <LogOut className="w-[18px] h-[18px]" strokeWidth={1.8} />
          Sign Out
        </button>
      </div>
    </aside>
  );
}
