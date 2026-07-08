"use client";

import React from "react";
import { useCart } from "@/context/CartContext";
import { ShoppingBag } from "lucide-react";
import Image from "next/image";

export interface Product {
  id: string;
  name: string;
  price: number;
  imageUrl: string;
  category: string;
  stockCount: number;
}

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart();

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
      price: product.price,
      imageUrl: product.imageUrl,
      stockCount: product.stockCount,
    }, 1);
  };

  return (
    <div className="group relative flex flex-col bg-white overflow-hidden transition-all duration-300 w-full max-w-sm mx-auto">
      
      {/* Aspect-Ratio Container with explicit block heights to prevent distortion */}
      <div className="relative w-full aspect-[3/4] sm:h-auto bg-neutral-100 overflow-hidden rounded border border-neutral-200">
        <Image
          src={product.imageUrl || "/placeholder-product.jpg"}
          alt={product.name}
          fill
          priority
          className="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
        
        {product.stockCount <= 3 && product.stockCount > 0 && (
          <span className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm text-red-600 text-[9px] font-sans tracking-wider uppercase font-bold px-2 py-1 rounded-sm shadow-sm z-10">
            Only {product.stockCount} Left
          </span>
        )}
        
        {product.stockCount === 0 && (
          <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] flex items-center justify-center text-white text-xs font-sans tracking-widest uppercase font-semibold z-10">
            Sold Out
          </div>
        )}

        {product.stockCount > 0 && (
          <div className="absolute inset-x-0 bottom-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-[0.16,1,0.3,1] bg-gradient-to-t from-black/40 to-transparent z-10">
            <button
              onClick={handleAddClick}
              className="w-full py-3 bg-white text-neutral-900 hover:bg-neutral-900 hover:text-white text-[10px] font-sans font-bold tracking-widest uppercase rounded shadow-md transition-all duration-200 flex items-center justify-center gap-2"
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              Add To Bag
            </button>
          </div>
        )}
      </div>

      {/* Product Information Details */}
      <div className="pt-4 pb-2 flex flex-col justify-between flex-1">
        <div>
          <p className="text-[10px] tracking-widest uppercase text-neutral-500 font-semibold mb-1">
            {product.category}
          </p>
          <h3 className="font-sans text-sm font-medium text-neutral-900 tracking-tight line-clamp-2 group-hover:text-neutral-600 transition-colors duration-200">
            {product.name}
          </h3>
        </div>
        
        <div className="mt-2 flex items-center justify-between">
          <span className="text-sm font-semibold font-serif text-neutral-900">
            {formatCurrency(product.price)}
          </span>
        </div>
      </div>
    </div>
  );
}