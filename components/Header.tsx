"use client";

import React from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { logoutUser } from "@/services/authService";

export default function Header() {
  const { user } = useAuth();

  return (
    <header className="sticky top-0 z-50 w-full bg-background/80 backdrop-blur-md border-b border-border transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Brand Logo Alignment */}
        <Link href="/" className="flex flex-col select-none group">
          <span className="text-xl font-bold tracking-[0.25em] text-foreground group-hover:text-primary transition-colors">
            ALL IN ONE
          </span>
          <span className="text-[9px] uppercase tracking-[0.15em] text-accent font-medium mt-0.5">
            Everything You Need
          </span>
        </Link>

        {/* Global Desktop Navigation Links */}
        <nav className="hidden md:flex items-center space-x-8 text-xs font-medium uppercase tracking-wider text-foreground/80">
          <Link href="/shop" className="hover:text-primary transition-colors">Shop All</Link>
          <Link href="/categories" className="hover:text-primary transition-colors">Categories</Link>
          <Link href="/brands" className="hover:text-primary transition-colors">Brands</Link>
          <Link href="/new-arrivals" className="hover:text-primary transition-colors text-primary font-semibold">New Arrivals</Link>
        </nav>

        {/* Action Utility Triggers */}
        <div className="flex items-center space-x-6 text-xs uppercase font-medium tracking-wider">
          <Link href="/search" className="text-foreground/80 hover:text-primary transition-colors hidden sm:block">
            Search
          </Link>

          {user ? (
            <div className="flex items-center space-x-4">
              <Link href="/account" className="text-foreground hover:text-primary transition-colors">
                Hi, {user.displayName?.split(" ")[0] || "Account"}
              </Link>
              <button 
                onClick={() => logoutUser()} 
                className="text-foreground/60 hover:text-primary transition-colors normal-case font-light text-[11px]"
              >
                Sign Out
              </button>
            </div>
          ) : (
            <Link href="/auth" className="text-foreground hover:text-primary transition-colors">
              Sign In
            </Link>
          )}

          <Link href="/cart" className="relative p-1 text-foreground hover:text-primary transition-colors">
            Cart (0)
          </Link>
        </div>
      </div>
    </header>
  );
}