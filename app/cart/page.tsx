"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { Trash2, Minus, Plus } from "lucide-react";
import { fetchFlashSaleProducts } from "@/lib/firebase/products";
import { Product } from "@/components/products/ProductCard";
import FlashSaleBanner from "@/components/cart/FlashSaleBanner";

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("en-KE", {
    style: "currency",
    currency: "KES",
  }).format(amount);
}

export default function CartPage() {
  const { cart, removeFromCart, updateQuantity, cartTotal, clearCart } = useCart();
  const [flashDeals, setFlashDeals] = useState<Product[]>([]);

  useEffect(() => {
    fetchFlashSaleProducts().then(setFlashDeals);
  }, []);

  if (cart.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20">
        {flashDeals.length > 0 && <FlashSaleBanner products={flashDeals} />}
        <div className="text-center">
          <h1 className="font-serif text-2xl font-bold text-neutral-900 mb-4">
            Your Cart
          </h1>
          <p className="text-neutral-500 text-sm mb-6">
            Your cart is currently empty.
          </p>
          <Link
            href="/"
            className="inline-block text-xs font-bold uppercase tracking-widest border-b border-neutral-900 pb-1"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-16">
      <h1 className="font-serif text-2xl font-bold text-neutral-900 mb-8">
        Your Cart
      </h1>

      {flashDeals.length > 0 && <FlashSaleBanner products={flashDeals} />}

      <div className="border border-neutral-200 rounded-md divide-y divide-neutral-100">
        {cart.map(function (item) {
          return (
            <div key={item.id} className="flex items-center gap-4 p-4">
              <img
                src={item.imageUrl}
                alt={item.name}
                className="w-16 h-16 object-cover rounded bg-neutral-100"
              />

              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-neutral-900 truncate">
                  {item.name}
                </p>
                <p className="text-xs text-neutral-500 mt-1">
                  {formatCurrency(item.price)}
                </p>
              </div>

              <div className="flex items-center gap-2 border border-neutral-200 rounded px-2 py-1">
                <button
                  onClick={function () {
                    updateQuantity(item.id, item.quantity - 1);
                  }}
                  className="p-1 text-neutral-500 hover:text-neutral-900"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="text-sm w-6 text-center">{item.quantity}</span>
                <button
                  onClick={function () {
                    updateQuantity(item.id, item.quantity + 1);
                  }}
                  disabled={item.quantity >= item.stockCount}
                  className="p-1 text-neutral-500 hover:text-neutral-900 disabled:opacity-30"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>

              <p className="text-sm font-medium text-neutral-900 w-24 text-right">
                {formatCurrency(item.price * item.quantity)}
              </p>

              <button
                onClick={function () {
                  removeFromCart(item.id);
                }}
                className="p-2 text-neutral-400 hover:text-red-600 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          );
        })}
      </div>

      <div className="flex items-center justify-between mt-8">
        <button
          onClick={clearCart}
          className="text-xs uppercase tracking-widest text-neutral-400 hover:text-neutral-900 transition-colors"
        >
          Clear Cart
        </button>

        <div className="text-right">
          <p className="text-xs uppercase tracking-widest text-neutral-500 mb-1">
            Total
          </p>
          <p className="font-serif text-2xl font-bold text-neutral-900">
            {formatCurrency(cartTotal)}
          </p>
        </div>
      </div>

      <div className="mt-8 flex justify-end">
        <Link href="/checkout" className="px-8 py-3.5 bg-neutral-900 text-white hover:bg-neutral-800 text-xs font-bold tracking-widest uppercase rounded transition-all inline-block text-center">Proceed to Checkout</Link>
      </div>
    </div>
  );
}