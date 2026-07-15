"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { fetchOrders, Order, OrderStatus } from "@/lib/firebase/orders";
import { fetchCustomers } from "@/lib/firebase/customers";
import { Loader2, TrendingUp, TrendingDown, ShoppingBag, Users, Wallet } from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  CartesianGrid,
} from "recharts";

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat("en-KE", {
    style: "currency",
    currency: "KES",
    minimumFractionDigits: 0,
  }).format(amount);

const toDate = (createdAt: any): Date | null => {
  if (!createdAt) return null;
  try {
    const date =
      typeof createdAt?.toDate === "function" ? createdAt.toDate() : new Date(createdAt);
    return isNaN(date.getTime()) ? null : date;
  } catch {
    return null;
  }
};

const statusColors: Record<OrderStatus, string> = {
  Processing: "#F59E0B",
  Dispatched: "#3B82F6",
  Delivered: "#10B981",
  Cancelled: "#EF4444",
};

const statusBadgeStyles: Record<OrderStatus, string> = {
  Processing: "bg-amber-50 text-amber-700 border-amber-200",
  Dispatched: "bg-blue-50 text-blue-700 border-blue-200",
  Delivered: "bg-emerald-50 text-emerald-700 border-emerald-200",
  Cancelled: "bg-red-50 text-red-700 border-red-200",
};

function TrendBadge({ value }: { value: number | null }) {
  if (value === null) {
    return <span className="text-[11px] text-neutral-400">No prior data yet</span>;
  }
  const isUp = value >= 0;
  return (
    <span
      className={`inline-flex items-center gap-1 text-[11px] font-semibold ${
        isUp ? "text-emerald-600" : "text-red-500"
      }`}
    >
      {isUp ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
      {isUp ? "+" : ""}
      {value.toFixed(1)}% vs last month
    </span>
  );
}

export default function AdminDashboardPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [customerCount, setCustomerCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([fetchOrders(), fetchCustomers()]).then(([orderData, customerData]) => {
      setOrders(orderData);
      setCustomerCount(customerData.length);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 className="w-5 h-5 animate-spin text-blue-500" />
      </div>
    );
  }

  const nonCancelled = orders.filter((o) => o.status !== "Cancelled");
  const grossRevenue = nonCancelled.reduce((sum, o) => sum + (o.total || 0), 0);
  const avgOrderValue = nonCancelled.length > 0 ? grossRevenue / nonCancelled.length : 0;

  const now = new Date();
  const startOfThisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);

  const thisMonthOrders = nonCancelled.filter((o) => {
    const d = toDate(o.createdAt);
    return d && d >= startOfThisMonth;
  });
  const lastMonthOrders = nonCancelled.filter((o) => {
    const d = toDate(o.createdAt);
    return d && d >= startOfLastMonth && d < startOfThisMonth;
  });

  const thisMonthRevenue = thisMonthOrders.reduce((sum, o) => sum + (o.total || 0), 0);
  const lastMonthRevenue = lastMonthOrders.reduce((sum, o) => sum + (o.total || 0), 0);
  const revenueTrend =
    lastMonthRevenue > 0 ? ((thisMonthRevenue - lastMonthRevenue) / lastMonthRevenue) * 100 : null;

  const orderCountTrend =
    lastMonthOrders.length > 0
      ? ((thisMonthOrders.length - lastMonthOrders.length) / lastMonthOrders.length) * 100
      : null;

  const activeOrders = orders.filter(
    (o) => o.status === "Processing" || o.status === "Dispatched"
  ).length;

  // Last 7 days revenue trend
  const last7Days = Array.from({ length: 7 }).map((_, i) => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    d.setDate(d.getDate() - (6 - i));
    return d;
  });
  const trendData = last7Days.map((day) => {
    const nextDay = new Date(day);
    nextDay.setDate(day.getDate() + 1);
    const dayRevenue = nonCancelled
      .filter((o) => {
        const d = toDate(o.createdAt);
        return d && d >= day && d < nextDay;
      })
      .reduce((sum, o) => sum + (o.total || 0), 0);
    return {
      label: day.toLocaleDateString("en-KE", { weekday: "short" }),
      revenue: dayRevenue,
    };
  });

  // Status distribution
  const statusCounts: Record<OrderStatus, number> = {
    Processing: 0,
    Dispatched: 0,
    Delivered: 0,
    Cancelled: 0,
  };
  orders.forEach((o) => {
    statusCounts[o.status] = (statusCounts[o.status] || 0) + 1;
  });
  const statusData = (Object.keys(statusCounts) as OrderStatus[])
    .filter((s) => statusCounts[s] > 0)
    .map((s) => ({ name: s, value: statusCounts[s], color: statusColors[s] }));

  // Top products by units sold
  const productTotals: Record<string, number> = {};
  orders.forEach((o) => {
    o.items.forEach((item) => {
      productTotals[item.name] = (productTotals[item.name] || 0) + item.quantity;
    });
  });
  const topProducts = Object.entries(productTotals)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([name, qty]) => ({ name: name.length > 14 ? name.slice(0, 14) + "…" : name, qty }));

  const recentOrders = orders.slice(0, 5);

  const kpis = [
    {
      title: "Gross Revenue",
      value: formatCurrency(grossRevenue),
      trend: <TrendBadge value={revenueTrend} />,
      icon: Wallet,
    },
    {
      title: "Active Orders",
      value: `${activeOrders}`,
      trend: <TrendBadge value={orderCountTrend} />,
      icon: ShoppingBag,
    },
    {
      title: "Total Customers",
      value: `${customerCount}`,
      trend: <span className="text-[11px] text-neutral-400">Registered accounts</span>,
      icon: Users,
    },
    {
      title: "Average Order Value",
      value: formatCurrency(avgOrderValue),
      trend: (
        <span className="text-[11px] text-neutral-400">
          Across {nonCancelled.length} orders
        </span>
      ),
      icon: TrendingUp,
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-neutral-900">Dashboard</h1>
        <p className="text-sm text-neutral-500 mt-1">
          Real-time overview of the ALL IN ONE store.
        </p>
      </div>

      {/* KPI cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {kpis.map((kpi, idx) => {
          const Icon = kpi.icon;
          return (
            <div
              key={idx}
              className="bg-white border border-neutral-200 rounded-xl p-5 shadow-sm"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold text-neutral-500">{kpi.title}</span>
                <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center">
                  <Icon className="w-4 h-4 text-blue-600" />
                </div>
              </div>
              <div className="text-2xl font-bold text-neutral-900 mb-1">{kpi.value}</div>
              {kpi.trend}
            </div>
          );
        })}
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue trend */}
        <div className="lg:col-span-2 bg-white border border-neutral-200 rounded-xl p-6 shadow-sm">
          <h3 className="text-sm font-bold text-neutral-900 mb-4">Revenue — Last 7 Days</h3>
          {grossRevenue === 0 ? (
            <p className="text-xs text-neutral-400 py-16 text-center">
              No revenue yet. Chart will populate as orders come in.
            </p>
          ) : (
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                <XAxis dataKey="label" tick={{ fontSize: 11, fill: "#94A3B8" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: "#94A3B8" }} axisLine={false} tickLine={false} />
                <Tooltip
                  formatter={(value: number) => formatCurrency(value)}
                  contentStyle={{ fontSize: 12, borderRadius: 8, border: "1px solid #E2E8F0" }}
                />
                <Line
                  type="monotone"
                  dataKey="revenue"
                  stroke="#3B82F6"
                  strokeWidth={2.5}
                  dot={{ r: 3, fill: "#3B82F6" }}
                />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Status donut */}
        <div className="bg-white border border-neutral-200 rounded-xl p-6 shadow-sm">
          <h3 className="text-sm font-bold text-neutral-900 mb-4">Orders by Status</h3>
          {statusData.length === 0 ? (
            <p className="text-xs text-neutral-400 py-16 text-center">No orders yet.</p>
          ) : (
            <>
              <ResponsiveContainer width="100%" height={180}>
                <PieChart>
                  <Pie
                    data={statusData}
                    dataKey="value"
                    nameKey="name"
                    innerRadius={45}
                    outerRadius={70}
                    paddingAngle={2}
                  >
                    {statusData.map((entry, i) => (
                      <Cell key={i} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8, border: "1px solid #E2E8F0" }} />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex flex-wrap gap-x-4 gap-y-1.5 mt-2 justify-center">
                {statusData.map((s) => (
                  <div key={s.name} className="flex items-center gap-1.5 text-[11px] text-neutral-600">
                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: s.color }} />
                    {s.name} ({s.value})
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Top products bar */}
        <div className="lg:col-span-2 bg-white border border-neutral-200 rounded-xl p-6 shadow-sm">
          <h3 className="text-sm font-bold text-neutral-900 mb-4">Top 5 Products by Units Sold</h3>
          {topProducts.length === 0 ? (
            <p className="text-xs text-neutral-400 py-16 text-center">No sales data yet.</p>
          ) : (
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={topProducts}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                <XAxis dataKey="name" tick={{ fontSize: 10, fill: "#94A3B8" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: "#94A3B8" }} axisLine={false} tickLine={false} allowDecimals={false} />
                <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8, border: "1px solid #E2E8F0" }} />
                <Bar dataKey="qty" fill="#3B82F6" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Recent orders */}
        <div className="bg-white border border-neutral-200 rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-neutral-900">Recent Orders</h3>
            <Link href="/admin/orders" className="text-[11px] font-semibold text-blue-600 hover:underline">
              View all
            </Link>
          </div>
          {recentOrders.length === 0 ? (
            <p className="text-xs text-neutral-400 py-8 text-center">No orders yet.</p>
          ) : (
            <div className="space-y-3">
              {recentOrders.map((order) => (
                <div key={order.id} className="flex items-center justify-between">
                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-neutral-900 truncate">
                      {order.customerName}
                    </p>
                    <p className="text-[11px] text-neutral-400">{formatCurrency(order.total)}</p>
                  </div>
                  <span
                    className={`text-[10px] font-semibold uppercase tracking-wide px-2 py-0.5 rounded border shrink-0 ml-2 ${statusBadgeStyles[order.status]}`}
                  >
                    {order.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}