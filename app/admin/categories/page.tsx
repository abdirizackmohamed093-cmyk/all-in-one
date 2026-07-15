"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import DataTable, { Column } from "@/components/admin/DataTable";
import { fetchCategories, deleteCategory, Category } from "@/lib/firebase/categories";
import { Pencil, Trash2, Plus } from "lucide-react";

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCategories().then((data) => {
      setCategories(data);
      setLoading(false);
    });
  }, []);

  const handleDelete = async (id: string) => {
    // Note: this doesn't check whether products still reference this
    // category. For now that's an acceptable gap — we'll want to guard
    // against orphaned product categories once the dropdown wiring lands.
    if (!confirm("Delete this category? This cannot be undone.")) return;

    const ok = await deleteCategory(id);
    if (ok) setCategories((prev) => prev.filter((c) => c.id !== id));
  };

  const columns: Column<Category>[] = [
    { header: "Name", accessor: "name" },
    { header: "Slug", accessor: (c) => <span className="text-charcoal/50">{c.slug}</span> },
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-serif text-2xl font-bold text-charcoal">Categories</h1>
        <Link
          href="/admin/categories/new"
          className="inline-flex items-center gap-2 bg-charcoal text-white text-xs font-bold uppercase tracking-widest px-4 py-2.5 rounded hover:bg-neutral-800 transition-colors"
        >
          <Plus className="w-4 h-4" /> Add Category
        </Link>
      </div>

      <DataTable
        data={categories}
        columns={columns}
        loading={loading}
        getRowId={(c) => c.id}
        emptyMessage="No categories yet."
        actions={(c) => (
          <>
            <button className="p-1.5 hover:bg-neutral-100 rounded" title="Edit">
              <Pencil className="w-4 h-4 text-charcoal/60" />
            </button>
            <button
              onClick={() => handleDelete(c.id)}
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