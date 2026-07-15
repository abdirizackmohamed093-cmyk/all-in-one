"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import DataTable, { Column } from "@/components/admin/DataTable";
import { fetchLiveProducts, deleteProduct } from "@/lib/firebase/products";
import { Product } from "@/components/products/ProductCard";
import { Pencil, Trash2 } from "lucide-react";

// Same formatting as the storefront's ProductCard, kept consistent so admins
// see the exact price shoppers see — no unit confusion between screens.
const formatCurrency = (amount: number) =>
  new Intl.NumberFormat("en-KE", {
    style: "currency",
    currency: "KES",
    minimumFractionDigits: 0,
  }).format(amount);

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLiveProducts().then((data) => {
      setProducts(data);
      setLoading(false);
    });
  }, []);

  const handleDelete = async (id: string) => {
    // Confirm before a hard delete — there's no undo once this fires.
    if (!confirm("Delete this product? This cannot be undone.")) return;

    const ok = await deleteProduct(id);
    if (ok) setProducts((prev) => prev.filter((p) => p.id !== id));
  };

  const columns: Column<Product>[] = [
    {
      header: "Image",
      accessor: (p) => (
        <div className="relative w-10 h-10 rounded overflow-hidden bg-neutral-100 border border-neutral-200">
          <Image
            src={p.imageUrl || "/placeholder-product.jpg"}
            alt={p.name}
            fill
            className="object-cover"
            sizes="40px"
          />
        </div>
      ),
    },
    { header: "Name", accessor: "name" },
    { header: "Category", accessor: "category" },
    {
      header: "Price",
      accessor: (p) => formatCurrency(p.price),
    },
    {
      header: "Stock",
      accessor: (p) => (
        <span
          className={
            p.stockCount === 0
              ? "text-red-600 font-medium"
              : p.stockCount <= 3
              ? "text-amber-600 font-medium"
              : "text-charcoal"
          }
        >
          {p.stockCount === 0 ? "Sold Out" : p.stockCount}
        </span>
      ),
    },
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-serif text-2xl font-bold text-charcoal">
          Products
        </h1>
      </div>

      <DataTable
        data={products}
        columns={columns}
        loading={loading}
        getRowId={(p) => p.id}
        emptyMessage="No products in the catalog yet."
        actions={(p) => (
          <>
            <button className="p-1.5 hover:bg-neutral-100 rounded" title="Edit">
              <Pencil className="w-4 h-4 text-charcoal/60" />
            </button>
            <button
              onClick={() => handleDelete(p.id)}
              className="p-1.5 hover:bg-red-50 rounded"
              title="Delete"
            >
              <Trash2 className="w-4 h-4 text-red-500" />
            </button>
          </>
        )}
      />
    </div>
  );
}