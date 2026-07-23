"use client";
import React, { useEffect, useState } from "react";
import {
  fetchSidePromos,
  addSidePromo,
  updateSidePromo,
  deleteSidePromo,
  SidePromo,
} from "@/lib/firebase/sidePromos";

const ICON_OPTIONS = [
  { label: "WhatsApp / Chat", value: "message-circle" },
  { label: "Phone / Call", value: "phone" },
  { label: "Tag / Discount", value: "tag" },
  { label: "Gift", value: "gift" },
  { label: "Truck / Delivery", value: "truck" },
  { label: "Star / Featured", value: "star" },
  { label: "Zap / Flash Sale", value: "zap" },
  { label: "Sparkles / New", value: "sparkles" },
];

const GRADIENT_OPTIONS = [
  { label: "Emerald -> Teal", value: "from-emerald-600 via-emerald-700 to-teal-800" },
  { label: "Orange -> Red", value: "from-orange-500 via-red-500 to-red-700" },
  { label: "Royal Blue -> Purple", value: "from-blue-600 via-indigo-700 to-purple-800" },
  { label: "Black -> Gold", value: "from-neutral-900 via-neutral-800 to-amber-700" },
  { label: "Rose -> Pink", value: "from-rose-500 via-pink-600 to-fuchsia-700" },
];

const EMPTY_FORM = {
  title: "",
  subtitle: "",
  imageUrl: "",
  href: "",
  ctaLabel: "Shop Now",
  icon: ICON_OPTIONS[0].value,
  gradient: GRADIENT_OPTIONS[0].value,
  countdownEndsAt: "",
  order: 0,
  visible: true,
};

export default function SidePromosAdminPage() {
  const [promos, setPromos] = useState<SidePromo[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(EMPTY_FORM);
  const [editingId, setEditingId] = useState<string | null>(null);

  async function loadPromos() {
    setLoading(true);
    const data = await fetchSidePromos();
    setPromos(data);
    setLoading(false);
  }

  useEffect(() => {
    loadPromos();
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (editingId) {
      await updateSidePromo(editingId, form);
    } else {
      await addSidePromo(form);
    }
    setForm(EMPTY_FORM);
    setEditingId(null);
    await loadPromos();
  }

  function startEdit(promo: SidePromo) {
    setEditingId(promo.id);
    setForm({
      title: promo.title ?? "",
      subtitle: promo.subtitle ?? "",
      imageUrl: promo.imageUrl ?? "",
      href: promo.href ?? "",
      ctaLabel: promo.ctaLabel ?? "Shop Now",
      icon: promo.icon ?? ICON_OPTIONS[0].value,
      gradient: promo.gradient ?? GRADIENT_OPTIONS[0].value,
      countdownEndsAt: promo.countdownEndsAt ?? "",
      order: promo.order ?? 0,
      visible: promo.visible ?? true,
    });
  }

  async function handleDelete(id: string) {
    await deleteSidePromo(id);
    await loadPromos();
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-10">
      <h1 className="text-2xl font-bold mb-6">Side Promo Boxes</h1>
      <p className="text-sm text-neutral-500 mb-6">
        These appear beside the homepage slider as a rotating premium promo carousel.
      </p>

      <form onSubmit={handleSubmit} className="space-y-4 border border-neutral-200 rounded p-4 mb-10">
        <input
          className="w-full border rounded px-3 py-2"
          placeholder="Title (e.g. 10% OFF First Order)"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          required
        />
        <input
          className="w-full border rounded px-3 py-2"
          placeholder="Subtitle (e.g. On your first purchase)"
          value={form.subtitle}
          onChange={(e) => setForm({ ...form, subtitle: e.target.value })}
        />

        <div>
          <label className="block text-xs text-neutral-500 mb-1">
            Image URL (optional — shown behind/beside the text; leave blank to use icon + gradient only)
          </label>
          <input
            className="w-full border rounded px-3 py-2"
            placeholder="https://... or /uploads/promo.jpg"
            value={form.imageUrl ?? ""}
            onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
          />
          {form.imageUrl && (
            <img
              src={form.imageUrl}
              alt="Preview"
              className="mt-2 h-20 w-20 object-cover rounded border border-neutral-200"
            />
          )}
        </div>

        <input
          className="w-full border rounded px-3 py-2"
          placeholder="Link (e.g. /shop/electronics)"
          value={form.href}
          onChange={(e) => setForm({ ...form, href: e.target.value })}
        />
        <input
          className="w-full border rounded px-3 py-2"
          placeholder="CTA Button Text (e.g. Shop Now)"
          value={form.ctaLabel}
          onChange={(e) => setForm({ ...form, ctaLabel: e.target.value })}
        />

        <div>
          <label className="block text-xs text-neutral-500 mb-1">Icon</label>
          <select
            className="w-full border rounded px-3 py-2"
            value={form.icon}
            onChange={(e) => setForm({ ...form, icon: e.target.value })}
          >
            {ICON_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs text-neutral-500 mb-1">Gradient Style</label>
          <select
            className="w-full border rounded px-3 py-2"
            value={form.gradient}
            onChange={(e) => setForm({ ...form, gradient: e.target.value })}
          >
            {GRADIENT_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs text-neutral-500 mb-1">
            Countdown Ends At (optional — leave blank for no countdown)
          </label>
          <input
            type="datetime-local"
            className="w-full border rounded px-3 py-2"
            value={form.countdownEndsAt}
            onChange={(e) => setForm({ ...form, countdownEndsAt: e.target.value })}
          />
        </div>

        <input
          type="number"
          className="w-full border rounded px-3 py-2"
          placeholder="Order"
          value={form.order}
          onChange={(e) => setForm({ ...form, order: Number(e.target.value) })}
        />
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={form.visible}
            onChange={(e) => setForm({ ...form, visible: e.target.checked })}
          />
          Visible
        </label>
        <button
          type="submit"
          className="bg-neutral-900 text-white px-4 py-2 rounded text-sm"
        >
          {editingId ? "Update Promo" : "Add Promo"}
        </button>
        {editingId && (
          <button
            type="button"
            className="ml-2 text-sm text-neutral-500"
            onClick={() => {
              setEditingId(null);
              setForm(EMPTY_FORM);
            }}
          >
            Cancel edit
          </button>
        )}
      </form>

      {loading ? (
        <p className="text-sm text-neutral-500">Loading...</p>
      ) : promos.length === 0 ? (
        <p className="text-sm text-neutral-500">No side promos yet.</p>
      ) : (
        <div className="space-y-3">
          {promos.map((promo) => (
            <div
              key={promo.id}
              className="flex items-center justify-between border border-neutral-200 rounded px-4 py-3"
            >
              {promo.imageUrl ? (
                <img
                  src={promo.imageUrl}
                  alt={promo.title}
                  className="w-8 h-8 rounded object-cover"
                />
              ) : (
                <div className={`w-8 h-8 rounded bg-gradient-to-br ${promo.gradient}`} />
              )}
              <div className="flex-1 ml-3">
                <p className="font-medium">{promo.title}</p>
                <p className="text-xs text-neutral-500">
                  order: {promo.order} - {promo.visible ? "visible" : "hidden"}
                </p>
              </div>
              <div className="flex gap-3 text-sm">
                <button onClick={() => startEdit(promo)} className="text-blue-600">Edit</button>
                <button onClick={() => handleDelete(promo.id)} className="text-red-600">Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}