"use client";

import React, { useState } from "react";
import { useCart } from "@/context/CartContext";
import { ShoppingBag, Check } from "lucide-react";
import Link from "next/link";

export interface Product {
  id: string;
  name: string;
  price: number;
  imageUrl: string;
  category: string;
  brand?: string;
  stockCount: number;
  isFlashSale?: boolean;
  flashSalePrice?: number;
  flashSaleEndsAt?: any; // Firestore Timestamp
}

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart();
  const [isAdded, setIsAdded] = useState(false);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-KE", {
      style: "currency",
      currency: "KES",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const handleAddClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    addToCart({
      id: product.id,
      name: product.name,
      price: product.isFlashSale && product.flashSalePrice ? product.flashSalePrice : product.price,
      imageUrl: product.imageUrl,
      stockCount: product.stockCount,
    }, 1);

    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  const showFlashPrice = product.isFlashSale && product.flashSalePrice;
  const discountPercent =
    showFlashPrice && product.price > 0
      ? Math.round(((product.price - product.flashSalePrice!) / product.price) * 100)
      : 0;

  return (
    <div className="group relative flex flex-col bg-white overflow-hidden transition-all duration-300 w-full">

      {/* Clickable Image Container */}
      <Link href={`/products/${product.id}`} className="relative w-full aspect-square bg-neutral-100 overflow-hidden rounded-lg border border-neutral-200 block">
        <img
          src={product.imageUrl || "/placeholder-product.jpg"}
          alt={product.name}
          className="absolute inset-0 w-full h-full object-cover object-center transition-transform duration-500 ease-out group-hover:scale-105"
        />

        {showFlashPrice && (
          <span className="absolute top-2 right-2 bg-red-600 text-white text-[10px] font-sans tracking-wider uppercase font-bold px-2 py-1 rounded shadow-sm z-10">
            -{discountPercent}%
          </span>
        )}

        {product.stockCount <= 3 && product.stockCount > 0 && (
          <span className="absolute top-2 left-2 bg-white/95 backdrop-blur-sm text-red-600 text-[10px] font-sans tracking-wider uppercase font-bold px-2 py-1 rounded shadow-sm z-10">
            {product.stockCount} Left
          </span>
        )}

        {product.stockCount === 0 && (
          <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] flex items-center justify-center text-white text-xs font-sans tracking-widest uppercase font-semibold z-10">
            Sold Out
          </div>
        )}

        {product.stockCount > 0 && (
          <div className="absolute inset-x-0 bottom-0 p-2 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-[0.16,1,0.3,1] bg-gradient-to-t from-black/50 to-transparent z-10">
            <button
              onClick={handleAddClick}
              disabled={isAdded}
              className={`w-full py-2.5 text-[11px] font-sans font-bold tracking-widest uppercase rounded-md shadow-md transition-all duration-200 flex items-center justify-center gap-1.5 ${
                isAdded
                  ? "bg-emerald-600 text-white"
                  : "bg-white text-neutral-900 hover:bg-burgundy hover:text-white"
              }`}
            >
              {isAdded ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  Added!
                </>
              ) : (
                <>
                  <ShoppingBag className="w-3.5 h-3.5" />
                  Add To Bag
                </>
              )}
            </button>
          </div>
        )}
      </Link>

      {/* Product Information Details */}
      <div className="pt-3 pb-1 flex flex-col justify-between flex-1">
        <div>
          <span className="inline-block text-[10px] tracking-wide uppercase text-burgundy font-bold mb-1.5">
            {product.category}
          </span>
          <Link href={`/products/${product.id}`}>
            <h3 className="font-sans text-sm font-semibold text-neutral-900 tracking-tight line-clamp-2 leading-snug group-hover:text-burgundy transition-colors duration-200">
              {product.name}
            </h3>
          </Link>
        </div>

        <div className="mt-2 flex items-center gap-2">
          {showFlashPrice ? (
            <>
              <span className="text-base font-bold font-serif text-red-600">
                {formatCurrency(product.flashSalePrice!)}
              </span>
              <span className="text-xs text-neutral-400 line-through">
                {formatCurrency(product.price)}
              </span>
            </>
          ) : (
            <span className="text-base font-bold font-serif text-neutral-900">
              {formatCurrency(product.price)}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}