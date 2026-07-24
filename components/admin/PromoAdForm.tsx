"use client";

import { useState } from "react";
import { Loader2, Check, Plus, X } from "lucide-react";
import { PromoPopup, emptyAd } from "@/lib/firebase/ads";

const BADGE_PRESETS = ["Featured Package", "Limited Offer", "Best Seller", "New Arrival"];

interface PromoAdFormProps {
  initialData?: PromoPopup;
  onSave: (data: Omit<PromoPopup, "id">) => Promise<boolean>;
  submitLabel: string;
}

export default function PromoAdForm({ initialData, onSave, submitLabel }: PromoAdFormProps) {
  const [form, setForm] = useState<Omit<PromoPopup, "id">>(initialData ? { ...initialData } : { ...emptyAd });
  const [benefitInput, setBenefitInput] = useState("");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  const addBenefit = () => {
    const trimmed = benefitInput.trim();
    if (!trimmed) return;
    setForm((f) => ({ ...f, benefits: [...(f.benefits || []), trimmed] }));
    setBenefitInput("");
  };

  const removeBenefit = (index: number) => {
    setForm((f) => ({ ...f, benefits: f.benefits.filter((_, i) => i !== index) }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!form.imageUrl.trim() || !form.title.trim()) {
      setError("Add an image and a title for this campaign.");
      return;
    }

    setSaving(true);
    const ok = await onSave({
      ...form,
      title: form.title.trim(),
      description: form.description?.trim() || "",
      imageUrl: form.imageUrl.trim(),
      ctaHref: form.ctaHref.trim(),
      secondaryCtaHref: form.secondaryCtaHref?.trim() || "",
    });
    setSaving(false);

    if (ok) {
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } else {
      setError("Failed to save. Please try again.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="p-3 bg-red-50 border border-red-200 text-red-600 text-xs rounded font-medium">
          {error}
        </div>
      )}

      <div className="bg-white border border-neutral-200 rounded-lg p-6 space-y-5">
        <label className="flex items-center gap-3 text-sm font-semibold text-neutral-800">
          <input
            type="checkbox"
            checked={form.isActive}
            onChange={(e) => setForm((f) => ({ ...f, isActive: e.target.checked }))}
            className="w-4 h-4 accent-burgundy"
          />
          Make this the active campaign (visitors will see it)
        </label>

        <div>
          <label className="block text-[10px] uppercase font-bold tracking-widest text-neutral-500 mb-2">
            Hero Image URL
          </label>
          <input
            type="text"
            value={form.imageUrl}
            onChange={(e) => setForm((f) => ({ ...f, imageUrl: e.target.value }))}
            placeholder="https://..."
            className="w-full border border-neutral-200 rounded-md px-4 py-2.5 text-sm focus:outline-none focus:border-burgundy transition-colors"
          />
          {form.imageUrl && (
            <img
              src={form.imageUrl}
              alt=""
              className="mt-3 w-full aspect-[4/3] object-cover rounded-lg border border-neutral-200"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = "none";
              }}
            />
          )}
          <p className="text-xs text-neutral-400 mt-1.5">
            Landscape lifestyle image works best (4:3 ratio).
          </p>
        </div>

        <div>
          <label className="block text-[10px] uppercase font-bold tracking-widest text-neutral-500 mb-2">
            Badge
          </label>
          <div className="flex flex-wrap gap-2 mb-2">
            {BADGE_PRESETS.map((preset) => (
              <button
                key={preset}
                type="button"
                onClick={() => setForm((f) => ({ ...f, badge: preset }))}
                className={`px-3 py-1.5 rounded-md border text-xs font-semibold transition-colors ${
                  form.badge === preset
                    ? "border-burgundy bg-burgundy/5 text-burgundy"
                    : "border-neutral-200 text-neutral-600 hover:bg-neutral-50"
                }`}
              >
                {preset}
              </button>
            ))}
          </div>
          <input
            type="text"
            value={form.badge}
            onChange={(e) => setForm((f) => ({ ...f, badge: e.target.value }))}
            placeholder="Or type a custom badge..."
            className="w-full border border-neutral-200 rounded-md px-4 py-2.5 text-sm focus:outline-none focus:border-burgundy transition-colors"
          />
        </div>

        <div>
          <label className="block text-[10px] uppercase font-bold tracking-widest text-neutral-500 mb-2">
            Title
          </label>
          <input
            type="text"
            value={form.title}
            onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
            placeholder="e.g. Complete Maternity Essentials"
            className="w-full border border-neutral-200 rounded-md px-4 py-2.5 text-sm focus:outline-none focus:border-burgundy transition-colors"
          />
        </div>

        <div>
          <label className="block text-[10px] uppercase font-bold tracking-widest text-neutral-500 mb-2">
            Description
          </label>
          <textarea
            value={form.description}
            onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
            placeholder="e.g. Everything an expecting mother needs in one convenient bundle."
            rows={3}
            className="w-full border border-neutral-200 rounded-md px-4 py-2.5 text-sm focus:outline-none focus:border-burgundy transition-colors resize-none"
          />
        </div>

        <div>
          <label className="block text-[10px] uppercase font-bold tracking-widest text-neutral-500 mb-2">
            Key Benefits
          </label>
          <div className="flex gap-2 mb-2">
            <input
              type="text"
              value={benefitInput}
              onChange={(e) => setBenefitInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  addBenefit();
                }
              }}
              placeholder="e.g. Free Delivery"
              className="flex-1 border border-neutral-200 rounded-md px-4 py-2 text-sm focus:outline-none focus:border-burgundy transition-colors"
            />
            <button
              type="button"
              onClick={addBenefit}
              className="px-3 rounded-md border border-neutral-200 text-neutral-600 hover:bg-neutral-50 transition-colors"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
          {form.benefits.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {form.benefits.map((benefit, i) => (
                <span
                  key={i}
                  className="inline-flex items-center gap-1.5 bg-neutral-50 border border-neutral-200 rounded-full px-3 py-1 text-xs text-neutral-700"
                >
                  {benefit}
                  <button type="button" onClick={() => removeBenefit(i)}>
                    <X className="w-3 h-3 text-neutral-400 hover:text-red-600" />
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-[10px] uppercase font-bold tracking-widest text-neutral-500 mb-2">
              Original Price (Ksh)
            </label>
            <input
              type="number"
              value={form.originalPrice ?? ""}
              onChange={(e) =>
                setForm((f) => ({ ...f, originalPrice: e.target.value ? Number(e.target.value) : undefined }))
              }
              className="w-full border border-neutral-200 rounded-md px-4 py-2.5 text-sm focus:outline-none focus:border-burgundy transition-colors"
            />
          </div>
          <div>
            <label className="block text-[10px] uppercase font-bold tracking-widest text-neutral-500 mb-2">
              Sale Price (Ksh)
            </label>
            <input
              type="number"
              value={form.salePrice ?? ""}
              onChange={(e) =>
                setForm((f) => ({ ...f, salePrice: e.target.value ? Number(e.target.value) : undefined }))
              }
              className="w-full border border-neutral-200 rounded-md px-4 py-2.5 text-sm focus:outline-none focus:border-burgundy transition-colors"
            />
          </div>
        </div>

        <div>
          <label className="block text-[10px] uppercase font-bold tracking-widest text-neutral-500 mb-2">
            Offer Ends (optional countdown)
          </label>
          <input
            type="datetime-local"
            value={form.endsAt ? form.endsAt.slice(0, 16) : ""}
            onChange={(e) =>
              setForm((f) => ({ ...f, endsAt: e.target.value ? new Date(e.target.value).toISOString() : "" }))
            }
            className="w-full border border-neutral-200 rounded-md px-4 py-2.5 text-sm focus:outline-none focus:border-burgundy transition-colors"
          />
          <p className="text-xs text-neutral-400 mt-1.5">
            Leave blank to hide the countdown timer.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-[10px] uppercase font-bold tracking-widest text-neutral-500 mb-2">
              Primary Button Label
            </label>
            <input
              type="text"
              value={form.ctaLabel}
              onChange={(e) => setForm((f) => ({ ...f, ctaLabel: e.target.value }))}
              placeholder="e.g. Shop Package"
              className="w-full border border-neutral-200 rounded-md px-4 py-2.5 text-sm focus:outline-none focus:border-burgundy transition-colors"
            />
          </div>
          <div>
            <label className="block text-[10px] uppercase font-bold tracking-widest text-neutral-500 mb-2">
              Primary Button Link
            </label>
            <input
              type="text"
              value={form.ctaHref}
              onChange={(e) => setForm((f) => ({ ...f, ctaHref: e.target.value }))}
              placeholder="e.g. /packages/category/maternity"
              className="w-full border border-neutral-200 rounded-md px-4 py-2.5 text-sm focus:outline-none focus:border-burgundy transition-colors"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-[10px] uppercase font-bold tracking-widest text-neutral-500 mb-2">
              Secondary Button Label (optional)
            </label>
            <input
              type="text"
              value={form.secondaryCtaLabel}
              onChange={(e) => setForm((f) => ({ ...f, secondaryCtaLabel: e.target.value }))}
              placeholder="e.g. View Details"
              className="w-full border border-neutral-200 rounded-md px-4 py-2.5 text-sm focus:outline-none focus:border-burgundy transition-colors"
            />
          </div>
          <div>
            <label className="block text-[10px] uppercase font-bold tracking-widest text-neutral-500 mb-2">
              Secondary Button Link
            </label>
            <input
              type="text"
              value={form.secondaryCtaHref}
              onChange={(e) => setForm((f) => ({ ...f, secondaryCtaHref: e.target.value }))}
              placeholder="e.g. /packages/maternity-kit"
              className="w-full border border-neutral-200 rounded-md px-4 py-2.5 text-sm focus:outline-none focus:border-burgundy transition-colors"
            />
          </div>
        </div>

        <div>
          <label className="block text-[10px] uppercase font-bold tracking-widest text-neutral-500 mb-2">
            Accent Color
          </label>
          <div className="flex items-center gap-3">
            <input
              type="color"
              value={form.accentColor || "#7B1E3A"}
              onChange={(e) => setForm((f) => ({ ...f, accentColor: e.target.value }))}
              className="w-12 h-10 rounded-md border border-neutral-200 cursor-pointer"
            />
            <input
              type="text"
              value={form.accentColor || ""}
              onChange={(e) => setForm((f) => ({ ...f, accentColor: e.target.value }))}
              className="flex-1 border border-neutral-200 rounded-md px-4 py-2.5 text-sm focus:outline-none focus:border-burgundy transition-colors"
            />
          </div>
          <p className="text-xs text-neutral-400 mt-1.5">
            Used for the badge, price highlight, and button color — pick a
            tone that matches this campaign (e.g. soft pink for Maternity,
            navy for Campus).
          </p>
        </div>
      </div>

      <button
        type="submit"
        disabled={saving}
        className="w-full py-3.5 bg-burgundy text-white hover:opacity-90 text-xs font-bold tracking-widest uppercase rounded-md transition-all flex items-center justify-center gap-2 disabled:opacity-50"
      >
        {saving ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : saved ? (
          <>
            <Check className="w-4 h-4" /> Saved
          </>
        ) : (
          submitLabel
        )}
      </button>
    </form>
  );
}