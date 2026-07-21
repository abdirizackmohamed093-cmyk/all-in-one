"use client";

import React from "react";
import Link from "next/link";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full bg-secondary border-t border-border text-charcoal">
      {/* Upper Brand Alignment & Columns Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12">
        
        {/* Column 1: Core Brand Identity Statement */}
        <div className="lg:col-span-2 space-y-5">
          <Link href="/" className="flex flex-col select-none">
            <span className="text-lg font-bold tracking-[0.25em] text-foreground">
              ALL IN ONE.KE
            </span>
            <span className="text-[9px] uppercase tracking-[0.15em] text-accent font-medium mt-0.5">
              Everything You Need, All in One Place.
            </span>
          </Link>
          <p className="text-xs text-foreground/70 font-light leading-relaxed max-w-sm">
            Kenya's ultimate premier modern shopping platform. Delivering uncompromised digital curation, authentic global brands, and pristine service standard mechanics directly to your doorstep.
          </p>
        </div>

        {/* Column 2: Department Navigations */}
        <div className="space-y-4">
          <h4 className="text-xs uppercase font-semibold tracking-wider text-foreground">Departments</h4>
          <ul className="space-y-2 text-xs font-light text-foreground/80">
            <li><Link href="/categories/apparel" className="hover:text-primary transition-colors">Designer Apparel</Link></li>
            <li><Link href="/categories/footwear" className="hover:text-primary transition-colors">Premium Footwear</Link></li>
            <li><Link href="/categories/accessories" className="hover:text-primary transition-colors">Luxury Accessories</Link></li>
            <li><Link href="/categories/tech" className="hover:text-primary transition-colors">Elite Electronics</Link></li>
          </ul>
        </div>

        {/* Column 3: Corporate Trust & Operations */}
        <div className="space-y-4">
          <h4 className="text-xs uppercase font-semibold tracking-wider text-foreground">Customer Service</h4>
          <ul className="space-y-2 text-xs font-light text-foreground/80">
            <li><Link href="/shipping" className="hover:text-primary transition-colors">Shipping & Deliveries</Link></li>
            <li><Link href="/returns" className="hover:text-primary transition-colors">Returns & Exchanges</Link></li>
            <li><Link href="/faq" className="hover:text-primary transition-colors">Frequently Asked Questions</Link></li>
            <li><Link href="/contact" className="hover:text-primary transition-colors">Contact Corporate Concierge</Link></li>
          </ul>
        </div>

        {/* Column 4: Operational Legal Frameworks */}
        <div className="space-y-4">
          <h4 className="text-xs uppercase font-semibold tracking-wider text-foreground">Legal Concierge</h4>
          <ul className="space-y-2 text-xs font-light text-foreground/80">
            <li><Link href="/privacy" className="hover:text-primary transition-colors">Privacy Charter</Link></li>
            <li><Link href="/terms" className="hover:text-primary transition-colors">Terms of Service</Link></li>
            <li><Link href="/authenticity" className="hover:text-primary transition-colors">Authenticity Guarantee</Link></li>
          </ul>
        </div>
      </div>

      {/* Lower Decorative Meta Baseline Partition */}
      <div className="w-full border-t border-border bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] font-light text-foreground/50">
          <p>&copy; {currentYear} ALL IN ONE Retailers East Africa. Scaled to production-grade standards.</p>
          <p className="tracking-wide">Nairobi, Kenya</p>
        </div>
      </div>
    </footer>
  );
}