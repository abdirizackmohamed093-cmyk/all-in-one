"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { addCoupon, DiscountType } from "@/lib/firebase/coupons";
import { ArrowLeft, Loader2, Plus } from "lucide-react";

export default function NewCouponPage() {
  const router = useRouter();
  const [code, setCode] = useState("");
  const [discountType, setDiscountType] = useState<DiscountType>("percentage");
  const [discountValue, setDiscountValue] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const parsedValue = Number(discountValue);
    if (!code.trim()) {
      setError("Coupon code is required.");
      return;
    }
    if (isNaN(parsedValue) || parsedValue <= 0) {
      setError("Discount value must be a positive number.");
      return;
    }
    if (discountType === "percentage" && parsedValue > 100) {
      setError("Percentage discount can't exceed 100.");
      return;
    }

    setSaving(true);
    const id = await addCoupon(code, discountType, parsedValue);
    setSaving(false);

    if (id) {
      router.push("/admin/coupons");
    } else {
      setError("Failed to save coupon. Check the console for details.");
    }
  };

  return (
    <div className="max-w-md">
      <Link
        href="/admin/coupons"
        className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-charcoal/60 hover:text-charcoal mb-6"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Coupons
      </Link>

      <h1 className="font-serif text-2xl font-bold text-charcoal mb-6">Add New Coupon</h1>

      {error && (
        <div className="mb-6 p-3 bg-red-50 border border-red-200 text-red-600 text-xs rounded font-medium">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5 border border-neutral-200 rounded-md p-6">
        <div>
          <label className="block text-[10px] uppercase font-bold tracking-widest text-neutral-500 mb-2">
            Coupon Code
          </label>
          <input
            type="text"
            required
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="e.g. SAVE10"
            className="w-full border border-neutral-200 rounded px-4 py-2.5 text-sm font-mono uppercase focus:outline-none focus:border-burgundy transition-colors"
          />
        </div>

        <div>
          <label className="block text-[10px] uppercase font-bold tracking-widest text-neutral-500 mb-2">
            Discount Type
          </label>
          <select
            value={discountType}
            onChange={(e) => setDiscountType(e.target.value as DiscountType)}
            className="w-full border border-neutral-200 rounded px-4 py-2.5 text-sm focus:outline-none focus:border-burgundy transition-colors bg-white"
          >
            <option value="percentage">Percentage off (%)</option>
            <option value="fixed">Fixed amount off (KES)</option>
          </select>
        </div>

        <div>
          <label className="block text-[10px] uppercase font-bold tracking-widest text-neutral-500 mb-2">
            Discount Value
          </label>
          <input
            type="number"
            required
            min="0"
            step="0.01"
            value={discountValue}
            onChange={(e) => setDiscountValue(e.target.value)}
            placeholder={discountType === "percentage" ? "e.g. 10" : "e.g. 500"}
            className="w-full border border-neutral-200 rounded px-4 py-2.5 text-sm focus:outline-none focus:border-burgundy transition-colors"
          />
        </div>

        <button
          type="submit"
          disabled={saving}
          className="w-full py-3.5 bg-charcoal text-white hover:bg-neutral-800 text-xs font-bold tracking-widest uppercase rounded transition-all flex items-center justify-center gap-2 disabled:opacity-50"
        >
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <><Plus className="w-4 h-4" /> Save Coupon</>}
        </button>
      </form>
    </div>
  );
}