"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Zap, X, CreditCard, ShieldCheck, Truck, BadgeCheck } from "lucide-react";
import { Product } from "@/components/products/ProductCard";

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("en-KE", {
    style: "currency",
    currency: "KES",
    minimumFractionDigits: 0,
  }).format(amount);
}

function useCountdown(endsAt: any) {
  const [remaining, setRemaining] = useState({ hours: "00", minutes: "00", seconds: "00" });

  useEffect(() => {
    if (!endsAt) return;

    const endMs = endsAt.toMillis ? endsAt.toMillis() : new Date(endsAt).getTime();

    const tick = () => {
      const diff = Math.max(0, endMs - Date.now());
      const h = Math.floor(diff / 3600000);
      const m = Math.floor((diff % 3600000) / 60000);
      const s = Math.floor((diff % 60000) / 1000);
      setRemaining({
        hours: String(h).padStart(2, "0"),
        minutes: String(m).padStart(2, "0"),
        seconds: String(s).padStart(2, "0"),
      });
    };

    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, [endsAt]);

  return remaining;
}

interface FlashSaleBannerProps {
  products: Product[];
}

export default function FlashSaleBanner({ products }: FlashSaleBannerProps) {
  const [dismissed, setDismissed] = useState(false);

  // All flash items share one sale window in this simple version — we use
  // the soonest-ending product's timestamp to drive the single countdown.
  const soonestEndsAt = products
    .map((p) => p.flashSaleEndsAt)
    .filter(Boolean)
    .sort((a, b) => a.toMillis() - b.toMillis())[0];

  const { hours, minutes, seconds } = useCountdown(soonestEndsAt);

  if (dismissed || products.length === 0) return null;

  return (
    <div className="relative bg-gradient-to-br from-red-600 to-red-500 rounded-xl overflow-hidden text-white mb-8">
      <button
        onClick={() => setDismissed(true)}
        className="absolute top-3 right-3 z-10 bg-white/20 hover:bg-white/30 rounded-full p-1.5 transition-colors"
      >
        <X className="w-4 h-4" />
      </button>

      <div className="px-5 pt-6 pb-4 text-center">
        <span className="inline-flex items-center gap-1.5 bg-white/20 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full mb-3">
          <Zap className="w-3 h-3 fill-current" /> Live Now
        </span>
        <h3 className="font-serif text-xl font-bold mb-1">Flash Sale</h3>
        <p className="text-xs text-white/80 mb-4">
          Limited-time deals — ends today
        </p>

        <div className="flex items-center justify-center gap-2 mb-1">
          {[
            { label: "Hrs", value: hours },
            { label: "Min", value: minutes },
            { label: "Sec", value: seconds },
          ].map((unit, i) => (
            <div key={i} className="flex items-center gap-2">
              <div className="bg-black/25 rounded-md px-3 py-1.5 text-center min-w-[42px]">
                <span className="font-mono text-lg font-bold leading-none">{unit.value}</span>
                <div className="text-[8px] uppercase tracking-wide text-white/70">{unit.label}</div>
              </div>
              {i < 2 && <span className="text-white/50 font-bold">:</span>}
            </div>
          ))}
        </div>
      </div>

      <div className="px-4 pb-4">
        <p className="text-[11px] font-bold uppercase tracking-wide text-white/80 mb-2 flex items-center gap-1.5">
          <Zap className="w-3 h-3 fill-current" /> More flash deals
        </p>
        <div className="flex gap-3 overflow-x-auto pb-1 -mx-1 px-1">
          {products.slice(0, 6).map((p) => {
            const discountPct = p.flashSalePrice
              ? Math.round(((p.price - p.flashSalePrice) / p.price) * 100)
              : 0;
            return (
              <Link
                key={p.id}
                href={`/products/${p.id}`}
                className="shrink-0 w-28 bg-white rounded-lg overflow-hidden text-neutral-900"
              >
                <div className="relative w-full aspect-square bg-neutral-100">
                  <img
                    src={p.imageUrl || "/placeholder-product.jpg"}
                    alt={p.name}
                    className="w-full h-full object-cover"
                  />
                  {discountPct > 0 && (
                    <span className="absolute top-1 right-1 bg-red-600 text-white text-[9px] font-bold px-1.5 py-0.5 rounded">
                      -{discountPct}%
                    </span>
                  )}
                </div>
                <div className="p-2">
                  <p className="text-[10px] text-neutral-600 truncate">{p.name}</p>
                  <p className="text-xs font-bold text-red-600">
                    {formatCurrency(p.flashSalePrice ?? p.price)}
                  </p>
                  {p.flashSalePrice && (
                    <p className="text-[9px] text-neutral-400 line-through">
                      {formatCurrency(p.price)}
                    </p>
                  )}
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      <div className="bg-white/10 px-4 py-3 grid grid-cols-4 gap-2 text-center">
        {[
          { icon: CreditCard, label: "Pay Later" },
          { icon: ShieldCheck, label: "Safe Pay" },
          { icon: Truck, label: "Free Delivery" },
          { icon: BadgeCheck, label: "Verified" },
        ].map(({ icon: Icon, label }, i) => (
          <div key={i} className="flex flex-col items-center gap-1">
            <Icon className="w-4 h-4 text-white/90" />
            <span className="text-[8px] text-white/80">{label}</span>
          </div>
        ))}
      </div>

      <div className="p-4">
        <Link
          href="/shop?flash=true"
          className="block text-center bg-white text-red-600 font-bold text-xs uppercase tracking-widest py-3 rounded-md hover:bg-red-50 transition-colors"
        >
          Shop Flash Sale →
        </Link>
      </div>
    </div>
  );
}