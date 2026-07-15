"use client";

import { useEffect, useState } from "react";
import { fetchLiveProducts } from "@/lib/firebase/products";
import { fetchCategories } from "@/lib/firebase/categories";
import { fetchBrands } from "@/lib/firebase/brands";
import { fetchCustomers } from "@/lib/firebase/customers";
import { fetchCoupons } from "@/lib/firebase/coupons";

interface Stats {
  products: number;
  categories: number;
  brands: number;
  customers: number;
  activeCoupons: number;
  totalCoupons: number;
}

export default function ReportsPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStats() {
      try {
        const [products, categories, brands, customers, coupons] =
          await Promise.all([
            fetchLiveProducts(),
            fetchCategories(),
            fetchBrands(),
            fetchCustomers(),
            fetchCoupons(),
          ]);

        setStats({
          products: products.length,
          categories: categories.length,
          brands: brands.length,
          customers: customers.length,
          activeCoupons: coupons.filter((c: any) => c.active).length,
          totalCoupons: coupons.length,
        });
      } catch (err) {
        console.error("Failed to load report stats:", err);
      } finally {
        setLoading(false);
      }
    }

    loadStats();
  }, []);

  const cards = stats
    ? [
        { label: "Total Products", value: stats.products },
        { label: "Total Categories", value: stats.categories },
        { label: "Total Brands", value: stats.brands },
        { label: "Total Customers", value: stats.customers },
        {
          label: "Active Coupons",
          value: `${stats.activeCoupons} / ${stats.totalCoupons}`,
        },
      ]
    : [];

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Reports</h1>

      {loading ? (
        <p className="text-muted-foreground">Loading stats...</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {cards.map((card) => (
            <div
              key={card.label}
              className="bg-white border rounded-lg p-6 shadow-sm"
            >
              <p className="text-sm text-muted-foreground">{card.label}</p>
              <p className="text-3xl font-bold mt-2">{card.value}</p>
            </div>
          ))}
        </div>
      )}

      <div className="mt-8 bg-white border rounded-lg p-6 shadow-sm">
        <p className="font-semibold">Sales & Revenue Reports</p>
        <p className="text-sm text-muted-foreground mt-1">
          Coming once Checkout and Orders creation are built — there's no
          real order data to report on yet.
        </p>
      </div>
    </div>
  );
}