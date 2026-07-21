"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { fetchPackagesByCategory, Package as PackageType } from "@/lib/firebase/packages";
import { Loader2, Sparkles, ArrowRight } from "lucide-react";

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("en-KE", {
    style: "currency",
    currency: "KES",
    minimumFractionDigits: 0,
  }).format(amount);
}

export default function PackageCategoryPage() {
  const params = useParams();
  const category = params.category as string;

  const [packages, setPackages] = useState<PackageType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPackagesByCategory(category).then((data) => {
      setPackages(data);
      setLoading(false);
    });
  }, [category]);

  const categoryLabel = packages[0]?.categoryLabel || category.replace(/-/g, " ");
  const categoryIcon = packages[0]?.icon || "🎁";

  return (
    <main className="bg-neutral-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        {loading ? (
          <div className="flex items-center justify-center py-32">
            <Loader2 className="w-6 h-6 animate-spin text-neutral-400" />
          </div>
        ) : (
          <>
            {/* Header */}
            <div className="text-center max-w-xl mx-auto mb-14">
              <div className="w-16 h-16 mx-auto mb-5 rounded-full bg-burgundy/5 border border-burgundy/10 flex items-center justify-center text-3xl">
                {categoryIcon}
              </div>
              <h1 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight text-neutral-900 capitalize">
                {categoryLabel}
              </h1>
              <p className="text-neutral-500 text-sm mt-3 leading-relaxed">
                Browse the full {categoryLabel} collection — curated bundles,
                put together to save you time and money.
              </p>
              {packages.length > 0 && (
                <p className="text-[11px] uppercase tracking-widest font-semibold text-burgundy mt-4">
                  {packages.length} curated {packages.length === 1 ? "bundle" : "bundles"}
                </p>
              )}
            </div>

            {packages.length === 0 ? (
              <div className="text-center py-24 border border-dashed border-neutral-200 rounded-lg bg-white">
                <p className="text-sm text-neutral-500">
                  No packages in this category yet.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {packages.map((pkg) => {
                  const total = pkg.items.reduce((sum, it) => sum + it.price, 0);
                  const discounted = total * (1 - pkg.discountPercent / 100);
                  const saved = total - discounted;
                  const coverImage = pkg.bannerImageUrl || pkg.items[0]?.imageUrl;

                  return (
                    <Link
                      key={pkg.id}
                      href={`/packages/${pkg.slug}`}
                      className="group flex flex-col bg-white rounded-lg border border-neutral-200 overflow-hidden shadow-sm hover:shadow-lg hover:border-burgundy/20 transition-all duration-300"
                    >
                      <div className="relative w-full aspect-[4/3] bg-neutral-100 overflow-hidden">
                        <img
                          src={coverImage || "/placeholder-product.jpg"}
                          alt={pkg.title}
                          className="absolute inset-0 w-full h-full object-cover object-center transition-transform duration-500 ease-out group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent" />

                        <div className="absolute top-3 left-3 flex gap-1.5">
                          {pkg.isFeatured && (
                            <span className="inline-flex items-center gap-1 bg-white/95 backdrop-blur text-neutral-800 text-[10px] font-bold uppercase tracking-wide px-2 py-1 rounded-md shadow-sm">
                              <Sparkles className="w-3 h-3 text-amber-500" />
                              Popular
                            </span>
                          )}
                        </div>

                        {pkg.discountPercent > 0 && (
                          <span className="absolute top-3 right-3 bg-burgundy text-white text-[10px] font-bold uppercase tracking-wide px-2 py-1 rounded-md shadow-sm">
                            -{pkg.discountPercent}%
                          </span>
                        )}

                        <span className="absolute bottom-3 left-3 bg-white/95 backdrop-blur text-neutral-700 text-[10px] font-semibold px-2 py-1 rounded-md shadow-sm">
                          {pkg.items.length} {pkg.items.length === 1 ? "item" : "items"}
                        </span>
                      </div>

                      <div className="p-5 flex flex-col flex-1">
                        <p className="text-[10px] tracking-widest uppercase text-neutral-400 font-bold mb-1.5">
                          {categoryLabel}
                        </p>
                        <h3 className="font-serif text-base font-bold text-neutral-900 leading-snug mb-3 group-hover:text-burgundy transition-colors duration-200">
                          {pkg.title}
                        </h3>

                        <div className="mt-auto pt-3 border-t border-neutral-100">
                          <div className="flex items-end justify-between">
                            <div>
                              <p className="font-serif text-xl font-bold text-neutral-900">
                                {formatCurrency(discounted)}
                              </p>
                              {pkg.discountPercent > 0 && (
                                <p className="text-xs text-neutral-400 line-through">
                                  {formatCurrency(total)}
                                </p>
                              )}
                            </div>
                            <span className="inline-flex items-center gap-1 text-xs font-bold text-burgundy opacity-0 group-hover:opacity-100 -translate-x-1 group-hover:translate-x-0 transition-all duration-200">
                              Shop <ArrowRight className="w-3.5 h-3.5" />
                            </span>
                          </div>
                          {saved > 0 && (
                            <p className="text-[11px] text-emerald-600 font-semibold mt-1">
                              You save {formatCurrency(saved)}
                            </p>
                          )}
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}
          </>
        )}
      </div>
    </main>
  );
}