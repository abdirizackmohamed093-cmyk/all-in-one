"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { fetchOrdersForUser, Order, OrderStatus } from "@/lib/firebase/orders";
import { ArrowLeft, Loader2 } from "lucide-react";

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat("en-KE", {
    style: "currency",
    currency: "KES",
    minimumFractionDigits: 0,
  }).format(amount);

const statusStyles: Record<OrderStatus, string> = {
  Processing: "bg-amber-50 text-amber-700 border-amber-200",
  Dispatched: "bg-blue-50 text-blue-700 border-blue-200",
  Delivered: "bg-emerald-50 text-emerald-700 border-emerald-200",
  Cancelled: "bg-red-50 text-red-700 border-red-200",
};

const formatOrderDate = (createdAt: any): string => {
  if (!createdAt) return "";
  try {
    const date =
      typeof createdAt?.toDate === "function"
        ? createdAt.toDate()
        : new Date(createdAt);
    if (isNaN(date.getTime())) return "";
    return new Intl.DateTimeFormat("en-KE", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
    }).format(date);
  } catch {
    return "";
  }
};

export default function MyOrdersPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) {
      router.replace("/login");
      return;
    }
    if (user) {
      fetchOrdersForUser(user.uid).then((data) => {
        setOrders(data);
        setLoading(false);
      });
    }
  }, [user, authLoading, router]);

  if (authLoading || (loading && user)) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 className="w-5 h-5 animate-spin text-charcoal/50" />
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Link
        href="/"
        className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-neutral-500 hover:text-neutral-900 mb-8"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Store
      </Link>

      <h1 className="font-serif text-2xl font-bold text-neutral-900 mb-8">My Orders</h1>

      {orders.length === 0 ? (
        <div className="text-center py-16 border border-dashed border-neutral-200 rounded text-sm text-neutral-500">
          You haven't placed any orders yet.
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => {
            const orderDate = formatOrderDate((order as any).createdAt);
            return (
              <div key={order.id} className="border border-neutral-200 rounded-md p-5">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-mono text-xs text-neutral-500">
                    Order #{order.id.slice(0, 8)}
                  </span>
                  <span
                    className={`text-xs font-semibold uppercase tracking-wide px-2 py-1 rounded border ${statusStyles[order.status]}`}
                  >
                    {order.status}
                  </span>
                </div>
                {orderDate && (
                  <div className="text-xs text-neutral-400 mb-3">{orderDate}</div>
                )}
                <div className="space-y-1 mb-3">
                  {order.items.map((item, i) => (
                    <div key={i} className="flex justify-between text-sm text-neutral-700">
                      <span>
                        {item.name} × {item.quantity}
                      </span>
                      <span>{formatCurrency(item.price * item.quantity)}</span>
                    </div>
                  ))}
                </div>
                <div className="flex justify-between pt-3 border-t border-neutral-100 text-sm font-semibold text-neutral-900">
                  <span>Total</span>
                  <span>{formatCurrency(order.total)}</span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}