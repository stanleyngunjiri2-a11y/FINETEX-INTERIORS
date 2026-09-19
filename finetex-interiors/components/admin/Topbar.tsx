"use client";

import { Menu, Search, Bell } from "lucide-react";

type TopbarProps = {
  onMenuClick?: () => void;
};

export default function Topbar({ onMenuClick }: TopbarProps) {
  return (
    <header className="sticky top-0 z-30 flex h-20 items-center justify-between border-b border-[#e7e2d9] bg-white/95 px-5 backdrop-blur-sm sm:px-8">
      {/* Mobile menu */}
      <button
        type="button"
        onClick={onMenuClick}
        aria-label="Open admin menu"
        className="rounded-xl p-2 text-[#555] transition hover:bg-[#f7f5f0] lg:hidden"
      >
        <Menu size={22} />
      </button>

      {/* Search */}
      <div className="hidden max-w-md flex-1 lg:flex">
        <div className="relative w-full">
          <Search
            size={18}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-[#999]"
          />

          <input
            type="search"
            placeholder="Search leads, customers, projects..."
            className="w-full rounded-xl border border-[#e2ddd4] bg-[#faf9f6] py-3 pl-11 pr-4 text-sm outline-none transition placeholder:text-[#aaa] focus:border-[#b18a5a] focus:bg-white"
          />
        </div>
      </div>

      {/* Right side */}
      <div className="ml-auto flex items-center gap-3">
        {/* Notifications */}
        <button
          type="button"
          aria-label="Notifications"
          className="relative rounded-xl p-2.5 text-[#666] transition hover:bg-[#f7f5f0] hover:text-[#171717]"
        >
          <Bell size={19} strokeWidth={1.7} />

          <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-[#b18a5a]" />
        </button>

        {/* Divider */}
        <div className="hidden h-8 w-px bg-[#e7e2d9] sm:block" />

        {/* Admin user */}
        <div className="flex items-center gap-3">
          <div className="hidden text-right sm:block">
            <p className="text-sm font-semibold text-[#171717]">
              FINETEX Admin
            </p>

            <p className="text-xs text-[#999]">
              Administrator
            </p>
          </div>

          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#171717] text-sm font-semibold text-white">
            F
          </div>
        </div>
      </div>
    </header>
  );
}
