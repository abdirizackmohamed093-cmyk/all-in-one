"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { fetchPackageBySlug, Package as PackageType } from "@/lib/firebase/packages";
import { useCart } from "@/context/CartContext";
import {
  Loader2,
  ArrowLeft,
  ShoppingBag,
  Check,
  Sparkles,
  MessageCircle,
} from "lucide-react";

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("en-KE", {
    style: "currency",
    currency: "KES",
    minimumFractionDigits: 0,
  }).format(amount);
}

export default function PackageDetailPage() {
  const params = useParams();
  const slug = params.slug as string;
  const { addToCart } = useCart();

  const [pkg, setPkg] = useState<PackageType | null>(null);
  const [loading, setLoading] = useState(true);
  const [addedBundle, setAddedBundle] = useState(false);

  useEffect(() => {
    async function load() {
      setLoading(true);
      const found = await fetchPackageBySlug(slug);
      setPkg(found);
      setLoading(false);
    }
    load();
  }, [slug]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-32">
        <Loader2 className="w-6 h-6 animate-spin text-neutral-400" />
      </div>
    );
  }

  if (!pkg) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-24 text-center">
        <h1 className="font-serif text-2xl font-bold text-neutral-900 mb-3">
          Package Not Found
        </h1>
        <p className="text-sm text-neutral-500 mb-6">
          This package does not exist or may have been removed.
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-burgundy hover:underline"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Store
        </Link>
      </div>
    );
  }

  const items = pkg.items || [];
  const bundleTotal = items.reduce((sum, it) => sum + it.price, 0);
  const discountedTotal = bundleTotal * (1 - pkg.discountPercent / 100);
  const savedAmount = bundleTotal - discountedTotal;

  const handleAddBundle = () => {
    items.forEach((it) => {
      addToCart(
        {
          id: `${pkg.id}-${it.id}`,
          name: it.name,
          price: it.price,
          imageUrl: it.imageUrl,
          stockCount: 999,
        },
        1
      );
    });
    setAddedBundle(true);
    setTimeout(() => setAddedBundle(false), 2500);
  };

  return (
    <div className="bg-neutral-50 min-h-screen">
      <div className="relative h-32 sm:h-40 bg-burgundy flex items-end">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-5 w-full">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-[11px] uppercase tracking-widest text-white/80 hover:text-white mb-2"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Store
          </Link>
          <div className="flex items-center gap-2.5">
            <span className="text-2xl">{pkg.icon}</span>
            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-white">
              {pkg.title}
            </h1>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-8 items-start">
          <div className="space-y-6">
            <div>
              <h2 className="text-sm font-bold uppercase tracking-widest text-neutral-900 mb-4">
                What is Included ({items.length} items)
              </h2>
              {items.length === 0 ? (
                <div className="bg-white border border-dashed border-neutral-200 rounded-lg p-8 text-center text-sm text-neutral-400">
                  No items in this package yet.
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {items.map((it) => (
                    <div
                      key={it.id}
                      className="bg-white border border-neutral-200 rounded-lg overflow-hidden"
                    >
                      <div className="aspect-square bg-neutral-100">
                        <img
                          src={it.imageUrl || "/placeholder-product.jpg"}
                          alt={it.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="p-3">
                        <p className="text-sm font-medium text-neutral-900 line-clamp-2 leading-snug">
                          {it.name}
                        </p>
                        <p className="text-xs text-neutral-500 mt-1">
                          {formatCurrency(it.price)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {pkg.description && (
              <div className="bg-white border border-neutral-200 rounded-lg p-6">
                <p className="text-sm text-neutral-600 leading-relaxed">
                  {pkg.description}
                </p>
              </div>
            )}

            <div className="bg-white border border-neutral-200 rounded-lg p-6">
              <div className="flex items-center gap-2 mb-4">
                <Sparkles className="w-4 h-4 text-burgundy" />
                <h2 className="text-sm font-bold uppercase tracking-widest text-neutral-900">
                  Why We Recommend This Package
                </h2>
              </div>
              <p className="text-sm text-neutral-600 leading-relaxed">
                Every item in this bundle is chosen to work together, saving you
                the time and hassle of finding each piece separately. Buying the
                full set together also means a better price than picking items
                one by one.
              </p>
            </div>
          </div>

          <div className="lg:sticky lg:top-24">
            <div className="bg-white border border-neutral-200 rounded-lg overflow-hidden">
              <div className="px-6 py-4 border-b border-neutral-100 flex items-center justify-between">
                <h2 className="text-sm font-bold uppercase tracking-widest text-neutral-900">
                  Bundle Summary
                </h2>
                {pkg.isFeatured && (
                  <span className="text-[10px] font-bold uppercase tracking-wide bg-amber-50 text-amber-700 border border-amber-200 px-2 py-1 rounded">
                    Popular Choice
                  </span>
                )}
              </div>

              <div className="px-6 py-5 space-y-1.5">
                <div className="flex justify-between text-xs text-neutral-500">
                  <span>Items ({items.length})</span>
                  <span>{formatCurrency(bundleTotal)}</span>
                </div>
                {pkg.discountPercent > 0 && (
                  <div className="flex justify-between text-xs text-emerald-600 font-medium">
                    <span>Bundle discount ({pkg.discountPercent}%)</span>
                    <span>-{formatCurrency(savedAmount)}</span>
                  </div>
                )}
                <div className="flex justify-between pt-3 mt-2 border-t border-neutral-100">
                  <span className="text-sm font-bold text-neutral-900">Total</span>
                  <span className="font-serif text-2xl font-bold text-neutral-900">
                    {formatCurrency(discountedTotal)}
                  </span>
                </div>
                {pkg.discountPercent > 0 && (
                  <p className="text-xs text-emerald-600 font-medium text-right">
                    You save {formatCurrency(savedAmount)}
                  </p>
                )}
              </div>

              <div className="px-6 pb-6">
                <button
                  onClick={handleAddBundle}
                  disabled={items.length === 0}
                  className={`w-full py-3.5 text-xs font-bold tracking-widest uppercase rounded-md transition-all flex items-center justify-center gap-2 disabled:opacity-40 ${
                    addedBundle
                      ? "bg-emerald-600 text-white"
                      : "bg-burgundy text-white hover:opacity-90"
                  }`}
                >
                  {addedBundle ? (
                    <>
                      <Check className="w-4 h-4" /> Added to Cart!
                    </>
                  ) : (
                    <>
                      <ShoppingBag className="w-4 h-4" /> Add Entire Bundle to Cart
                    </>
                  )}
                </button>

                <a href="https://wa.me/254732477111" target="_blank" rel="noopener noreferrer" className="mt-3 w-full flex items-center justify-center gap-2 text-xs font-semibold text-emerald-600 hover:underline">
                  <MessageCircle className="w-4 h-4" />
                  Need help choosing this package?
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
