"use client";
import React, { useEffect, useState } from "react";
import {
  fetchCategoryTiles,
  addCategoryTile,
  updateCategoryTile,
  deleteCategoryTile,
  CategoryTile,
} from "@/lib/firebase/categoryTiles";

const EMPTY_FORM = {
  label: "",
  imageUrl: "",
  href: "",
  linkLabel: "Discover more",
  order: 0,
  visible: true,
};

export default function CategoryTilesAdminPage() {
  const [tiles, setTiles] = useState<CategoryTile[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(EMPTY_FORM);
  const [editingId, setEditingId] = useState<string | null>(null);

  async function loadTiles() {
    setLoading(true);
    const data = await fetchCategoryTiles();
    setTiles(data);
    setLoading(false);
  }

  useEffect(() => {
    loadTiles();
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (editingId) {
      await updateCategoryTile(editingId, form);
    } else {
      await addCategoryTile(form);
    }
    setForm(EMPTY_FORM);
    setEditingId(null);
    await loadTiles();
  }

  function startEdit(tile: CategoryTile) {
    setEditingId(tile.id);
    setForm({
      label: tile.label ?? "",
      imageUrl: tile.imageUrl ?? "",
      href: tile.href ?? "",
      linkLabel: tile.linkLabel ?? "Discover more",
      order: tile.order ?? 0,
      visible: tile.visible ?? true,
    });
  }

  async function handleDelete(id: string) {
    await deleteCategoryTile(id);
    await loadTiles();
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-10">
      <h1 className="text-2xl font-bold mb-6">Category Tiles</h1>

      <form onSubmit={handleSubmit} className="space-y-4 border border-neutral-200 rounded p-4 mb-10">
        <input
          className="w-full border rounded px-3 py-2"
          placeholder="Label (e.g. Best Pick for Boys)"
          value={form.label}
          onChange={(e) => setForm({ ...form, label: e.target.value })}
          required
        />
        <input
          className="w-full border rounded px-3 py-2"
          placeholder="Image URL"
          value={form.imageUrl}
          onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
        />
        <input
          className="w-full border rounded px-3 py-2"
          placeholder="Link (e.g. /shop/mens-wear)"
          value={form.href}
          onChange={(e) => setForm({ ...form, href: e.target.value })}
        />
        <input
          className="w-full border rounded px-3 py-2"
          placeholder="Link text (e.g. Discover more)"
          value={form.linkLabel}
          onChange={(e) => setForm({ ...form, linkLabel: e.target.value })}
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
          {editingId ? "Update Tile" : "Add Tile"}
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
      ) : tiles.length === 0 ? (
        <p className="text-sm text-neutral-500">No tiles yet.</p>
      ) : (
        <div className="space-y-3">
          {tiles.map((tile) => (
            <div
              key={tile.id}
              className="flex items-center justify-between border border-neutral-200 rounded px-4 py-3"
            >
              <div className="flex items-center gap-3">
                <img
                  src={tile.imageUrl || "/placeholder-product.jpg"}
                  alt={tile.label}
                  className="w-10 h-10 object-cover rounded border"
                />
                <div>
                  <p className="font-medium">{tile.label}</p>
                  <p className="text-xs text-neutral-500">
                    order: {tile.order} - {tile.visible ? "visible" : "hidden"} - {tile.href}
                  </p>
                </div>
              </div>
              <div className="flex gap-3 text-sm">
                <button onClick={() => startEdit(tile)} className="text-blue-600">
                  Edit
                </button>
                <button onClick={() => handleDelete(tile.id)} className="text-red-600">
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