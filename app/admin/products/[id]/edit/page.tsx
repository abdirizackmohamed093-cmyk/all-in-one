"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { Timestamp } from "firebase/firestore";
import { fetchSingleProduct, updateProduct } from "@/lib/firebase/products";
import { fetchCategories, Category } from "@/lib/firebase/categories";
import { fetchBrands, Brand } from "@/lib/firebase/brands";
import { ArrowLeft, Loader2, Save, Zap } from "lucide-react";
import Link from "next/link";

// Converts a Date into the "YYYY-MM-DDTHH:mm" format <input type="datetime-local">
// expects, using the browser's local time (not UTC, which toISOString() gives).
function toDatetimeLocalValue(date: Date): string {
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(
    date.getHours()
  )}:${pad(date.getMinutes())}`;
}

export default function EditProductPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [category, setCategory] = useState("");
  const [brand, setBrand] = useState("");
  const [stockCount, setStockCount] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [categories, setCategories] = useState<Category[]>([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);

  const [brands, setBrands] = useState<Brand[]>([]);
  const [brandsLoading, setBrandsLoading] = useState(true);

  const [isFlashSale, setIsFlashSale] = useState(false);
  const [flashSalePrice, setFlashSalePrice] = useState("");
  const [flashSaleEndsAt, setFlashSaleEndsAt] = useState("");

  useEffect(() => {
    fetchCategories().then((data) => {
      setCategories(data);
      setCategoriesLoading(false);
    });
    fetchBrands().then((data) => {
      setBrands(data);
      setBrandsLoading(false);
    });
  }, []);

  useEffect(() => {
    fetchSingleProduct(id).then((product) => {
      if (!product) {
        setNotFound(true);
        setLoading(false);
        return;
      }

      setName(product.name || "");
      setPrice(String(product.price ?? ""));
      setImageUrl(product.imageUrl || "");
      setCategory(product.category || "");
      setBrand((product as any).brand || "");
      setStockCount(String(product.stockCount ?? ""));
      setIsFlashSale(!!product.isFlashSale);
      setFlashSalePrice(
        product.flashSalePrice !== undefined ? String(product.flashSalePrice) : ""
      );
      if (product.flashSaleEndsAt?.toDate) {
        setFlashSaleEndsAt(toDatetimeLocalValue(product.flashSaleEndsAt.toDate()));
      }

      setLoading(false);
    });
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const parsedPrice = Number(price);
    const parsedStock = Number(stockCount);

    if (!name.trim() || !category.trim()) {
      setError("Name and category are required.");
      return;
    }
    if (isNaN(parsedPrice) || parsedPrice < 0) {
      setError("Price must be a valid positive number.");
      return;
    }
    if (isNaN(parsedStock) || parsedStock < 0) {
      setError("Stock must be a valid positive number.");
      return;
    }

    let parsedFlashPrice: number | undefined;
    let parsedFlashEndsAt: Timestamp | undefined;

    if (isFlashSale) {
      parsedFlashPrice = Number(flashSalePrice);
      if (isNaN(parsedFlashPrice) || parsedFlashPrice <= 0) {
        setError("Flash sale price must be a valid positive number.");
        return;
      }
      if (parsedFlashPrice >= parsedPrice) {
        setError("Flash sale price must be lower than the regular price.");
        return;
      }
      if (!flashSaleEndsAt) {
        setError("Flash sale needs an end date/time.");
        return;
      }
      const endsDate = new Date(flashSaleEndsAt);
      parsedFlashEndsAt = Timestamp.fromDate(endsDate);
    }

    setSaving(true);
    const ok = await updateProduct(id, {
      name: name.trim(),
      price: parsedPrice,
      imageUrl: imageUrl.trim(),
      category: category.trim(),
      stockCount: parsedStock,
      isFlashSale: isFlashSale,
      ...(brand.trim() ? { brand: brand.trim() } : {}),
      ...(isFlashSale
        ? { flashSalePrice: parsedFlashPrice, flashSaleEndsAt: parsedFlashEndsAt }
        : { flashSalePrice: undefined, flashSaleEndsAt: undefined }),
    });
    setSaving(false);

    if (ok) {
      router.push("/admin/products");
    } else {
      setError("Failed to save changes. Check the console for details.");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 className="w-6 h-6 animate-spin text-neutral-400" />
      </div>
    );
  }

  if (notFound) {
    return (
      <div className="max-w-2xl">
        <p className="text-sm text-charcoal/60">Product not found.</p>
        <Link href="/admin/products" className="text-sm font-semibold text-burgundy mt-2 inline-block">
          Back to Products
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-2xl">
      <Link
        href="/admin/products"
        className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-charcoal/60 hover:text-charcoal mb-6"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Products
      </Link>

      <h1 className="font-serif text-2xl font-bold text-charcoal mb-6">
        Edit Product
      </h1>

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
            placeholder="Product name"
            className="w-full border border-neutral-200 rounded px-4 py-2.5 text-sm focus:outline-none focus:border-burgundy transition-colors"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-[10px] uppercase font-bold tracking-widest text-neutral-500 mb-2">
              Price (KES)
            </label>
            <input
              type="number"
              required
              min="0"
              step="0.01"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="0"
              className="w-full border border-neutral-200 rounded px-4 py-2.5 text-sm focus:outline-none focus:border-burgundy transition-colors"
            />
          </div>
          <div>
            <label className="block text-[10px] uppercase font-bold tracking-widest text-neutral-500 mb-2">
              Stock Count
            </label>
            <input
              type="number"
              required
              min="0"
              value={stockCount}
              onChange={(e) => setStockCount(e.target.value)}
              placeholder="0"
              className="w-full border border-neutral-200 rounded px-4 py-2.5 text-sm focus:outline-none focus:border-burgundy transition-colors"
            />
          </div>
        </div>

        <div>
          <label className="block text-[10px] uppercase font-bold tracking-widest text-neutral-500 mb-2">
            Image URL
          </label>
          <input
            type="text"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            placeholder="https://..."
            className="w-full border border-neutral-200 rounded px-4 py-2.5 text-sm focus:outline-none focus:border-burgundy transition-colors"
          />
          {imageUrl && (
            <img
              src={imageUrl}
              alt=""
              className="mt-3 w-24 h-24 object-cover rounded border border-neutral-200"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = "none";
              }}
            />
          )}
          <p className="text-[11px] text-charcoal/50 mt-1.5">
            File upload isn't available yet, that requires enabling Firebase Storage's paid tier. Paste a hosted image link for now.
          </p>
        </div>

        <div>
          <label className="block text-[10px] uppercase font-bold tracking-widest text-neutral-500 mb-2">
            Category
          </label>
          {categoriesLoading ? (
            <div className="text-sm text-charcoal/50 py-2.5">Loading categories...</div>
          ) : categories.length === 0 ? (
            <div className="text-sm text-charcoal/60 border border-dashed border-neutral-200 rounded px-4 py-3">
              No categories yet.{" "}
              <Link href="/admin/categories/new" className="text-burgundy underline">
                Create one first
              </Link>
              .
            </div>
          ) : (
            <select
              required
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full border border-neutral-200 rounded px-4 py-2.5 text-sm focus:outline-none focus:border-burgundy transition-colors bg-white"
            >
              <option value="" disabled>
                Select a category
              </option>
              {categories.map((c) => (
                <option key={c.id} value={c.name}>
                  {c.name}
                </option>
              ))}
            </select>
          )}
        </div>

        <div>
          <label className="block text-[10px] uppercase font-bold tracking-widest text-neutral-500 mb-2">
            Brand (optional)
          </label>
          {brandsLoading ? (
            <div className="text-sm text-charcoal/50 py-2.5">Loading brands...</div>
          ) : brands.length === 0 ? (
            <div className="text-sm text-charcoal/60 border border-dashed border-neutral-200 rounded px-4 py-3">
              No brands yet.{" "}
              <Link href="/admin/brands/new" className="text-burgundy underline">
                Create one first
              </Link>
              .
            </div>
          ) : (
            <select
              value={brand}
              onChange={(e) => setBrand(e.target.value)}
              className="w-full border border-neutral-200 rounded px-4 py-2.5 text-sm focus:outline-none focus:border-burgundy transition-colors bg-white"
            >
              <option value="">No brand</option>
              {brands.map((b) => (
                <option key={b.id} value={b.name}>
                  {b.name}
                </option>
              ))}
            </select>
          )}
        </div>

        {/* Flash Sale */}
        <div className="border border-neutral-200 rounded-md p-4">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={isFlashSale}
              onChange={(e) => setIsFlashSale(e.target.checked)}
              className="w-4 h-4 accent-burgundy"
            />
            <span className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-charcoal">
              <Zap className="w-3.5 h-3.5 text-red-600" /> Mark as Flash Sale
            </span>
          </label>

          {isFlashSale && (
            <div className="grid grid-cols-2 gap-4 mt-4">
              <div>
                <label className="block text-[10px] uppercase font-bold tracking-widest text-neutral-500 mb-2">
                  Flash Sale Price (KES)
                </label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={flashSalePrice}
                  onChange={(e) => setFlashSalePrice(e.target.value)}
                  placeholder="Discounted price"
                  className="w-full border border-neutral-200 rounded px-4 py-2.5 text-sm focus:outline-none focus:border-burgundy transition-colors"
                />
              </div>
              <div>
                <label className="block text-[10px] uppercase font-bold tracking-widest text-neutral-500 mb-2">
                  Sale Ends At
                </label>
                <input
                  type="datetime-local"
                  value={flashSaleEndsAt}
                  onChange={(e) => setFlashSaleEndsAt(e.target.value)}
                  className="w-full border border-neutral-200 rounded px-4 py-2.5 text-sm focus:outline-none focus:border-burgundy transition-colors"
                />
              </div>
            </div>
          )}
        </div>

        <button
          type="submit"
          disabled={saving}
          className="w-full py-3.5 bg-charcoal text-white hover:bg-neutral-800 text-xs font-bold tracking-widest uppercase rounded transition-all flex items-center justify-center gap-2 disabled:opacity-50"
        >
          {saving ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <>
              <Save className="w-4 h-4" /> Save Changes
            </>
          )}
        </button>
      </form>
    </div>
  );
}