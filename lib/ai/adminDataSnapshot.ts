import { adminDb } from "@/lib/firebase/admin";

// Kenya (EAT, UTC+3, no DST) — computed explicitly so "today" and "this
// month" are correct regardless of the timezone the server itself runs in.
const NAIROBI_OFFSET_MS = 3 * 60 * 60 * 1000;

function nairobiDayBounds(daysAgo: number) {
  const shifted = new Date(Date.now() + NAIROBI_OFFSET_MS);
  shifted.setUTCDate(shifted.getUTCDate() - daysAgo);
  const startLocalAsUTC = Date.UTC(
    shifted.getUTCFullYear(),
    shifted.getUTCMonth(),
    shifted.getUTCDate()
  );
  const start = new Date(startLocalAsUTC - NAIROBI_OFFSET_MS);
  const end = new Date(start.getTime() + 24 * 60 * 60 * 1000);
  return { start, end };
}

function nairobiMonthBounds(monthsAgo: number) {
  const shifted = new Date(Date.now() + NAIROBI_OFFSET_MS);
  const year = shifted.getUTCFullYear();
  const month = shifted.getUTCMonth() - monthsAgo;
  const startLocalAsUTC = Date.UTC(year, month, 1);
  const endLocalAsUTC = Date.UTC(year, month + 1, 1);
  return {
    start: new Date(startLocalAsUTC - NAIROBI_OFFSET_MS),
    end: new Date(endLocalAsUTC - NAIROBI_OFFSET_MS),
  };
}

function toMillis(ts: any): number {
  return ts?.toDate ? ts.toDate().getTime() : 0;
}

function fmtKES(n: number): string {
  return new Intl.NumberFormat("en-KE", {
    style: "currency",
    currency: "KES",
    minimumFractionDigits: 0,
  }).format(n);
}

/**
 * Fetches orders/products/users from Firestore (via the trusted Admin SDK,
 * bypassing client security rules) and returns a compact plain-text summary
 * to inject into the AI's context. The model should answer using ONLY what
 * appears here for anything data-related — never invent numbers beyond it.
 */
export async function getAdminDataSnapshot(): Promise<string> {
  try {
    const [ordersSnap, productsSnap, usersSnap] = await Promise.all([
      adminDb.collection("orders").orderBy("createdAt", "desc").limit(500).get(),
      adminDb.collection("products").get(),
      adminDb.collection("users").get(),
    ]);

    const orders = ordersSnap.docs.map((d) => ({ id: d.id, ...d.data() })) as any[];
    const products = productsSnap.docs.map((d) => ({ id: d.id, ...d.data() })) as any[];
    const users = usersSnap.docs.map((d) => ({ id: d.id, ...d.data() })) as any[];

    const today = nairobiDayBounds(0);
    const thisMonth = nairobiMonthBounds(0);
    const lastMonth = nairobiMonthBounds(1);

    const inRange = (o: any, range: { start: Date; end: Date }) => {
      const t = toMillis(o.createdAt);
      return t >= range.start.getTime() && t < range.end.getTime();
    };

    const ordersToday = orders.filter((o) => inRange(o, today));
    const ordersThisMonth = orders.filter((o) => inRange(o, thisMonth));
    const ordersLastMonth = orders.filter((o) => inRange(o, lastMonth));

    const sumTotal = (list: any[]) => list.reduce((s, o) => s + (o.total || 0), 0);

    const revenueToday = sumTotal(ordersToday);
    const revenueThisMonth = sumTotal(ordersThisMonth);
    const revenueLastMonth = sumTotal(ordersLastMonth);

    const pendingOrders = orders.filter((o) => o.status === "Processing");
    const dispatchedCount = orders.filter((o) => o.status === "Dispatched").length;
    const deliveredCount = orders.filter((o) => o.status === "Delivered").length;
    const cancelledCount = orders.filter((o) => o.status === "Cancelled").length;

    // Aggregate quantity sold per product across all fetched orders
    const qtyByProduct: Record<string, { name: string; qty: number }> = {};
    for (const o of orders) {
      for (const item of o.items || []) {
        if (!qtyByProduct[item.productId]) {
          qtyByProduct[item.productId] = { name: item.name, qty: 0 };
        }
        qtyByProduct[item.productId].qty += item.quantity || 0;
      }
    }
    const bestSellers = Object.values(qtyByProduct)
      .sort((a, b) => b.qty - a.qty)
      .slice(0, 5);

    const lowStock = products.filter((p) => p.stockCount > 0 && p.stockCount <= 3);
    const outOfStock = products.filter((p) => p.stockCount === 0);

    const customers = users.filter((u) => u.role !== "admin");
    const admins = users.filter((u) => u.role === "admin");

    const lines: string[] = [];
    lines.push(`--- LIVE STORE DATA SNAPSHOT (as of ${new Date().toISOString()}) ---`);
    lines.push(`Today: ${ordersToday.length} orders, ${fmtKES(revenueToday)} revenue.`);
    lines.push(`This month so far: ${ordersThisMonth.length} orders, ${fmtKES(revenueThisMonth)} revenue.`);
    lines.push(`Last month: ${ordersLastMonth.length} orders, ${fmtKES(revenueLastMonth)} revenue.`);
    lines.push(
      `Order status breakdown (up to the most recent 500 orders): Processing=${pendingOrders.length}, Dispatched=${dispatchedCount}, Delivered=${deliveredCount}, Cancelled=${cancelledCount}.`
    );

    if (pendingOrders.length > 0) {
      lines.push(`Pending (Processing) orders needing attention:`);
      for (const o of pendingOrders.slice(0, 15)) {
        lines.push(`  - Order ${o.id}: ${o.customerName}, ${fmtKES(o.total)}, ${o.items?.length || 0} item(s)`);
      }
      if (pendingOrders.length > 15) {
        lines.push(`  ...and ${pendingOrders.length - 15} more.`);
      }
    }

    lines.push(
      `Top selling products (by quantity, across fetched orders): ${
        bestSellers.map((b) => `${b.name} (${b.qty} sold)`).join(", ") || "none yet"
      }.`
    );
    lines.push(
      `Out of stock products (${outOfStock.length}): ${outOfStock.map((p) => p.name).join(", ") || "none"}.`
    );
    lines.push(
      `Low stock products, 1-3 left (${lowStock.length}): ${
        lowStock.map((p) => `${p.name} (${p.stockCount} left)`).join(", ") || "none"
      }.`
    );
    lines.push(`Total products in catalog: ${products.length}.`);
    lines.push(`Total customers: ${customers.length}. Total admin accounts: ${admins.length}.`);
    lines.push(`--- END LIVE STORE DATA SNAPSHOT ---`);

    return lines.join("\n");
  } catch (error) {
    console.error("Error building admin data snapshot:", error);
    return "--- LIVE STORE DATA SNAPSHOT UNAVAILABLE (error fetching data — treat any data question as unanswerable right now and say so) ---";
  }
}