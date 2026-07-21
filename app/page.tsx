"use client";
import React, { useEffect, useState } from "react";
import Header from "@/components/layout/Header";
import ProductCard, { Product } from "@/components/products/ProductCard";
import Footer from "@/components/Footer";
import BrandsSection from "@/components/storefront/BrandsSection";
import HeroSlider from "@/components/storefront/HeroSlider";
import ProductRowSection from "@/components/storefront/ProductRowSection";
import CategoryTilesSection from "@/components/storefront/CategoryTilesSection";
import { fetchLiveProducts } from "@/lib/firebase/products";
export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    async function loadCatalog() {
      const data = await fetchLiveProducts();
      setProducts(data);
      setLoading(false);
    }
    loadCatalog();
  }, []);
  return (
    <div className="min-h-screen bg-white text-neutral-900 flex flex-col justify-between">
      <div>
        <Header />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
          <HeroSlider />
        </div>

        <CategoryTilesSection />

        <ProductRowSection />

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center max-w-xl mx-auto mb-16">
            <h1 className="font-serif text-3xl font-bold tracking-wide text-neutral-900">
              Curated Collections
            </h1>
            <p className="text-neutral-500 text-sm mt-2">
              Experience premium craftsmanship engineered for modern luxury.
            </p>
          </div>
          
          {loading ? (
            /* Elegant loading skeleton cards mimicking high-end wireframes */
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 gap-y-8">
              {[1, 2, 3].map((skeletonId) => (
                <div key={skeletonId} className="w-full max-w-sm mx-auto flex flex-col gap-4 animate-pulse">
                  <div className="w-full aspect-[3/4] bg-neutral-100 rounded border border-neutral-200" />
                  <div className="h-3 bg-neutral-100 rounded w-1/4" />
                  <div className="h-4 bg-neutral-100 rounded w-3/4" />
                  <div className="h-4 bg-neutral-100 rounded w-1/3" />
                </div>
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-20 border border-dashed border-neutral-200 rounded">
              <p className="text-sm text-neutral-500">The showroom ledger is currently empty.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 gap-y-8">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </main>
      </div>

      <BrandsSection />

      <Footer />
    </div>
  );
}