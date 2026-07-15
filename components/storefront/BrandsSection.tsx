"use client";
import React, { useEffect, useState } from "react";
import { fetchBrands, Brand } from "@/lib/firebase/brands";

export default function BrandsSection() {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadBrands() {
      try {
        const data = await fetchBrands();
        setBrands(data);
      } catch (err) {
        console.error("Failed to load brands:", err);
      } finally {
        setLoading(false);
      }
    }
    loadBrands();
  }, []);

  if (!loading && brands.length === 0) {
    return null;
  }

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 border-t border-neutral-100">
      <div className="text-center max-w-xl mx-auto mb-12">
        <h2 className="font-serif text-2xl font-bold tracking-wide text-neutral-900">
          Shop by Brand
        </h2>
        <p className="text-neutral-500 text-sm mt-2">
          Discover pieces from the houses we trust.
        </p>
      </div>

      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
          {[1, 2, 3, 4, 5, 6].map(function (skeletonId) {
            return (
              <div
                key={skeletonId}
                className="aspect-square rounded border border-neutral-200 bg-neutral-100 animate-pulse"
              ></div>
            );
          })}
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
          {brands.map(function (brand) {
            const inner = brand.logoUrl
              ? React.createElement("img", {
                  src: brand.logoUrl,
                  alt: brand.name,
                  className:
                    "max-h-12 max-w-full object-contain grayscale group-hover:grayscale-0 transition-all",
                })
              : React.createElement(
                  "div",
                  {
                    className:
                      "w-12 h-12 rounded-full bg-neutral-900 text-white flex items-center justify-center font-serif text-lg",
                  },
                  brand.name.charAt(0).toUpperCase()
                );

            const label = React.createElement(
              "span",
              {
                key: "label",
                className:
                  "text-xs text-neutral-600 text-center truncate w-full",
              },
              brand.name
            );

            return React.createElement(
              "a",
              {
                key: brand.id,
                href: "/brands/" + brand.slug,
                className:
                  "group flex flex-col items-center justify-center gap-3 aspect-square rounded border border-neutral-200 hover:border-neutral-400 transition-colors p-4",
              },
              inner,
              label
            );
          })}
        </div>
      )}
    </section>
  );
}
