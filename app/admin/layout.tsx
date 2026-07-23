"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminTopbar from "@/components/admin/AdminTopbar";
import { AdminSidebarProvider } from "@/components/admin/AdminSidebarContext";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, isAdmin, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && (!user || !isAdmin)) {
      router.replace("/login");
    }
  }, [user, isAdmin, loading, router]);

  // Prevents a flash of admin content before the redirect fires
  if (loading || !user || !isAdmin) {
    return (
      <div className="flex h-screen items-center justify-center bg-white">
        <div className="animate-pulse text-charcoal">Loading...</div>
      </div>
    );
  }

  return (
    <AdminSidebarProvider>
      <div className="flex h-screen bg-neutral-50">
        <AdminSidebar />
        <div className="flex flex-1 flex-col overflow-hidden min-w-0">
          <AdminTopbar />
          <main className="flex-1 overflow-y-auto p-4 sm:p-6">{children}</main>
        </div>
      </div>
    </AdminSidebarProvider>
  );
}