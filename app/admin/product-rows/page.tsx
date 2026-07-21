"use client";
import React, { useEffect, useState } from "react";
import {
  fetchProductRows,
  addProductRow,
  updateProductRow,
  deleteProductRow,
  ProductRow,
} from "@/lib/firebase/productRows";
import { fetchLiveProducts } from "@/lib/firebase/products";
import { Product } from "@/components/products/ProductCard";

const EMPTY_FORM = {
  title: "",
  productIds: [] as string[],
  order: 0,
  visible: true,
};

export default function ProductRowsAdminPage() {
  const [rows, setRows] = useState<ProductRow[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(EMPTY_FORM);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  async function loadRows() {
    setLoading(true);
    const data = await fetchProductRows();
    setRows(data);
    setLoading(false);
  }

  useEffect(() => {
    loadRows();
    fetchLiveProducts().then(setProducts);
  }, []);

  function toggleProduct(id: string) {
    setForm((f) => {
      const has = f.productIds.includes(id);
      return {
        ...f,
        productIds: has
          ? f.productIds.filter((pid) => pid !== id)
          : [...f.productIds, id],
      };
    });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!editingId) {
      const duplicate = rows.find(
        (r) => r.title.trim().toLowerCase() === form.title.trim().toLowerCase()
      );
      if (duplicate) {
        const proceed = window.confirm(
          `A row titled "${duplicate.title}" already exists with ${duplicate.productIds.length} product(s).\n\n` +
          `Submitting will create a SEPARATE row with the same title instead of adding these products to the existing one.\n\n` +
          `If you meant to add more products to "${duplicate.title}", click Cancel, then click Edit on that row below and check the extra products there.\n\n` +
          `Create a new, separate row anyway?`
        );
        if (!proceed) return;
      }
    }

    if (editingId) {
      await updateProductRow(editingId, form);
    } else {
      await addProductRow(form);
    }
    setForm(EMPTY_FORM);
    setEditingId(null);
    await loadRows();
  }

  function startEdit(row: ProductRow) {
    setEditingId(row.id);
    setForm({
      title: row.title,
      productIds: row.productIds,
      order: row.order,
      visible: row.visible,
    });
  }

  async function handleDelete(id: string) {
    await deleteProductRow(id);
    await loadRows();
  }

  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-4xl mx-auto px-6 py-10">
      <h1 className="text-2xl font-bold mb-6">Product Rows</h1>

      <form onSubmit={handleSubmit} className="space-y-4 border border-neutral-200 rounded p-4 mb-10">
        <input
          className="w-full border rounded px-3 py-2"
          placeholder="Row Title (e.g. Best Sellers in Electronics)"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          required
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

        <div>
          <label className="block text-xs text-neutral-500 mb-1">
            Select Products ({form.productIds.length} selected)
          </label>
          <input
            className="w-full border rounded px-3 py-2 mb-2"
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <div className="max-h-64 overflow-y-auto border rounded divide-y">
            {filteredProducts.map((p) => (
              <label
                key={p.id}
                className="flex items-center gap-3 px-3 py-2 text-sm cursor-pointer hover:bg-neutral-50"
              >
                <input
                  type="checkbox"
                  checked={form.productIds.includes(p.id)}
                  onChange={() => toggleProduct(p.id)}
                />
                <img
                  src={p.imageUrl || "/placeholder-product.jpg"}
                  alt={p.name}
                  className="w-8 h-8 object-cover rounded border"
                />
                <span>{p.name}</span>
                <span className="ml-auto text-xs text-neutral-400">{p.category}</span>
              </label>
            ))}
            {filteredProducts.length === 0 && (
              <p className="text-xs text-neutral-400 px-3 py-4 text-center">
                No products match your search.
              </p>
            )}
          </div>
        </div>

        <button
          type="submit"
          className="bg-neutral-900 text-white px-4 py-2 rounded text-sm"
        >
          {editingId ? "Update Row" : "Add Row"}
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
        <p className="text-sm text-neutral-500">Loading rows...</p>
      ) : rows.length === 0 ? (
        <p className="text-sm text-neutral-500">No product rows yet.</p>
      ) : (
        <div className="space-y-3">
          {rows.map((row) => (
            <div
              key={row.id}
              className="flex items-center justify-between border border-neutral-200 rounded px-4 py-3"
            >
              <div>
                <p className="font-medium">{row.title}</p>
                <p className="text-xs text-neutral-500">
                  order: {row.order} · {row.visible ? "visible" : "hidden"} · {row.productIds.length} products
                </p>
              </div>
              <div className="flex gap-3 text-sm">
                <button onClick={() => startEdit(row)} className="text-blue-600">
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(row.id)}
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