
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  BarChart3,
  ClipboardList,
  FileText,
  FolderKanban,
  Home,
  LayoutDashboard,
  LogOut,
  ReceiptText,
  Users,
  UserRound,
  X,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";

type SidebarProps = {
  mobileOpen?: boolean;
  onClose?: () => void;
};

const navigation = [
  {
    name: "Dashboard",
    href: "/admin",
    icon: LayoutDashboard,
  },
  {
    name: "Leads",
    href: "/admin/leads",
    icon: ClipboardList,
  },
  {
    name: "Customers",
    href: "/admin/customers",
    icon: Users,
  },
  {
    name: "Quotations",
    href: "/admin/quotations",
    icon: FileText,
  },
  {
    name: "Projects",
    href: "/admin/projects",
    icon: FolderKanban,
  },
  {
    name: "Follow-ups",
    href: "/admin/follow-ups",
    icon: UserRound,
  },
  {
    name: "Pipeline",
    href: "/admin/pipeline",
    icon: BarChart3,
  },
  {
    name: "Invoices",
    href: "/admin/invoices",
    icon: ReceiptText,
  },
  {
    name: "Analytics",
    href: "/admin/analytics",
    icon: BarChart3,
  },
];

export default function Sidebar({
  mobileOpen = false,
  onClose,
}: SidebarProps) {
  const pathname = usePathname();
  const [loggingOut, setLoggingOut] = useState(false);

  const handleSignOut = async () => {
    if (loggingOut) return;

    setLoggingOut(true);

    const supabase = createClient();

    const { error } = await supabase.auth.signOut();

    if (error) {
      console.error("Sidebar sign out error:", error);
      setLoggingOut(false);
      return;
    }

    window.location.href = "/admin/login";
  };

  return (
    <>
      {/* Mobile overlay */}
      {mobileOpen && (
        <button
          type="button"
          aria-label="Close admin menu"
          onClick={onClose}
          className="fixed inset-0 z-40 bg-black/40 lg:hidden"
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-72 flex-col border-r border-[#e7e2d9] bg-white transition-transform duration-300 lg:translate-x-0 ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Logo */}
        <div className="flex h-20 items-center justify-between border-b border-[#e7e2d9] px-6">
          <Link href="/admin" className="flex items-center">
            <div className="relative h-12 w-40">
              <img
                src="/images/finetex-logo.png"
                alt="FINETEX INTERIORS"
                className="h-full w-full object-contain object-left"
              />
            </div>
          </Link>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close menu"
            className="rounded-lg p-2 text-[#666] transition hover:bg-[#f5f2ec] hover:text-[#171717] lg:hidden"
          >
            <X size={20} />
          </button>
        </div>

        {/* Admin label */}
        <div className="px-6 pt-7">
          <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-[#b18a5a]">
            Management
          </p>

          <p className="mt-1 text-xs text-[#999]">
            FINETEX Admin
          </p>
        </div>

        {/* Navigation */}
        <nav className="mt-5 flex-1 space-y-1 overflow-y-auto px-4">
          {navigation.map((item) => {
            const Icon = item.icon;

            const isActive =
              item.href === "/admin"
                ? pathname === "/admin"
                : pathname.startsWith(item.href);

            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={onClose}
                className={`group flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition ${
                  isActive
                    ? "bg-[#f1eadf] text-[#171717]"
                    : "text-[#666] hover:bg-[#f7f5f0] hover:text-[#171717]"
                }`}
              >
                <Icon
                  size={18}
                  strokeWidth={isActive ? 2 : 1.7}
                  className={
                    isActive
                      ? "text-[#b18a5a]"
                      : "text-[#888] group-hover:text-[#b18a5a]"
                  }
                />

                <span>{item.name}</span>

                {isActive && (
                  <span className="ml-auto h-2 w-2 rounded-full bg-[#b18a5a]" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Bottom actions */}
        <div className="border-t border-[#e7e2d9] p-4">
          <Link
            href="/"
            className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-[#666] transition hover:bg-[#f7f5f0] hover:text-[#171717]"
          >
            <Home size={18} strokeWidth={1.7} />
            View Website
          </Link>

          <button
            type="button"
            onClick={handleSignOut}
            disabled={loggingOut}
            className="mt-1 flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-[#777] transition hover:bg-red-50 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <LogOut size={18} strokeWidth={1.7} />

            {loggingOut ? "Signing out..." : "Sign Out"}
          </button>
        </div>
      </aside>
    </>
  );
}
