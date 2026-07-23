"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { fetchCategoryTiles, CategoryTile } from "@/lib/firebase/categoryTiles";

export default function CategoryTilesSection() {
  const [tiles, setTiles] = useState<CategoryTile[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const data = await fetchCategoryTiles();
      setTiles(data.filter((t) => t.visible));
      setLoading(false);
    }
    load();
  }, []);

  if (loading || tiles.length === 0) return null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {tiles.map((tile) => (
          <div
            key={tile.id}
            className="group bg-primary rounded-lg p-5 shadow-sm transition-all duration-300 hover:shadow-md hover:-translate-y-0.5"
          >
            <p className="text-sm font-extrabold uppercase tracking-wide text-white mb-1">{tile.label}</p>
            <div className="w-8 h-0.5 bg-white/70 rounded-full mb-3" />
            <div className="w-full aspect-square rounded overflow-hidden mb-3">
              <img
                src={tile.imageUrl || "/placeholder-product.jpg"}
                alt={tile.label}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
            </div>
            {tile.href && (
              <Link
                href={tile.href}
                className="inline-flex items-center gap-1 text-xs font-bold uppercase tracking-wide text-white transition-colors group-hover:text-white/80"
              >
                {tile.linkLabel || "Shop Now"}
                <ArrowRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-1" />
              </Link>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}