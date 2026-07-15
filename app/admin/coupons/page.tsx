"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import DataTable, { Column } from "@/components/admin/DataTable";
import { fetchCoupons, setCouponActive, deleteCoupon, Coupon } from "@/lib/firebase/coupons";
import { Trash2, Plus } from "lucide-react";

export default function AdminCouponsPage() {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCoupons().then((data) => {
      setCoupons(data);
      setLoading(false);
    });
  }, []);

  const handleToggleActive = async (id: string, active: boolean) => {
    setCoupons((prev) => prev.map((c) => (c.id === id ? { ...c, active } : c)));
    const ok = await setCouponActive(id, active);
    if (!ok) fetchCoupons().then(setCoupons);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this coupon? This cannot be undone.")) return;
    const ok = await deleteCoupon(id);
    if (ok) setCoupons((prev) => prev.filter((c) => c.id !== id));
  };

  const columns: Column<Coupon>[] = [
    { header: "Code", accessor: (c) => <span className="font-mono font-semibold">{c.code}</span> },
    {
      header: "Discount",
      accessor: (c) =>
        c.discountType === "percentage" ? `${c.discountValue}% off` : `KES ${c.discountValue} off`,
    },
    {
      header: "Status",
      accessor: (c) => (
        <button
          onClick={() => handleToggleActive(c.id, !c.active)}
          className={`text-xs font-semibold uppercase tracking-wide px-2 py-1 rounded border ${
            c.active
              ? "bg-emerald-50 text-emerald-700 border-emerald-200"
              : "bg-neutral-50 text-charcoal/50 border-neutral-200"
          }`}
        >
          {c.active ? "Active" : "Inactive"}
        </button>
      ),
    },
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-serif text-2xl font-bold text-charcoal">Coupons</h1>
        <Link
          href="/admin/coupons/new"
          className="inline-flex items-center gap-2 bg-charcoal text-white text-xs font-bold uppercase tracking-widest px-4 py-2.5 rounded hover:bg-neutral-800 transition-colors"
        >
          <Plus className="w-4 h-4" /> Add Coupon
        </Link>
      </div>

      <DataTable
        data={coupons}
        columns={columns}
        loading={loading}
        getRowId={(c) => c.id}
        emptyMessage="No coupons yet."
        actions={(c) => (
          <button onClick={() => handleDelete(c.id)} className="p-1.5 hover:bg-red-50 rounded" title="Delete">
            <Trash2 className="w-4 h-4 text-red-500" />
          </button>
        )}
      />
    </div>
  );
}