"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { fetchPackages, deletePackage, Package } from "@/lib/firebase/packages";
import { Loader2, Plus, Trash2, Pencil, Eye, EyeOff, Star } from "lucide-react";

export default function AdminPackagesPage() {
  const [packages, setPackages] = useState<Package[]>([]);
  const [loading, setLoading] = useState(true);

  const load = () => {
    setLoading(true);
    fetchPackages().then((data) => {
      setPackages(data);
      setLoading(false);
    });
  };

  useEffect(() => {
    load();
  }, []);

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Delete "${title}"? This cannot be undone.`)) return;
    const ok = await deletePackage(id);
    if (ok) load();
    else alert("Failed to delete package. Please try again.");
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-serif text-2xl font-bold text-charcoal">
          Special Packages
        </h1>
        <Link
          href="/admin/packages/new"
          className="inline-flex items-center gap-2 bg-burgundy text-white text-xs font-bold uppercase tracking-widest px-4 py-2.5 rounded-md hover:opacity-90 transition-opacity"
        >
          <Plus className="w-4 h-4" />
          New Package
        </Link>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-24">
          <Loader2 className="w-5 h-5 animate-spin text-charcoal/50" />
        </div>
      ) : packages.length === 0 ? (
        <div className="text-center py-16 border border-dashed border-neutral-200 rounded-md">
          <p className="text-sm text-charcoal/50">
            No packages yet. Create your first curated bundle, like "High School Package".
          </p>
        </div>
      ) : (
        <div className="border border-neutral-200 rounded-md overflow-hidden">
          <div className="grid grid-cols-[auto_1fr_auto_auto_auto_auto] gap-4 px-4 py-3 bg-neutral-50 border-b border-neutral-200 text-[10px] font-bold uppercase tracking-widest text-neutral-500">
            <span>Icon</span>
            <span>Title</span>
            <span>Items</span>
            <span>Discount</span>
            <span>Status</span>
            <span></span>
          </div>
          {packages.map((pkg) => (
            <div
              key={pkg.id}
              className="grid grid-cols-[auto_1fr_auto_auto_auto_auto] gap-4 px-4 py-3.5 items-center border-b border-neutral-100 last:border-b-0"
            >
              <span className="text-xl">{pkg.icon}</span>
              <div>
                <p className="text-sm font-semibold text-neutral-900 flex items-center gap-1.5">
                  {pkg.title}
                  {pkg.isFeatured && (
                    <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                  )}
                </p>
                <p className="text-xs text-neutral-400">/{pkg.slug}</p>
              </div>
              <span className="text-sm text-neutral-600">
                {pkg.items?.length || 0} items
              </span>
              <span className="text-sm font-medium text-emerald-600">
                {pkg.discountPercent > 0 ? `${pkg.discountPercent}% off` : "-"}
              </span>
              <span>
                {pkg.isVisible ? (
                  <span className="inline-flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wide text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-1 rounded">
                    <Eye className="w-3 h-3" /> Live
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wide text-neutral-500 bg-neutral-100 border border-neutral-200 px-2 py-1 rounded">
                    <EyeOff className="w-3 h-3" /> Hidden
                  </span>
                )}
              </span>
              <div className="flex items-center gap-2">
                <Link
                  href={`/admin/packages/${pkg.id}/edit`}
                  className="p-1.5 text-neutral-400 hover:text-burgundy transition-colors"
                  title="Edit"
                >
                  <Pencil className="w-4 h-4" />
                </Link>
                <button
                  onClick={() => handleDelete(pkg.id, pkg.title)}
                  className="p-1.5 text-neutral-400 hover:text-red-600 transition-colors"
                  title="Delete"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
