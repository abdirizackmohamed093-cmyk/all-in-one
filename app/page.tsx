"use client";

import React from "react";
import Link from "next/link";

export default function HomePage() {
  // Static design arrays mapping premium Kenyan lifestyle niches
  const featuredCategories = [
    { id: "apparel", name: "Designer Apparel", count: "120+ Items", image: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=600&auto=format&fit=crop" },
    { id: "footwear", name: "Premium Footwear", count: "85+ Items", image: "https://images.unsplash.com/photo-1549298916-b41d501d3772?q=80&w=600&auto=format&fit=crop" },
    { id: "accessories", name: "Luxury Accessories", count: "40+ Items", image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?q=80&w=600&auto=format&fit=crop" },
    { id: "tech", name: "Elite Electronics", count: "60+ Items", image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=600&auto=format&fit=crop" },
  ];

  const premiumProducts = [
    { id: "1", name: "The Heritage Burgundy Blazer", brand: "Amani Tailored", price: "KSh 18,500", image: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=500&auto=format&fit=crop" },
    { id: "2", name: "Minimalist Gold Chronograph", brand: "Ora Studio", price: "KSh 24,000", image: "https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3?q=80&w=500&auto=format&fit=crop", badge: "Best Seller" },
    { id: "3", name: "Classic Pebble Leather Tote", brand: "Safari Luxe", price: "KSh 14,500", image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?q=80&w=500&auto=format&fit=crop" },
    { id: "4", name: "Wireless Noise-Cancelling Pods", brand: "Vibe Tech", price: "KSh 29,999", image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=500&auto=format&fit=crop", badge: "New Arrival" },
  ];

  return (
    <div className="space-y-20 pb-24">
      {/* SECTION 1: HERO ACTION BANNER */}
      <section className="relative h-[calc(100vh-7rem)] bg-[#1A1F22] flex items-center overflow-hidden">
        {/* Background Visual Layer */}
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-40 mix-blend-luminosity scale-105 transition-transform duration-1000"
          style={{ backgroundImage: `url('https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=1600&auto=format&fit=crop')` }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/80 to-transparent" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full z-10 grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-7 space-y-6">
            <span className="text-xs uppercase font-semibold tracking-[0.3em] text-accent block">
              Curated Commercial Excellence
            </span>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-light tracking-tight text-foreground leading-none">
              Define Your Standard. <br />
              <span className="font-serif italic text-primary">Elevate Everyday.</span>
            </h1>
            <p className="text-foreground/70 font-light text-sm sm:text-base max-w-lg leading-relaxed">
              Explore Kenya’s most refined catalog. From high-fashion tailoring to masterfully designed elite gear, experience everything you need, all in one place.
            </p>
            <div className="pt-4 flex flex-wrap gap-4">
              <Link 
                href="/shop" 
                className="bg-primary text-white text-xs uppercase font-medium tracking-widest px-8 py-4 rounded shadow-lg hover:bg-primary/9ative transition-all"
              >
                Explore Collections
              </Link>
              <Link 
                href="/categories" 
                className="border border-input text-foreground hover:bg-secondary text-xs uppercase font-medium tracking-widest px-8 py-4 rounded transition-all"
              >
                Browse Categories
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 2: FEATURED DESIGNER CATEGORIES */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-border pb-4">
          <div>
            <span className="text-xs font-semibold uppercase tracking-widest text-accent">Curated Selections</span>
            <h2 className="text-2xl font-light tracking-tight text-foreground mt-1">Shop by Department</h2>
          </div>
          <Link href="/categories" className="text-xs font-medium uppercase tracking-wider text-primary underline underline-offset-4 mt-2 md:mt-0">
            View All Vaults
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredCategories.map((category) => (
            <Link 
              key={category.id} 
              href={`/categories/${category.id}`}
              className="group relative h-72 bg-secondary overflow-hidden rounded border border-border flex items-end p-6"
            >
              <div 
                className="absolute inset-0 bg-cover bg-center group-hover:scale-105 transition-transform duration-700 ease-out"
                style={{ backgroundImage: `url('${category.image}')` }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent transition-opacity opacity-80 group-hover:opacity-90" />
              
              <div className="z-10 w-full text-white">
                <span className="text-[10px] uppercase tracking-widest text-accent font-medium block mb-1">{category.count}</span>
                <h3 className="text-lg font-light tracking-wide">{category.name}</h3>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* SECTION 3: FEATURED CURATED PRODUCT CARDS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-border pb-4">
          <div>
            <span className="text-xs font-semibold uppercase tracking-widest text-accent">Exclusive Assortment</span>
            <h2 className="text-2xl font-light tracking-tight text-foreground mt-1">Featured Masterpieces</h2>
          </div>
          <Link href="/shop" className="text-xs font-medium uppercase tracking-wider text-primary underline underline-offset-4 mt-2 md:mt-0">
            Browse Full Shop
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {premiumProducts.map((product) => (
            <div key={product.id} className="group relative flex flex-col space-y-3">
              {/* Image Box Frame */}
              <div className="relative aspect-[3/4] bg-secondary rounded overflow-hidden border border-border">
                <div 
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-700 ease-out group-hover:scale-102"
                  style={{ backgroundImage: `url('${product.image}')` }}
                />
                
                {product.badge && (
                  <span className="absolute top-3 left-3 bg-primary text-white text-[9px] uppercase font-semibold tracking-wider px-2.5 py-1 rounded-sm shadow-sm">
                    {product.badge}
                  </span>
                )}

                {/* Quick Add overlay wrapper */}
                <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                  <button className="w-full bg-background text-foreground hover:bg-primary hover:text-white transition-colors text-xs font-medium uppercase tracking-wider py-3 shadow-md rounded">
                    Quick View
                  </button>
                </div>
              </div>

              {/* Text Meta Details */}
              <div className="flex flex-col space-y-1">
                <span className="text-[11px] uppercase tracking-widest text-foreground/40 font-medium">{product.brand}</span>
                <h3 className="text-sm font-light text-foreground group-hover:text-primary transition-colors line-clamp-1">{product.name}</h3>
                <span className="text-sm font-medium text-foreground/90 pt-0.5">{product.price}</span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}