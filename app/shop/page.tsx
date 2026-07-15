"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { fetchLiveProducts } from "@/lib/firebase/products";
import { Product } from "@/components/products/ProductCard";
import ProductCard from "@/components/products/ProductCard";
import { Loader2, Zap } from "lucide-react";

function ShopContent() {
  const searchParams = useSearchParams();
  const flashOnly = searchParams.get("flash") === "true";

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLiveProducts().then((data) => {
      setProducts(data);
      setLoading(false);
    });
  }, []);

  const now = Date.now();
  const visibleProducts = flashOnly
    ? products.filter(
        (p) =>
          p.isFlashSale &&
          p.flashSaleEndsAt &&
          (p.flashSaleEndsAt.toMillis ? p.flashSaleEndsAt.toMillis() : 0) > now
      )
    : products;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        {flashOnly ? (
          <div className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-red-600 fill-current" />
            <h1 className="font-serif text-2xl font-bold text-neutral-900">
              Flash Sale
            </h1>
          </div>
        ) : (
          <h1 className="font-serif text-2xl font-bold text-neutral-900">
            Shop All
          </h1>
        )}
        <p className="text-sm text-neutral-500 mt-1">
          {flashOnly
            ? "Limited-time deals — while stock lasts"
            : "Browse our full collection"}
        </p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-24">
          <Loader2 className="w-5 h-5 animate-spin text-neutral-400" />
        </div>
      ) : visibleProducts.length === 0 ? (
        <div className="text-center py-24 border border-dashed border-neutral-200 rounded text-sm text-neutral-500">
          {flashOnly
            ? "No active flash deals right now — check back soon."
            : "The showroom ledger is currently empty."}
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-8">
          {visibleProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}

export default function ShopPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center py-24">
          <Loader2 className="w-5 h-5 animate-spin text-neutral-400" />
        </div>
      }
    >
      <ShopContent />
    </Suspense>
  );
}