"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { addPackage, PackageItem } from "@/lib/firebase/packages";
import { Loader2, Plus, Trash2 } from "lucide-react";

const CATEGORY_OPTIONS = [
  { emoji: "👧", label: "High school (Girl)", slug: "high-school-girl" },
  { emoji: "👦", label: "High school (Boy)", slug: "high-school-boy" },
  { emoji: "🎓", label: "Campus", slug: "campus" },
  { emoji: "🤰", label: "Maternity", slug: "maternity" },
  { emoji: "🏠", label: "New House", slug: "new-house" },
  { emoji: "👔", label: "Gifts (Men)", slug: "gifts-men" },
  { emoji: "💝", label: "Gifts (Women)", slug: "gifts-women" },
  { emoji: "🧺", label: "Picnic", slug: "picnic" },
];

const slugify = (text: string) =>
  text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");

let itemIdCounter = 0;
const newItemId = () => `item-${Date.now()}-${itemIdCounter++}`;

export default function NewPackagePage() {
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [category, setCategory] = useState(CATEGORY_OPTIONS[2]);
  const [description, setDescription] = useState("");
  const [discountPercent, setDiscountPercent] = useState(0);
  const [isFeatured, setIsFeatured] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [items, setItems] = useState<PackageItem[]>([
    { id: newItemId(), name: "", imageUrl: "", price: 0 },
  ]);

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const addItemRow = () => {
    setItems((prev) => [...prev, { id: newItemId(), name: "", imageUrl: "", price: 0 }]);
  };

  const removeItemRow = (id: string) => {
    setItems((prev) => prev.filter((it) => it.id !== id));
  };

  const updateItem = (id: string, field: keyof PackageItem, value: string | number) => {
    setItems((prev) =>
      prev.map((it) => (it.id === id ? { ...it, [field]: value } : it))
    );
  };

  const validItems = items.filter((it) => it.name.trim() && it.imageUrl.trim());
  const bundleTotal = validItems.reduce((sum, it) => sum + (Number(it.price) || 0), 0);
  const discountedTotal = bundleTotal * (1 - discountPercent / 100);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!title.trim()) {
      setError("Package title is required.");
      return;
    }
    if (validItems.length === 0) {
      setError("Add at least one item with a name and image URL.");
      return;
    }

    setSaving(true);
    const id = await addPackage({
      title: title.trim(),
      slug: slugify(title),
      category: category.slug,
      categoryLabel: category.label,
      icon: category.emoji,
      description: description.trim(),
      items: validItems.map((it) => ({
        ...it,
        name: it.name.trim(),
        imageUrl: it.imageUrl.trim(),
        price: Number(it.price) || 0,
      })),
      discountPercent: Number(discountPercent) || 0,
      isFeatured,
      isVisible,
    });
    setSaving(false);

    if (id) {
      router.push("/admin/packages");
    } else {
      setError("Failed to create package. Please try again.");
    }
  };

  return (
    <div className="max-w-3xl">
      <h1 className="font-serif text-2xl font-bold text-charcoal mb-6">
        New Special Package
      </h1>

      {error && (
        <div className="mb-6 p-3 bg-red-50 border border-red-200 text-red-600 text-xs rounded font-medium">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white border border-neutral-200 rounded-lg p-6 space-y-5">
          <div>
            <label className="block text-[10px] uppercase font-bold tracking-widest text-neutral-500 mb-2">
              Category
            </label>
            <div className="flex flex-wrap gap-2">
              {CATEGORY_OPTIONS.map((opt) => (
                <button
                  key={opt.slug}
                  type="button"
                  onClick={() => setCategory(opt)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-md border text-sm transition-colors ${
                    category.slug === opt.slug
                      ? "border-burgundy bg-burgundy/5"
                      : "border-neutral-200 hover:bg-neutral-50"
                  }`}
                >
                  <span className="text-lg">{opt.emoji}</span>
                  <span className="text-xs text-neutral-600">{opt.label}</span>
                </button>
              ))}
            </div>
            <p className="text-xs text-neutral-400 mt-1.5">
              Packages in the same category will be grouped together on one page.
            </p>
          </div>

          <div>
            <label className="block text-[10px] uppercase font-bold tracking-widest text-neutral-500 mb-2">
              Package Title
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Basic Maternity Kit"
              className="w-full border border-neutral-200 rounded-md px-4 py-2.5 text-sm focus:outline-none focus:border-burgundy transition-colors"
            />
            {title && (
              <p className="text-xs text-neutral-400 mt-1.5">
                URL: /packages/{slugify(title)}
              </p>
            )}
          </div>

          <div>
            <label className="block text-[10px] uppercase font-bold tracking-widest text-neutral-500 mb-2">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="e.g. Everything mother and baby need, in one bundle."
              rows={3}
              className="w-full border border-neutral-200 rounded-md px-4 py-2.5 text-sm focus:outline-none focus:border-burgundy transition-colors resize-none"
            />
          </div>

          <div>
            <label className="block text-[10px] uppercase font-bold tracking-widest text-neutral-500 mb-2">
              Bundle Discount (%)
            </label>
            <input
              type="number"
              min={0}
              max={100}
              value={discountPercent}
              onChange={(e) => setDiscountPercent(Number(e.target.value))}
              className="w-full border border-neutral-200 rounded-md px-4 py-2.5 text-sm focus:outline-none focus:border-burgundy transition-colors"
            />
          </div>

          <div className="flex items-center gap-6">
            <label className="flex items-center gap-2 text-sm text-neutral-700">
              <input
                type="checkbox"
                checked={isFeatured}
                onChange={(e) => setIsFeatured(e.target.checked)}
                className="w-4 h-4 accent-burgundy"
              />
              Featured package
            </label>
            <label className="flex items-center gap-2 text-sm text-neutral-700">
              <input
                type="checkbox"
                checked={isVisible}
                onChange={(e) => setIsVisible(e.target.checked)}
                className="w-4 h-4 accent-burgundy"
              />
              Visible on site
            </label>
          </div>
        </div>

        <div className="bg-white border border-neutral-200 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xs font-bold uppercase tracking-widest text-neutral-500">
              Package Items
            </h2>
            <button
              type="button"
              onClick={addItemRow}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-burgundy hover:opacity-80"
            >
              <Plus className="w-3.5 h-3.5" /> Add Item
            </button>
          </div>

          <div className="space-y-4">
            {items.map((item) => (
              <div
                key={item.id}
                className="border border-neutral-200 rounded-md p-4 flex gap-3 items-start"
              >
                {item.imageUrl && (
                  <img
                    src={item.imageUrl}
                    alt=""
                    className="w-14 h-14 object-cover rounded border border-neutral-200 shrink-0"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = "none";
                    }}
                  />
                )}
                <div className="flex-1 grid grid-cols-1 sm:grid-cols-[2fr_2fr_1fr] gap-2">
                  <input
                    type="text"
                    placeholder="Item name (e.g. Baby Blanket)"
                    value={item.name}
                    onChange={(e) => updateItem(item.id, "name", e.target.value)}
                    className="border border-neutral-200 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-burgundy"
                  />
                  <input
                    type="text"
                    placeholder="Image URL"
                    value={item.imageUrl}
                    onChange={(e) => updateItem(item.id, "imageUrl", e.target.value)}
                    className="border border-neutral-200 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-burgundy"
                  />
                  <input
                    type="number"
                    placeholder="Price"
                    value={item.price || ""}
                    onChange={(e) => updateItem(item.id, "price", Number(e.target.value))}
                    className="border border-neutral-200 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-burgundy"
                  />
                </div>
                {items.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeItemRow(item.id)}
                    className="p-2 text-neutral-400 hover:text-red-600 transition-colors shrink-0"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}
          </div>

          {validItems.length > 0 && (
            <div className="mt-4 bg-neutral-50 border border-neutral-200 rounded-md p-4 flex items-center justify-between text-sm">
              <span className="text-neutral-600">{validItems.length} valid items</span>
              <div className="text-right">
                {discountPercent > 0 && (
                  <p className="text-xs text-neutral-400 line-through">
                    Ksh {bundleTotal.toLocaleString()}
                  </p>
                )}
                <p className="font-bold text-emerald-600">
                  Ksh {discountedTotal.toLocaleString()}
                </p>
              </div>
            </div>
          )}
        </div>

        <button
          type="submit"
          disabled={saving}
          className="w-full py-3.5 bg-burgundy text-white hover:opacity-90 text-xs font-bold tracking-widest uppercase rounded-md transition-all flex items-center justify-center gap-2 disabled:opacity-50"
        >
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : "Create Package"}
        </button>
      </form>
    </div>
  );
}