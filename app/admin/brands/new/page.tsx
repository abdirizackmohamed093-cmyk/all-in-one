"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { addBrand } from "@/lib/firebase/brands";
import { ArrowLeft, Loader2, Plus } from "lucide-react";

export default function NewBrandPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [logoUrl, setLogoUrl] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!name.trim()) {
      setError("Brand name is required.");
      return;
    }

    setSaving(true);
    const id = await addBrand(name, logoUrl);
    setSaving(false);

    if (id) {
      router.push("/admin/brands");
    } else {
      setError("Failed to save brand. Check the console for details.");
    }
  };

  return (
    <div className="max-w-md">
      <Link
        href="/admin/brands"
        className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-charcoal/60 hover:text-charcoal mb-6"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Brands
      </Link>

      <h1 className="font-serif text-2xl font-bold text-charcoal mb-6">Add New Brand</h1>

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
            placeholder="e.g. Samsung"
            className="w-full border border-neutral-200 rounded px-4 py-2.5 text-sm focus:outline-none focus:border-burgundy transition-colors"
          />
        </div>

        <div>
          <label className="block text-[10px] uppercase font-bold tracking-widest text-neutral-500 mb-2">
            Logo URL <span className="normal-case font-normal text-charcoal/40">(optional)</span>
          </label>
          <input
            type="text"
            value={logoUrl}
            onChange={(e) => setLogoUrl(e.target.value)}
            placeholder="https://..."
            className="w-full border border-neutral-200 rounded px-4 py-2.5 text-sm focus:outline-none focus:border-burgundy transition-colors"
          />
        </div>

        <button
          type="submit"
          disabled={saving}
          className="w-full py-3.5 bg-charcoal text-white hover:bg-neutral-800 text-xs font-bold tracking-widest uppercase rounded transition-all flex items-center justify-center gap-2 disabled:opacity-50"
        >
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <><Plus className="w-4 h-4" /> Save Brand</>}
        </button>
      </form>
    </div>
  );
}