"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Header from "@/components/layout/Header";
import Footer from "@/components/Footer";
import ProductCard, { Product } from "@/components/products/ProductCard";
import { fetchBrands, Brand } from "@/lib/firebase/brands";
import { fetchLiveProducts } from "@/lib/firebase/products";

export default function BrandPage() {
  const params = useParams();
  const slug = params.slug as string;

  const [brand, setBrand] = useState<Brand | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    async function loadBrandProducts() {
      try {
        const brands = await fetchBrands();
        const matchedBrand = brands.find(function (b) {
          return b.slug === slug;
        });

        if (!matchedBrand) {
          setNotFound(true);
          setLoading(false);
          return;
        }

        setBrand(matchedBrand);

        const allProducts = await fetchLiveProducts();
        const filtered = allProducts.filter(function (p) {
          return p.brand === matchedBrand.name;
        });
        setProducts(filtered);
      } catch (err) {
        console.error("Failed to load brand page:", err);
      } finally {
        setLoading(false);
      }
    }
    loadBrandProducts();
  }, [slug]);

  return (
    <div className="min-h-screen bg-white text-neutral-900 flex flex-col justify-between">
      <div>
        <Header />

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          {loading ? (
            <p className="text-center text-neutral-500 text-sm">Loading...</p>
          ) : notFound ? (
            <div className="text-center py-20 border border-dashed border-neutral-200 rounded">
              <p className="text-sm text-neutral-500">
                This brand could not be found.
              </p>
            </div>
          ) : (
            <>
              <div className="text-center max-w-xl mx-auto mb-16">
                <h1 className="font-serif text-3xl font-bold tracking-wide text-neutral-900">
                  {brand?.name}
                </h1>
                <p className="text-neutral-500 text-sm mt-2">
                  Browse the full {brand?.name} collection.
                </p>
              </div>

              {products.length === 0 ? (
                <div className="text-center py-20 border border-dashed border-neutral-200 rounded">
                  <p className="text-sm text-neutral-500">
                    No products from this brand yet.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 gap-y-8">
                  {products.map(function (product) {
                    return <ProductCard key={product.id} product={product} />;
                  })}
                </div>
              )}
            </>
          )}
        </main>
      </div>
      <Footer />
    </div>
  );
}