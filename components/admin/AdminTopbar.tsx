"use client";

import { useAuth } from "@/context/AuthContext";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase/config";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Store } from "lucide-react";

export default function AdminTopbar() {
  const { user } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await signOut(auth);
    router.push("/login");
  };

  return (
    <header className="flex h-16 items-center justify-between border-b border-neutral-200 bg-white px-6">
      <Link
        href="/"
        target="_blank"
        className="inline-flex items-center gap-1.5 text-sm text-charcoal/70 hover:text-burgundy transition-colors"
      >
        <Store className="w-4 h-4" />
        View Store
      </Link>
      <div className="flex items-center gap-4">
        <span className="text-sm text-charcoal/70">{user?.email}</span>
        <button
          onClick={handleLogout}
          className="rounded-md border border-neutral-200 px-3 py-1.5 text-sm text-charcoal hover:bg-neutral-100"
        >
          Log out
        </button>
      </div>
    </header>
  );
}