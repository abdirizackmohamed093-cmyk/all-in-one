"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Header from "@/components/layout/Header";
import Footer from "@/components/Footer";
import ProductCard, { Product } from "@/components/products/ProductCard";
import { fetchCategories, Category } from "@/lib/firebase/categories";
import { fetchLiveProducts } from "@/lib/firebase/products";

export default function ShopCategoryPage() {
  const params = useParams();
  const slug = params.slug as string;

  const [category, setCategory] = useState<Category | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    async function loadCategoryProducts() {
      try {
        const categories = await fetchCategories();
        const matchedCategory = categories.find(function (c) {
          return c.slug === slug;
        });

        if (!matchedCategory) {
          setNotFound(true);
          setLoading(false);
          return;
        }

        setCategory(matchedCategory);

        const allProducts = await fetchLiveProducts();
        const filtered = allProducts.filter(function (p) {
          return p.category === matchedCategory.name;
        });
        setProducts(filtered);
      } catch (err) {
        console.error("Failed to load category page:", err);
      } finally {
        setLoading(false);
      }
    }
    loadCategoryProducts();
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
                This category could not be found.
              </p>
            </div>
          ) : (
            <>
              <div className="text-center max-w-xl mx-auto mb-16">
                <h1 className="font-serif text-3xl font-bold tracking-wide text-neutral-900">
                  {category?.name}
                </h1>
                <p className="text-neutral-500 text-sm mt-2">
                  Browse the full {category?.name} collection.
                </p>
              </div>

              {products.length === 0 ? (
                <div className="text-center py-20 border border-dashed border-neutral-200 rounded">
                  <p className="text-sm text-neutral-500">
                    No products in this category yet.
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