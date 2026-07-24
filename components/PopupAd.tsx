"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { X, Check, Truck, ShieldCheck, Sparkles as SparklesIcon, BadgePercent, RotateCcw, Lock } from "lucide-react";
import { fetchActiveAd, PromoPopup } from "@/lib/firebase/ads";

const SESSION_KEY = "promoPopupShown";
const AUTO_OPEN_DELAY_MS = 5000;

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("en-KE", {
    style: "currency",
    currency: "KES",
    minimumFractionDigits: 0,
  }).format(amount);
}

const BENEFIT_ICONS: Record<string, React.ElementType> = {
  "free delivery": Truck,
  "genuine products": ShieldCheck,
  "curated by experts": SparklesIcon,
  "save": BadgePercent,
  "easy returns": RotateCcw,
  "secure payments": Lock,
};

function getBenefitIcon(label: string) {
  const lower = label.toLowerCase();
  for (const key in BENEFIT_ICONS) {
    if (lower.includes(key)) return BENEFIT_ICONS[key];
  }
  return Check;
}

function useCountdown(endsAt?: string) {
  const target = useMemo(() => (endsAt ? new Date(endsAt).getTime() : null), [endsAt]);
  const [remaining, setRemaining] = useState<number | null>(null);

  useEffect(() => {
    if (!target) return;
    const tick = () => setRemaining(Math.max(0, target - Date.now()));
    tick();
    const interval = setInterval(tick, 60000);
    return () => clearInterval(interval);
  }, [target]);

  if (!target || remaining === null) return null;

  const days = Math.floor(remaining / (1000 * 60 * 60 * 24));
  const hours = Math.floor((remaining / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((remaining / (1000 * 60)) % 60);

  return { days, hours, minutes, expired: remaining <= 0 };
}

export default function PopupAd() {
  const [promo, setPromo] = useState<PromoPopup | null>(null);
  const [visible, setVisible] = useState(false);
  const [entered, setEntered] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (sessionStorage.getItem(SESSION_KEY)) return;

    fetchActiveAd().then((data) => {
      if (!data || !data.isActive || !data.imageUrl || !data.title) return;

      const timer = setTimeout(() => {
        setPromo(data);
        setVisible(true);
        sessionStorage.setItem(SESSION_KEY, "1");
        requestAnimationFrame(() => setEntered(true));
      }, AUTO_OPEN_DELAY_MS);

      return () => clearTimeout(timer);
    });
  }, []);

  const close = () => {
    setEntered(false);
    setTimeout(() => setVisible(false), 200);
  };

  useEffect(() => {
    if (!visible) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [visible]);

  const countdown = useCountdown(promo?.endsAt);

  if (!visible || !promo) return null;

  const hasPrice = !!promo.salePrice;
  const savedPercent =
    hasPrice && promo.originalPrice
      ? Math.round((1 - promo.salePrice! / promo.originalPrice) * 100)
      : null;

  const accent = promo.accentColor || "#7B1E3A";

  return (
    <div
      className={`fixed inset-0 z-[100] flex items-center justify-center p-4 transition-all duration-200 ${
        entered ? "bg-black/60 backdrop-blur-sm opacity-100" : "bg-black/0 opacity-0"
      }`}
      onClick={close}
    >
      <div
        className={`relative w-full max-w-md bg-white rounded-3xl overflow-hidden shadow-2xl transition-all duration-300 ease-out ${
          entered ? "opacity-100 scale-100 translate-y-0" : "opacity-0 scale-95 translate-y-2"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={close}
          aria-label="Close"
          className="absolute top-4 right-4 z-20 w-9 h-9 rounded-full bg-white/90 hover:bg-white text-neutral-700 flex items-center justify-center shadow-md transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Hero image */}
        <div className="relative w-full aspect-[4/3] bg-neutral-100">
          <img
            src={promo.imageUrl}
            alt={promo.title}
            className="absolute inset-0 w-full h-full object-cover"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />

          {promo.badge && (
            <span
              className="absolute top-4 left-4 text-[10px] font-bold uppercase tracking-wider text-white px-3 py-1.5 rounded-full shadow-sm"
              style={{ backgroundColor: accent }}
            >
              {promo.badge}
            </span>
          )}
        </div>

        {/* Content */}
        <div className="px-6 pt-5 pb-6">
          <h2 className="font-serif text-2xl font-bold text-neutral-900 leading-tight">
            {promo.title}
          </h2>

          {promo.description && (
            <p className="text-sm text-neutral-500 mt-2 leading-relaxed">
              {promo.description}
            </p>
          )}

          {promo.benefits && promo.benefits.length > 0 && (
            <div className="grid grid-cols-2 gap-x-3 gap-y-2 mt-4">
              {promo.benefits.map((benefit) => {
                const Icon = getBenefitIcon(benefit);
                return (
                  <div key={benefit} className="flex items-center gap-1.5 text-xs text-neutral-700">
                    <Icon className="w-3.5 h-3.5 shrink-0" style={{ color: accent }} />
                    <span className="truncate">{benefit}</span>
                  </div>
                );
              })}
            </div>
          )}

          {hasPrice && (
            <div className="flex items-end gap-2 mt-5">
              <span className="font-serif text-2xl font-bold text-neutral-900">
                {formatCurrency(promo.salePrice!)}
              </span>
              {promo.originalPrice && (
                <span className="text-sm text-neutral-400 line-through mb-0.5">
                  {formatCurrency(promo.originalPrice)}
                </span>
              )}
              {savedPercent !== null && savedPercent > 0 && (
                <span
                  className="text-[11px] font-bold px-2 py-0.5 rounded-full mb-0.5"
                  style={{ backgroundColor: `${accent}1A`, color: accent }}
                >
                  Save {savedPercent}%
                </span>
              )}
            </div>
          )}

          {countdown && !countdown.expired && (
            <div className="mt-4 flex items-center gap-2 text-xs text-neutral-500">
              <span>Offer ends in</span>
              <div className="flex items-center gap-1 font-mono font-bold text-neutral-800">
                <span className="bg-neutral-100 rounded px-1.5 py-0.5">
                  {String(countdown.days).padStart(2, "0")}d
                </span>
                <span className="bg-neutral-100 rounded px-1.5 py-0.5">
                  {String(countdown.hours).padStart(2, "0")}h
                </span>
                <span className="bg-neutral-100 rounded px-1.5 py-0.5">
                  {String(countdown.minutes).padStart(2, "0")}m
                </span>
              </div>
            </div>
          )}

          <div className="flex items-center gap-3 mt-6">
            {promo.ctaHref && (
              <Link
                href={promo.ctaHref}
                onClick={close}
                className="flex-1 text-center text-white text-xs font-bold uppercase tracking-widest px-5 py-3.5 rounded-xl shadow-sm hover:opacity-90 transition-opacity"
                style={{ backgroundColor: accent }}
              >
                {promo.ctaLabel || "Shop Now"}
              </Link>
            )}
            {promo.secondaryCtaLabel && promo.secondaryCtaHref && (
              <Link
                href={promo.secondaryCtaHref}
                onClick={close}
                className="text-xs font-bold uppercase tracking-widest text-neutral-500 hover:text-neutral-800 transition-colors px-3"
              >
                {promo.secondaryCtaLabel}
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}