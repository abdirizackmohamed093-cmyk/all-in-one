"use client";
import React, { useEffect, useState } from "react";
import { fetchProductRows, ProductRow } from "@/lib/firebase/productRows";
import { fetchLiveProducts } from "@/lib/firebase/products";
import { Product } from "@/components/products/ProductCard";
import ProductCard from "@/components/products/ProductCard";

export default function ProductRowSection() {
  const [rows, setRows] = useState<ProductRow[]>([]);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const [rowData, productData] = await Promise.all([
        fetchProductRows(),
        fetchLiveProducts(),
      ]);
      setRows(rowData.filter((r) => r.visible));
      setAllProducts(productData);
      setLoading(false);
    }
    load();
  }, []);

  if (loading || rows.length === 0) return null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 mb-16">
      {rows.map((row) => {
        const rowProducts = row.productIds
          .map((id) => allProducts.find((p) => p.id === id))
          .filter((p): p is Product => Boolean(p));

        if (rowProducts.length === 0) return null;

        return (
          <div key={row.id}>
            <h2 className="font-serif text-xl font-bold text-neutral-900 mb-4">
              {row.title}
            </h2>
            <div className="flex gap-4 overflow-x-auto pb-2 -mx-1 px-1 scroll-smooth snap-x">
              {rowProducts.map((product) => (
                <div
                  key={product.id}
                  className="w-40 sm:w-48 shrink-0 snap-start"
                >
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}