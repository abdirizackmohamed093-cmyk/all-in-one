"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import DataTable, { Column } from "@/components/admin/DataTable";
import { fetchBrands, deleteBrand, Brand } from "@/lib/firebase/brands";
import { Pencil, Trash2, Plus } from "lucide-react";

export default function AdminBrandsPage() {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBrands().then((data) => {
      setBrands(data);
      setLoading(false);
    });
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this brand? This cannot be undone.")) return;

    const ok = await deleteBrand(id);
    if (ok) setBrands((prev) => prev.filter((b) => b.id !== id));
  };

  const columns: Column<Brand>[] = [
    { header: "Name", accessor: "name" },
    { header: "Slug", accessor: (b) => <span className="text-charcoal/50">{b.slug}</span> },
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-serif text-2xl font-bold text-charcoal">Brands</h1>
        <Link
          href="/admin/brands/new"
          className="inline-flex items-center gap-2 bg-charcoal text-white text-xs font-bold uppercase tracking-widest px-4 py-2.5 rounded hover:bg-neutral-800 transition-colors"
        >
          <Plus className="w-4 h-4" /> Add Brand
        </Link>
      </div>

      <DataTable
        data={brands}
        columns={columns}
        loading={loading}
        getRowId={(b) => b.id}
        emptyMessage="No brands yet."
        actions={(b) => (
          <>
            <button className="p-1.5 hover:bg-neutral-100 rounded" title="Edit">
              <Pencil className="w-4 h-4 text-charcoal/60" />
            </button>
            <button
              onClick={() => handleDelete(b.id)}
              className="p-1.5 hover:bg-red-50 rounded"
              title="Delete"
            >
              <Trash2 className="w-4 h-4 text-red-500" />
            </button>
          </>
        )}
      />
    </div>
  );
}