"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { fetchOrders, Order, OrderStatus } from "@/lib/firebase/orders";
import { fetchCustomers } from "@/lib/firebase/customers";
import { Loader2 } from "lucide-react";

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat("en-KE", {
    style: "currency",
    currency: "KES",
    minimumFractionDigits: 0,
  }).format(amount);

const formatOrderDate = (createdAt: any): string => {
  if (!createdAt) return "";
  try {
    const date =
      typeof createdAt?.toDate === "function" ? createdAt.toDate() : new Date(createdAt);
    if (isNaN(date.getTime())) return "";
    return new Intl.DateTimeFormat("en-KE", {
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
    }).format(date);
  } catch {
    return "";
  }
};

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

const statusStyles: Record<OrderStatus, string> = {
  Processing: "bg-amber-500/10 text-amber-400 border border-amber-500/20",
  Dispatched: "bg-blue-500/10 text-blue-400 border border-blue-500/20",
  Delivered: "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20",
  Cancelled: "bg-red-500/10 text-red-400 border border-red-500/20",
};

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
        <Loader2 className="w-5 h-5 animate-spin text-white/40" />
      </div>
    );
  }

  const grossRevenue = orders
    .filter((o) => o.status !== "Cancelled")
    .reduce((sum, o) => sum + (o.total || 0), 0);

  const activeOrders = orders.filter(
    (o) => o.status === "Processing" || o.status === "Dispatched"
  ).length;

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const ordersToday = orders.filter((o) => {
    const d = toDate(o.createdAt);
    return d && d >= today;
  }).length;

  const recentOrders = orders.slice(0, 5);

  const unconfirmedPayments = orders.filter(
    (o) => o.status === "Processing" && !o.mpesaReference
  );

  const now = Date.now();
  const staleProcessing = orders.filter((o) => {
    if (o.status !== "Processing") return false;
    const d = toDate(o.createdAt);
    if (!d) return false;
    return now - d.getTime() > 48 * 60 * 60 * 1000;
  });

  const performanceKPIs = [
    {
      title: "Gross Revenue",
      value: formatCurrency(grossRevenue),
      trend: `${orders.length} total orders`,
      color: "text-emerald-400",
    },
    {
      title: "Active Orders",
      value: `${activeOrders} Pending`,
      trend: `${orders.filter((o) => o.status === "Dispatched").length} dispatched`,
      color: "text-amber-400",
    },
    {
      title: "Total Customers",
      value: `${customerCount} Users`,
      trend: "Registered accounts",
      color: "text-blue-400",
    },
    {
      title: "Orders Today",
      value: `${ordersToday}`,
      trend: formatOrderDate(new Date()) ? "Since midnight" : "",
      color: "text-accent",
    },
  ];

  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-2xl font-light tracking-tight">Operational Overview</h1>
        <p className="text-xs font-light text-white/50 mt-1">
          Real-time data for the ALL IN ONE platform in Kenya.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {performanceKPIs.map((kpi, idx) => (
          <div key={idx} className="bg-[#14171A] border border-white/5 rounded p-6 space-y-3 shadow-xl">
            <span className="text-[10px] uppercase tracking-widest text-white/40 font-semibold">
              {kpi.title}
            </span>
            <div className={`text-2xl font-light tracking-tight ${kpi.color}`}>{kpi.value}</div>
            <p className="text-[11px] font-light text-white/50">{kpi.trend}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        <div className="xl:col-span-2 bg-[#14171A] border border-white/5 rounded p-6 space-y-6 shadow-xl">
          <div className="flex items-center justify-between">
            <h3 className="text-xs uppercase tracking-widest text-white/80 font-semibold">
              Live Fulfillment Stream
            </h3>
            <Link
              href="/admin/orders"
              className="text-[11px] font-medium uppercase tracking-wider text-accent hover:underline"
            >
              Manage All Logs
            </Link>
          </div>

          {recentOrders.length === 0 ? (
            <p className="text-xs text-white/40 py-6 text-center">
              No orders yet. They'll appear here once customers check out.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-light">
                <thead>
                  <tr className="border-b border-white/5 text-white/40 uppercase tracking-wider text-[10px] font-medium">
                    <th className="pb-3">Order ID</th>
                    <th className="pb-3">Customer</th>
                    <th className="pb-3">Items</th>
                    <th className="pb-3">Value</th>
                    <th className="pb-3">Fulfillment</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 text-white/80">
                  {recentOrders.map((order) => {
                    const itemSummary =
                      order.items.length === 1
                        ? order.items[0].name
                        : `${order.items[0]?.name} +${order.items.length - 1} more`;
                    return (
                      <tr key={order.id} className="group hover:bg-white/[0.01] transition-colors">
                        <td className="py-4 font-mono text-accent">{order.id.slice(0, 8)}</td>
                        <td className="py-4 font-normal">{order.customerName}</td>
                        <td className="py-4 text-white/60">{itemSummary}</td>
                        <td className="py-4 font-medium">{formatCurrency(order.total)}</td>
                        <td className="py-4">
                          <span
                            className={`px-2 py-0.5 rounded-sm text-[10px] font-medium tracking-wide uppercase ${statusStyles[order.status]}`}
                          >
                            {order.status}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className="bg-[#14171A] border border-white/5 rounded p-6 space-y-6 shadow-xl">
          <h3 className="text-xs uppercase tracking-widest text-white/80 font-semibold">
            Needs Attention
          </h3>

          {unconfirmedPayments.length === 0 && staleProcessing.length === 0 ? (
            <p className="text-xs text-white/40">Nothing needs attention right now.</p>
          ) : (
            <ul className="space-y-4 text-xs font-light text-white/70">
              {unconfirmedPayments.length > 0 && (
                <li className="flex items-start gap-3 p-3 bg-white/[0.02] border border-white/5 rounded">
                  <span className="text-amber-400 text-sm font-bold leading-none">&bull;</span>
                  <div>
                    <p className="font-medium text-white/90">Unconfirmed Payments</p>
                    <p className="text-[11px] text-white/40 mt-0.5">
                      {unconfirmedPayments.length} order
                      {unconfirmedPayments.length > 1 ? "s" : ""} still Processing with no
                      M-Pesa reference code.
                    </p>
                  </div>
                </li>
              )}
              {staleProcessing.length > 0 && (
                <li className="flex items-start gap-3 p-3 bg-white/[0.02] border border-white/5 rounded">
                  <span className="text-red-400 text-sm font-bold leading-none">&bull;</span>
                  <div>
                    <p className="font-medium text-white/90">Stalled Orders</p>
                    <p className="text-[11px] text-white/40 mt-0.5">
                      {staleProcessing.length} order{staleProcessing.length > 1 ? "s" : ""} stuck
                      in Processing for over 48 hours.
                    </p>
                  </div>
                </li>
              )}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}