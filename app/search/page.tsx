"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { fetchLiveProducts } from "@/lib/firebase/products";
import { Product } from "@/components/products/ProductCard";
import ProductCard from "@/components/products/ProductCard";
import { Loader2, SearchX } from "lucide-react";

function SearchContent() {
  const searchParams = useSearchParams();
  const query = (searchParams.get("q") || "").trim().toLowerCase();

  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLiveProducts().then((data) => {
      setAllProducts(data);
      setLoading(false);
    });
  }, []);

  const results = query
    ? allProducts.filter((p) => {
        const haystack = [p.name, p.category, p.brand]
          .filter(Boolean)
          .join(" ")
          .toLowerCase();
        return haystack.includes(query);
      })
    : [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <h1 className="font-serif text-2xl font-bold text-neutral-900">
          Search Results
        </h1>
        <p className="text-sm text-neutral-500 mt-1">
          {query ? (
            <>
              {results.length} result{results.length !== 1 ? "s" : ""} for{" "}
              <span className="font-semibold text-neutral-700">
                &ldquo;{searchParams.get("q")}&rdquo;
              </span>
            </>
          ) : (
            "Enter a search term to find products"
          )}
        </p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-24">
          <Loader2 className="w-5 h-5 animate-spin text-neutral-400" />
        </div>
      ) : results.length === 0 ? (
        <div className="text-center py-24 border border-dashed border-neutral-200 rounded-lg text-neutral-500">
          <SearchX className="w-10 h-10 mx-auto mb-4 text-neutral-300" />
          <p className="text-sm">
            {query
              ? `No products found matching "${searchParams.get("q")}"`
              : "Try searching for a product, category, or brand."}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-8">
          {results.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center py-24">
          <Loader2 className="w-5 h-5 animate-spin text-neutral-400" />
        </div>
      }
    >
      <SearchContent />
    </Suspense>
  );
}