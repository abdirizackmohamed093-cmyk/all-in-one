"use client";
import { useEffect, useState } from "react";
import { fetchOrders, updateOrderStatus, Order, OrderStatus } from "@/lib/firebase/orders";
import { ChevronDown, ChevronUp, CheckCircle2 } from "lucide-react";

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

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    fetchOrders().then((data) => {
      setOrders(data);
      setLoading(false);
    });
  }, []);

  const handleStatusChange = async function (id: string, status: OrderStatus) {
    setOrders(function (prev) {
      return prev.map(function (o) {
        return o.id === id ? { ...o, status } : o;
      });
    });
    const ok = await updateOrderStatus(id, status);
    if (!ok) {
      fetchOrders().then(setOrders);
    }
  };

  const toggleExpand = function (id: string) {
    setExpandedId(expandedId === id ? null : id);
  };

  if (loading) {
    return (
      <div>
        <h1 className="font-serif text-2xl font-bold text-charcoal mb-6">Orders</h1>
        <p className="text-sm text-charcoal/50">Loading orders...</p>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div>
        <h1 className="font-serif text-2xl font-bold text-charcoal mb-6">Orders</h1>
        <div className="text-center py-16 border border-dashed border-neutral-200 rounded">
          <p className="text-sm text-charcoal/50">
            No orders yet, orders will appear here once customers start checking out.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="font-serif text-2xl font-bold text-charcoal mb-6">Orders</h1>

      <div className="border border-neutral-200 rounded-md overflow-hidden">
        <div className="grid grid-cols-[1fr_1fr_1fr_1fr_auto] gap-4 px-4 py-3 bg-neutral-50 border-b border-neutral-200 text-[10px] font-bold uppercase tracking-widest text-neutral-500">
          <span>Order ID</span>
          <span>Customer</span>
          <span>Total</span>
          <span>Status</span>
          <span></span>
        </div>

        {orders.map(function (order) {
          const isExpanded = expandedId === order.id;
          const hasMpesaRef = !!order.mpesaReference;
          return (
            <div key={order.id} className="border-b border-neutral-100 last:border-b-0">
              <button
                onClick={function () { toggleExpand(order.id); }}
                className="w-full grid grid-cols-[1fr_1fr_1fr_1fr_auto] gap-4 px-4 py-3.5 items-center text-left hover:bg-neutral-50 transition-colors"
              >
                <span className="font-mono text-xs flex items-center gap-1.5">
                  {order.id.slice(0, 8)}
                  {hasMpesaRef && (
                    <CheckCircle2
                      className="w-3.5 h-3.5 text-emerald-600 shrink-0"
                      aria-label="M-Pesa reference provided"
                    />
                  )}
                </span>
                <span className="text-sm">{order.customerName}</span>
                <span className="text-sm font-medium">{formatCurrency(order.total)}</span>
                <span
                  onClick={function (e) { e.stopPropagation(); }}
                  className="inline-block"
                >
                  <select
                    value={order.status}
                    onChange={function (e) {
                      handleStatusChange(order.id, e.target.value as OrderStatus);
                    }}
                    className={"text-xs font-semibold uppercase tracking-wide px-2 py-1 rounded border " + statusStyles[order.status]}
                  >
                    <option value="Processing">Processing</option>
                    <option value="Dispatched">Dispatched</option>
                    <option value="Delivered">Delivered</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </span>
                {isExpanded ? (
                  <ChevronUp className="w-4 h-4 text-neutral-400" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-neutral-400" />
                )}
              </button>

              {isExpanded && (
                <div className="px-4 pb-5 pt-1 bg-neutral-50/50">
                  <div className="grid grid-cols-2 gap-6 mb-4">
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-widest text-neutral-500 mb-1">
                        Delivery Address
                      </p>
                      <p className="text-sm text-neutral-700">
                        {order.deliveryAddress || "Not provided"}
                      </p>
                    </div>
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-widest text-neutral-500 mb-1">
                        Phone
                      </p>
                      <p className="text-sm text-neutral-700">
                        {order.phone || "Not provided"}
                      </p>
                    </div>
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-widest text-neutral-500 mb-1">
                        Email
                      </p>
                      <p className="text-sm text-neutral-700">
                        {order.customerEmail}
                      </p>
                    </div>
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-widest text-neutral-500 mb-1">
                        M-Pesa Reference
                      </p>
                      <p className={"text-sm font-mono tracking-wider " + (hasMpesaRef ? "text-emerald-700 font-semibold" : "text-neutral-400")}>
                        {order.mpesaReference || "Not provided"}
                      </p>
                    </div>
                  </div>

                  <p className="text-[10px] font-bold uppercase tracking-widest text-neutral-500 mb-2">
                    Items
                  </p>
                  <div className="border border-neutral-200 rounded bg-white divide-y divide-neutral-100">
                    {order.items.map(function (item, idx) {
                      return (
                        <div key={idx} className="flex items-center justify-between px-4 py-2.5 text-sm">
                          <span className="text-neutral-700">{item.name}</span>
                          <span className="text-neutral-500">Qty: {item.quantity}</span>
                          <span className="text-neutral-500">{formatCurrency(item.price)} each</span>
                          <span className="font-medium text-neutral-900">
                            {formatCurrency(item.price * item.quantity)}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}