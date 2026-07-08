"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "@/context/CartContext";
import { X, Plus, Minus, ShoppingBag } from "lucide-react";
import Image from "next/image";

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
  const { cart, updateQuantity, removeFromCart, cartTotal, cartCount } = useCart();

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-KE", {
      style: "currency",
      currency: "KES",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.4 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
          />

          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "tween", duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="fixed right-0 top-0 z-50 h-full w-full max-w-md bg-white shadow-2xl flex flex-col border-l border-border"
          >
            <div className="p-6 border-b border-border flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-foreground" />
                <h2 className="font-serif text-xl font-semibold text-foreground tracking-wide">
                  Your Cart ({cartCount})
                </h2>
              </div>
              <button 
                onClick={onClose}
                className="p-2 hover:bg-muted rounded-full transition-colors duration-200"
                aria-label="Close cart"
              >
                <X className="w-5 h-5 text-muted-foreground hover:text-foreground" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {cart.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
                  <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center text-muted-foreground">
                    <ShoppingBag className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-foreground font-medium text-lg">Your cart is empty</p>
                    <p className="text-muted-foreground text-sm max-w-xs mt-1">
                      Explore our premium collections to find everything you need.
                    </p>
                  </div>
                  <button
                    onClick={onClose}
                    className="mt-2 text-sm text-accent font-medium hover:underline tracking-wider uppercase transition-all"
                  >
                    Continue Shopping
                  </button>
                </div>
              ) : (
                cart.map((item) => (
                  <div key={item.id} className="flex gap-4 pb-6 border-b border-muted last:border-0 last:pb-0">
                    {/* Upgraded Container-Bound Next.js Image Component */}
                    <div className="relative w-20 h-24 bg-muted overflow-hidden rounded border border-border flex-shrink-0">
                      <Image
                        src={item.imageUrl || "/placeholder-product.jpg"}
                        alt={item.name}
                        fill
                        className="object-cover"
                        sizes="80px"
                      />
                    </div>

                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex justify-between items-start gap-2">
                          <h3 className="font-sans text-sm font-medium text-foreground line-clamp-2">
                            {item.name}
                          </h3>
                          <button
                            onClick={() => removeFromCart(item.id)}
                            className="text-xs text-muted-foreground hover:text-destructive transition-colors duration-150 pt-0.5"
                          >
                            Remove
                          </button>
                        </div>
                        {(item.selectedColor || item.selectedSize) && (
                          <p className="text-xs text-muted-foreground mt-1">
                            {item.selectedColor && `Color: ${item.selectedColor}`}
                            {item.selectedColor && item.selectedSize && " | "}
                            {item.selectedSize && `Size: ${item.selectedSize}`}
                          </p>
                        )}
                      </div>

                      <div className="flex justify-between items-center mt-2">
                        <div className="flex items-center border border-border rounded bg-muted/50">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="p-1 px-2 text-muted-foreground hover:text-foreground transition-colors"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="text-xs font-medium w-8 text-center text-foreground">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="p-1 px-2 text-muted-foreground hover:text-foreground transition-colors"
                            disabled={item.quantity >= item.stockCount}
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>

                        <span className="text-sm font-semibold text-foreground">
                          {formatCurrency(item.price * item.quantity)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {cart.length > 0 && (
              <div className="p-6 border-t border-border bg-card">
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground uppercase tracking-wider font-medium">
                      Subtotal
                    </span>
                    <span className="text-xl font-serif font-bold text-foreground">
                      {formatCurrency(cartTotal)}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Shipping fees and taxes are calculated during the secure checkout pipeline.
                  </p>

                  <button className="w-full py-4 bg-primary text-primary-foreground font-sans tracking-widest text-xs uppercase font-semibold rounded shadow-md hover:bg-primary/95 transition-all duration-300 transform hover:-translate-y-[1px] active:translate-y-0">
                    Proceed to Checkout
                  </button>
                  
                  <button
                    onClick={onClose}
                    className="w-full text-center text-xs font-semibold tracking-wider text-muted-foreground hover:text-foreground uppercase transition-colors duration-200 py-1"
                  >
                    Or Continue Shopping
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}