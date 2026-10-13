"use client";

import Link from "next/link";
import { LayoutDashboard } from "lucide-react";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function AdminDashboardLink() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const supabase = createClient();

    const checkSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      setIsAuthenticated(!!session);
    };

    checkSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsAuthenticated(!!session);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  if (!isAuthenticated) {
    return null;
  }

  return (
    <Link
      href="/admin"
      className="inline-flex items-center gap-1.5 rounded-full border border-[#b18a5a] px-3 py-2 text-xs font-semibold text-[#b18a5a] transition hover:bg-[#b18a5a] hover:text-white"
    >
      <LayoutDashboard size={14} />
      <span>Admin Dashboard</span>
    </Link>
  );
}
