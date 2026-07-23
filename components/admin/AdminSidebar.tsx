"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useAdminSidebar } from "./AdminSidebarContext";
import {
  LayoutDashboard,
  Package,
  FolderTree,
  Tag,
  ClipboardList,
  Users,
  Ticket,
  BarChart3,
  Settings,
  Gift,
  Image,
  Rows3,
  LayoutGrid,
  Megaphone,
  Sparkles,
  X,
} from "lucide-react";

const navItems = [
  { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { label: "AI Assistant", href: "/admin/ai-assistant", icon: Sparkles },
  { label: "Products", href: "/admin/products", icon: Package },
  { label: "Categories", href: "/admin/categories", icon: FolderTree },
  { label: "Brands", href: "/admin/brands", icon: Tag },
  { label: "Special Packages", href: "/admin/packages", icon: Gift },
  { label: "Hero Slides", href: "/admin/hero-slides", icon: Image },
  { label: "Product Rows", href: "/admin/product-rows", icon: Rows3 },
  { label: "Category Tiles", href: "/admin/category-tiles", icon: LayoutGrid },
  { label: "Side Promos", href: "/admin/side-promos", icon: Megaphone },
  { label: "Orders", href: "/admin/orders", icon: ClipboardList },
  { label: "Customers", href: "/admin/customers", icon: Users },
  { label: "Coupons", href: "/admin/coupons", icon: Ticket },
  { label: "Reports", href: "/admin/reports", icon: BarChart3 },
  { label: "Settings", href: "/admin/settings", icon: Settings },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const { isOpen, close } = useAdminSidebar();

  return (
    <>
      {/* Mobile backdrop — click to close */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 md:hidden"
          onClick={close}
          aria-hidden="true"
        />
      )}

      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-64 shrink-0 bg-[#14171A] flex flex-col",
          "transform transition-transform duration-200 ease-in-out",
          "md:static md:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex h-16 items-center justify-between border-b border-white/10 px-6">
          <span className="font-semibold text-white tracking-wide">ALL IN ONE</span>
          <button
            onClick={close}
            className="md:hidden text-white/60 hover:text-white transition-colors"
            aria-label="Close menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <nav className="flex flex-col gap-1 p-4 overflow-y-auto">
          {navItems.map((item) => {
            const active = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={close}
                className={cn(
                  "flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-colors",
                  active
                    ? "bg-burgundy text-white"
                    : "text-white/60 hover:bg-white/5 hover:text-white"
                )}
              >
                <Icon className="w-4 h-4 shrink-0" />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </aside>
    </>
  );
}