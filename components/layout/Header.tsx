"use client";
import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import { fetchCategories, Category } from "@/lib/firebase/categories";
import {
  ShoppingBag,
  User,
  LogOut,
  Search,
  Menu,
  ChevronDown,
  Package,
  LayoutDashboard,
  HelpCircle,
  MessageCircle,
} from "lucide-react";

export default function Header() {
  const { user, isAdmin, logout } = useAuth();
  const { cartCount } = useCart();
  const router = useRouter();

  const [searchQuery, setSearchQuery] = useState("");
  const [categories, setCategories] = useState<Category[]>([]);
  const [categoriesOpen, setCategoriesOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const [helpOpen, setHelpOpen] = useState(false);
  const helpDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchCategories().then(setCategories);
  }, []);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setCategoriesOpen(false);
      }
      if (helpDropdownRef.current && !helpDropdownRef.current.contains(e.target as Node)) {
        setHelpOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push("/search?q=" + encodeURIComponent(searchQuery.trim()));
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-white shadow-sm">
      {/* Main row: logo, search, account, cart */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center gap-6">
        <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity shrink-0">
          <img src="/logo.png" alt="All In One" className="h-10 w-auto" />
        </Link>

        <form onSubmit={handleSearch} className="flex-1 max-w-2xl">
          <div className="flex items-stretch border-2 border-primary rounded-md overflow-hidden">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="I'm looking for..."
              className="flex-1 px-4 py-2 text-sm focus:outline-none"
            />
            <button
              type="submit"
              className="bg-primary text-primary-foreground px-5 flex items-center justify-center hover:bg-cta-hover transition-colors"
            >
              <Search className="w-4 h-4" />
            </button>
          </div>
        </form>

        <div className="flex items-center gap-5 shrink-0">
          {user ? (
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5 text-xs text-neutral-600 font-sans font-medium">
                <User className="w-3.5 h-3.5 text-neutral-400" />
                <span className="hidden sm:inline max-w-[120px] truncate">
                  {user.email}
                </span>
              </div>
              {isAdmin && (
                <Link
                  href="/admin"
                  target="_blank"
                  className="inline-flex items-center gap-1 text-[10px] tracking-wider uppercase font-bold text-neutral-400 hover:text-primary transition-colors"
                  title="Admin Dashboard"
                >
                  <LayoutDashboard className="w-3.5 h-3.5" />
                  <span className="hidden md:inline">Admin</span>
                </Link>
              )}
              <Link
                href="/account/orders"
                className="inline-flex items-center gap-1 text-[10px] tracking-wider uppercase font-bold text-neutral-400 hover:text-primary transition-colors"
                title="My Orders"
              >
                <Package className="w-3.5 h-3.5" />
                <span className="hidden md:inline">Orders</span>
              </Link>
              <button
                onClick={() => logout()}
                className="inline-flex items-center gap-1 text-[10px] tracking-wider uppercase font-bold text-neutral-400 hover:text-primary transition-colors"
                title="Secure Session Exit"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden md:inline">Exit</span>
              </button>
            </div>
          ) : (
            <Link
              href="/login"
              className="inline-flex items-center gap-1.5 text-xs font-sans font-bold tracking-widest uppercase text-neutral-700 hover:text-primary transition-colors"
            >
              <User className="w-3.5 h-3.5" />
              Sign In
            </Link>
          )}

          <div ref={helpDropdownRef} className="relative">
            <button
              onClick={() => setHelpOpen(!helpOpen)}
              className="inline-flex items-center gap-1.5 text-xs font-sans font-bold tracking-widest uppercase text-neutral-700 hover:text-primary transition-colors"
            >
              <HelpCircle className="w-4 h-4" />
              <span className="hidden sm:inline">Help</span>
              <ChevronDown className={`w-3.5 h-3.5 transition-transform ${helpOpen ? "rotate-180" : ""}`} />
            </button>

            {helpOpen && (
              <div className="absolute top-full right-0 mt-2 w-64 bg-white shadow-xl rounded-lg border border-neutral-200 py-2 z-50 overflow-hidden">
                <Link
                  href="/account/orders"
                  onClick={() => setHelpOpen(false)}
                  className="block px-5 py-3 text-sm font-medium text-neutral-700 hover:bg-neutral-50 hover:text-primary transition-colors border-b border-neutral-50"
                >
                  Track My Order
                </Link>
                <Link
                  href="/help/payments"
                  onClick={() => setHelpOpen(false)}
                  className="block px-5 py-3 text-sm font-medium text-neutral-700 hover:bg-neutral-50 hover:text-primary transition-colors border-b border-neutral-50"
                >
                  How Payments Work
                </Link>
                <Link
                  href="/help/faq"
                  onClick={() => setHelpOpen(false)}
                  className="block px-5 py-3 text-sm font-medium text-neutral-700 hover:bg-neutral-50 hover:text-primary transition-colors border-b border-neutral-50"
                >
                  Help &amp; FAQ
                </Link>
                
                 <a href="https://wa.me/254732477111" target="_blank" rel="noopener noreferrer" onClick={() => setHelpOpen(false)} className="flex items-center gap-2 px-5 py-3 text-sm font-semibold text-emerald-600 hover:bg-emerald-50 transition-colors">
                  <MessageCircle className="w-4 h-4" />
                  WhatsApp Us
                </a>
              </div>
            )}
          </div>

          <Link href="/cart" className="relative p-2 text-neutral-700 hover:text-primary transition-colors">
            <ShoppingBag className="w-5 h-5" />
            {cartCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 bg-primary text-primary-foreground font-sans text-[9px] font-bold h-4 w-4 rounded-full flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </Link>
        </div>
      </div>

      {/* Category strip */}
      <div className="bg-primary shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center gap-8 relative">
          <div ref={dropdownRef} className="relative shrink-0">
            <button
              onClick={() => setCategoriesOpen(!categoriesOpen)}
              className="flex items-center gap-2.5 text-white text-sm font-bold uppercase tracking-wide hover:opacity-90 transition-opacity bg-black/10 px-4 py-2 rounded-md"
            >
              <Menu className="w-4 h-4" />
              All Categories
              <ChevronDown className={`w-4 h-4 transition-transform ${categoriesOpen ? "rotate-180" : ""}`} />
            </button>

            {categoriesOpen && (
              <div className="absolute top-full left-0 mt-2 w-72 bg-white shadow-xl rounded-lg border border-neutral-200 py-2 z-50 overflow-hidden">
                {categories.length === 0 ? (
                  <p className="px-5 py-3 text-sm text-neutral-400">No categories yet.</p>
                ) : (
                  categories.map((c) => (
                    <Link
                      key={c.id}
                      href={"/shop/" + c.slug}
                      onClick={() => setCategoriesOpen(false)}
                      className="block px-5 py-3 text-sm font-medium text-neutral-700 hover:bg-neutral-50 hover:text-primary transition-colors border-b border-neutral-50 last:border-b-0"
                    >
                      {c.name}
                    </Link>
                  ))
                )}
              </div>
            )}
          </div>

          <div className="hidden md:block w-px h-6 bg-white/20 shrink-0" />

          <nav className="hidden md:flex items-center gap-8 overflow-x-auto">
            {categories.slice(0, 6).map((c) => (
              <Link
                key={c.id}
                href={"/shop/" + c.slug}
                className="text-white text-sm font-semibold uppercase tracking-wide hover:text-white/80 transition-colors whitespace-nowrap relative group"
              >
                {c.name}
                <span className="absolute -bottom-4 left-0 w-0 h-0.5 bg-white group-hover:w-full transition-all duration-200" />
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </header>
  );
}