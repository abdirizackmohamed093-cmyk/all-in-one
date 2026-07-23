"use client";

import { useAuth } from "@/context/AuthContext";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase/config";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Store, Menu } from "lucide-react";
import { useAdminSidebar } from "./AdminSidebarContext";

export default function AdminTopbar() {
  const { user } = useAuth();
  const router = useRouter();
  const { toggle } = useAdminSidebar();

  const handleLogout = async () => {
    await signOut(auth);
    router.push("/login");
  };

  return (
    <header className="flex h-16 items-center justify-between border-b border-neutral-200 bg-white px-4 sm:px-6 gap-2">
      <div className="flex items-center gap-3 min-w-0">
        <button
          onClick={toggle}
          className="md:hidden shrink-0 text-charcoal/70 hover:text-burgundy transition-colors"
          aria-label="Open menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <Link
          href="/"
          target="_blank"
          className="inline-flex items-center gap-1.5 text-sm text-charcoal/70 hover:text-burgundy transition-colors whitespace-nowrap"
        >
          <Store className="w-4 h-4 shrink-0" />
          <span className="hidden sm:inline">View Store</span>
        </Link>
      </div>

      <div className="flex items-center gap-2 sm:gap-4 min-w-0">
        <span className="hidden sm:inline text-sm text-charcoal/70 truncate max-w-[160px]">
          {user?.email}
        </span>
        <button
          onClick={handleLogout}
          className="shrink-0 rounded-md border border-neutral-200 px-2.5 sm:px-3 py-1.5 text-sm text-charcoal hover:bg-neutral-100"
        >
          Log out
        </button>
      </div>
    </header>
  );
}