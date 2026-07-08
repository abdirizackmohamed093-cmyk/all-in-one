"use client";

import React, { useState } from "react";
import { useCart } from "@/context/CartContext";
import CartDrawer from "../cart/CartDrawer";
import { ShoppingBag, Search, Menu, User } from "lucide-react";

export default function Header() {
  const { cartCount } = useCart();
  const [isCartOpen, setIsCartOpen] = useState(false);

  return (
    <>
      <header className="w-full fixed top-0 left-0 z-40 bg-white border-b border-border">
        
        <div className="w-full bg-primary text-white py-2 px-4 text-center text-[10px] tracking-[0.2em] uppercase font-semibold">
          Complimentary Express Delivery in Kenya For Orders Over KES 10,000
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          
          <div className="flex items-center gap-4">
            <button className="p-2 -ml-2 lg:hidden text-foreground hover:text-accent transition-colors">
              <Menu className="w-5 h-5" />
            </button>
            <button className="p-2 text-foreground hover:text-accent transition-colors hidden sm:block">
              <Search className="w-5 h-5" />
            </button>
          </div>

          <div className="text-center flex flex-col items-center">
            <a href="/" className="font-serif text-2xl font-bold tracking-[0.15em] text-foreground hover:opacity-90 transition-opacity">
              ALL IN ONE
            </a>
            <span className="text-[9px] tracking-[0.3em] text-accent uppercase font-medium mt-0.5">
              Everything You Need
            </span>
          </div>

          <div className="flex items-center gap-2 sm:gap-4">
            <button className="p-2 text-foreground hover:text-accent transition-colors">
              <User className="w-5 h-5" />
            </button>
            
            <button
              onClick={() => setIsCartOpen(true)}
              className="p-2 relative flex items-center justify-center text-foreground hover:text-accent transition-all group"
              aria-label="Open luxury shopping cart"
            >
              <ShoppingBag className="w-5 h-5 transition-transform duration-300 group-hover:scale-105" />
              
              {cartCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-accent text-white text-[9px] font-sans font-bold w-4 h-4 rounded-full flex items-center justify-center shadow-sm">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
      
      <div className="h-[116px]" />
    </>
  );
}