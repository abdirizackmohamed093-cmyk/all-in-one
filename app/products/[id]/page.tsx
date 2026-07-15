"use client";

import React, { useState, useEffect } from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/Footer";
import { useCart } from "@/context/CartContext";
import { Product } from "@/components/products/ProductCard";
import { fetchSingleProduct } from "@/lib/firebase/products";
import { ShoppingBag, ArrowLeft, ShieldCheck, Truck, RotateCcw, Check } from "lucide-react";
import Link from "next/link";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function ProductDetailPage({ params }: PageProps) {
  const { id } = React.use(params);
  const { addToCart } = useCart();

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [isAdded, setIsAdded] = useState(false);

  useEffect(() => {
    async function getProductProfile() {
      const liveData = await fetchSingleProduct(id);
      setProduct(liveData);
      setLoading(false);
    }
    getProductProfile();
  }, [id]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-KE", {
      style: "currency",
      currency: "KES",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const handleAddToBag = () => {
    if (!product) return;
    addToCart({
      id: product.id,
      name: product.name,
      price: product.isFlashSale && product.flashSalePrice ? product.flashSalePrice : product.price,
      imageUrl: product.imageUrl,
      stockCount: product.stockCount,
    }, quantity);

    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex flex-col justify-between animate-pulse">
        <div>
          <Header />
          <main className="max-w-7xl mx-auto px-4 py-20 grid grid-cols-1 lg:grid-cols-12 gap-12">
            <div className="lg:col-span-7 aspect-[3/4] bg-neutral-100 rounded border border-neutral-200" />
            <div className="lg:col-span-5 space-y-6 pt-10">
              <div className="h-3 bg-neutral-100 rounded w-1/4" />
              <div className="h-8 bg-neutral-100 rounded w-3/4" />
              <div className="h-6 bg-neutral-100 rounded w-1/3" />
              <div className="h-24 bg-neutral-100 rounded w-full" />
            </div>
          </main>
        </div>
        <Footer />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-white flex flex-col justify-between">
        <div>
          <Header />
          <main className="max-w-7xl mx-auto px-4 py-32 text-center">
            <h2 className="font-serif text-2xl font-bold text-neutral-900">Product Not Found</h2>
            <p className="text-neutral-500 text-sm mt-2">The luxury piece you are looking for does not exist or has been archived.</p>
            <Link href="/" className="mt-6 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-neutral-900 border-b border-neutral-900 pb-1 hover:text-neutral-500 hover:border-neutral-500 transition-colors">
              <ArrowLeft className="w-4 h-4" /> Back to Catalog
            </Link>
          </main>
        </div>
        <Footer />
      </div>
    );
  }

  const showFlashPrice = product.isFlashSale && product.flashSalePrice;

  return (
    <div className="min-h-screen bg-white text-neutral-900 flex flex-col justify-between">
      <div>
        <Header />

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <Link href="/" className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-neutral-500 hover:text-neutral-900 transition-colors mb-12">
            <ArrowLeft className="w-3.5 h-3.5" /> Return to Curation
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">

            <div className="lg:col-span-7 w-full max-w-2xl mx-auto lg:max-w-none">
              <div className="relative w-full aspect-[3/4] bg-neutral-100 rounded border border-neutral-200 overflow-hidden">
                <img
                  src={product.imageUrl}
                  alt={product.name}
                  className="absolute inset-0 w-full h-full object-cover object-center"
                />
              </div>
            </div>

            <div className="lg:col-span-5 flex flex-col justify-start">
              <span className="text-xs tracking-widest uppercase text-neutral-400 font-bold mb-2">
                {product.category}
              </span>
              <h1 className="font-serif text-2xl sm:text-3xl font-medium tracking-tight text-neutral-900 leading-tight mb-4">
                {product.name}
              </h1>

              {showFlashPrice ? (
                <div className="flex items-center gap-3 mb-6">
                  <p className="text-xl font-serif font-semibold text-red-600">
                    {formatCurrency(product.flashSalePrice!)}
                  </p>
                  <p className="text-sm font-serif text-neutral-400 line-through">
                    {formatCurrency(product.price)}
                  </p>
                </div>
              ) : (
                <p className="text-xl font-serif font-semibold text-neutral-900 mb-6">
                  {formatCurrency(product.price)}
                </p>
              )}

              <hr className="border-neutral-200 my-2" />

              <div className="py-4">
                <h3 className="text-xs uppercase tracking-wider font-bold text-neutral-800 mb-2">The Narrative</h3>
                <p className="text-neutral-600 text-sm leading-relaxed font-sans">
                  {/* Pulls custom text from Firestore if present, else falls back cleanly */}
                  {(product as any).description || "Premium curated merchandise tailored with bespoke details and engineered materials to deliver exceptional lifestyle value daily."}
                </p>
              </div>

              <hr className="border-neutral-200 my-2" />

              {product.stockCount > 0 ? (
                <div className="mt-6 flex flex-col gap-4">
                  <div className="flex items-center justify-between border border-neutral-300 rounded px-4 py-2 w-32 bg-white">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="text-neutral-500 hover:text-neutral-900 font-bold px-2 text-sm"
                    >
                      -
                    </button>
                    <span className="text-sm font-sans font-medium w-6 text-center select-none">{quantity}</span>
                    <button
                      onClick={() => setQuantity(Math.min(product.stockCount, quantity + 1))}
                      className="text-neutral-500 hover:text-neutral-900 font-bold px-2 text-sm"
                    >
                      +
                    </button>
                  </div>

                  <button
                    onClick={handleAddToBag}
                    disabled={isAdded}
                    className={`w-full py-4 text-xs font-sans font-bold tracking-widest uppercase rounded shadow-lg transition-all duration-200 flex items-center justify-center gap-3 ${
                      isAdded
                        ? "bg-emerald-600 text-white"
                        : "bg-neutral-900 hover:bg-neutral-800 text-white"
                    }`}
                  >
                    {isAdded ? (
                      <>
                        <Check className="w-4 h-4" />
                        Added To Selection Bag!
                      </>
                    ) : (
                      <>
                        <ShoppingBag className="w-4 h-4" />
                        Add To Selection Bag
                      </>
                    )}
                  </button>
                </div>
              ) : (
                <div className="mt-6 p-4 bg-neutral-100 border border-neutral-200 text-neutral-500 text-center text-xs uppercase font-bold tracking-wider rounded">
                  Out Of Stock
                </div>
              )}

              <div className="mt-12 space-y-4 border-t border-neutral-100 pt-8">
                <div className="flex items-center gap-3 text-neutral-600 text-xs font-sans">
                  <Truck className="w-4 h-4 text-neutral-400 shrink-0" />
                  <span>Complimentary insured shipping nationwide</span>
                </div>
                <div className="flex items-center gap-3 text-neutral-600 text-xs font-sans">
                  <RotateCcw className="w-4 h-4 text-neutral-400 shrink-0" />
                  <span>Premium 14-day standard collection return window</span>
                </div>
                <div className="flex items-center gap-3 text-neutral-600 text-xs font-sans">
                  <ShieldCheck className="w-4 h-4 text-neutral-400 shrink-0" />
                  <span>100% Genuine product composition guarantee</span>
                </div>
              </div>

            </div>
          </div>
        </main>
      </div>

      <Footer />
    </div>
  );
}