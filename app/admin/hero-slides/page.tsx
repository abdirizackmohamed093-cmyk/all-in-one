"use client";
import React, { useEffect, useState } from "react";
import {
  fetchHeroSlides,
  addHeroSlide,
  updateHeroSlide,
  deleteHeroSlide,
  HeroSlide,
} from "@/lib/firebase/heroSlides";
import { fetchCategories, Category } from "@/lib/firebase/categories";

const EMPTY_FORM = {
  title: "",
  subtitle: "",
  ctaLabel: "",
  ctaHref: "",
  imageUrl: "",
  order: 0,
  visible: true,
};

export default function HeroSlidesAdminPage() {
  const [slides, setSlides] = useState<HeroSlide[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(EMPTY_FORM);
  const [editingId, setEditingId] = useState<string | null>(null);

  async function loadSlides() {
    setLoading(true);
    const data = await fetchHeroSlides();
    setSlides(data);
    setLoading(false);
  }

  useEffect(() => {
    loadSlides();
    fetchCategories().then(setCategories);
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (editingId) {
      await updateHeroSlide(editingId, form);
    } else {
      await addHeroSlide(form);
    }
    setForm(EMPTY_FORM);
    setEditingId(null);
    await loadSlides();
  }

  function startEdit(slide: HeroSlide) {
    setEditingId(slide.id);
    setForm({
      title: slide.title,
      subtitle: slide.subtitle,
      ctaLabel: slide.ctaLabel,
      ctaHref: slide.ctaHref,
      imageUrl: slide.imageUrl,
      order: slide.order,
      visible: slide.visible,
    });
  }

  async function handleDelete(id: string) {
    await deleteHeroSlide(id);
    await loadSlides();
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-10">
      <h1 className="text-2xl font-bold mb-6">Hero Slides</h1>

      <form onSubmit={handleSubmit} className="space-y-4 border border-neutral-200 rounded p-4 mb-10">
        <input
          className="w-full border rounded px-3 py-2"
          placeholder="Title"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          required
        />
        <input
          className="w-full border rounded px-3 py-2"
          placeholder="Subtitle"
          value={form.subtitle}
          onChange={(e) => setForm({ ...form, subtitle: e.target.value })}
        />
        <input
          className="w-full border rounded px-3 py-2"
          placeholder="CTA Label"
          value={form.ctaLabel}
          onChange={(e) => setForm({ ...form, ctaLabel: e.target.value })}
        />

        <div>
          <label className="block text-xs text-neutral-500 mb-1">
            Link to Category (fills CTA Href automatically)
          </label>
          <select
            className="w-full border rounded px-3 py-2 mb-2"
            defaultValue=""
            onChange={(e) => {
              if (e.target.value) {
                setForm({ ...form, ctaHref: `/shop/${e.target.value}` });
              }
            }}
          >
            <option value="">— Select a category —</option>
            {categories.map((c) => (
              <option key={c.id} value={c.slug}>
                {c.name}
              </option>
            ))}
          </select>
          <input
            className="w-full border rounded px-3 py-2"
            placeholder="CTA Href (auto-filled, or type your own e.g. /packages)"
            value={form.ctaHref}
            onChange={(e) => setForm({ ...form, ctaHref: e.target.value })}
          />
        </div>

        <input
          className="w-full border rounded px-3 py-2"
          placeholder="Image URL"
          value={form.imageUrl}
          onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
        />
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
          {editingId ? "Update Slide" : "Add Slide"}
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
        <p className="text-sm text-neutral-500">Loading slides...</p>
      ) : slides.length === 0 ? (
        <p className="text-sm text-neutral-500">No slides yet.</p>
      ) : (
        <div className="space-y-3">
          {slides.map((slide) => (
            <div
              key={slide.id}
              className="flex items-center justify-between border border-neutral-200 rounded px-4 py-3"
            >
              <div>
                <p className="font-medium">{slide.title}</p>
                <p className="text-xs text-neutral-500">
                  order: {slide.order} · {slide.visible ? "visible" : "hidden"} · links to: {slide.ctaHref}
                </p>
              </div>
              <div className="flex gap-3 text-sm">
                <button onClick={() => startEdit(slide)} className="text-blue-600">
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(slide.id)}
                  className="text-red-600"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}