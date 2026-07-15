"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { addCategory } from "@/lib/firebase/categories";
import { ArrowLeft, Loader2, Plus } from "lucide-react";

export default function NewCategoryPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!name.trim()) {
      setError("Category name is required.");
      return;
    }

    setSaving(true);
    const id = await addCategory(name);
    setSaving(false);

    if (id) {
      router.push("/admin/categories");
    } else {
      setError("Failed to save category. Check the console for details.");
    }
  };

  return (
    <div className="max-w-md">
      <Link
        href="/admin/categories"
        className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-charcoal/60 hover:text-charcoal mb-6"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Categories
      </Link>

      <h1 className="font-serif text-2xl font-bold text-charcoal mb-6">Add New Category</h1>

      {error && (
        <div className="mb-6 p-3 bg-red-50 border border-red-200 text-red-600 text-xs rounded font-medium">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5 border border-neutral-200 rounded-md p-6">
        <div>
          <label className="block text-[10px] uppercase font-bold tracking-widest text-neutral-500 mb-2">
            Name
          </label>
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Electronics"
            className="w-full border border-neutral-200 rounded px-4 py-2.5 text-sm focus:outline-none focus:border-burgundy transition-colors"
          />
        </div>

        <button
          type="submit"
          disabled={saving}
          className="w-full py-3.5 bg-charcoal text-white hover:bg-neutral-800 text-xs font-bold tracking-widest uppercase rounded transition-all flex items-center justify-center gap-2 disabled:opacity-50"
        >
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <><Plus className="w-4 h-4" /> Save Category</>}
        </button>
      </form>
    </div>
  );
}