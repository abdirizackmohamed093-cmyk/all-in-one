"use client";
import React, { useEffect, useState } from "react";
import {
  MessageCircle,
  Phone,
  Tag,
  Gift,
  Truck,
  Star,
  Zap,
  Sparkles,
  ShieldCheck,
  Clock,
  Headphones,
  BadgeCheck,
} from "lucide-react";
import { fetchHeroSlides, HeroSlide } from "@/lib/firebase/heroSlides";
import { fetchSidePromos, SidePromo } from "@/lib/firebase/sidePromos";

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  "message-circle": MessageCircle,
  phone: Phone,
  tag: Tag,
  gift: Gift,
  truck: Truck,
  star: Star,
  zap: Zap,
  sparkles: Sparkles,
};

const TRUST_BADGES = [
  { icon: ShieldCheck, label: "Secure Checkout" },
  { icon: Truck, label: "Fast Delivery" },
  { icon: Headphones, label: "24/7 Support" },
  { icon: BadgeCheck, label: "Genuine Products" },
];

function useCountdown(endsAt: string) {
  const [remaining, setRemaining] = useState<{ h: string; m: string; s: string } | null>(null);

  useEffect(() => {
    if (!endsAt) {
      setRemaining(null);
      return;
    }
    const end = new Date(endsAt).getTime();

    function tick() {
      const diff = end - Date.now();
      if (diff <= 0) {
        setRemaining({ h: "00", m: "00", s: "00" });
        return;
      }
      const h = Math.floor(diff / 3600000);
      const m = Math.floor((diff % 3600000) / 60000);
      const s = Math.floor((diff % 60000) / 1000);
      setRemaining({
        h: String(h).padStart(2, "0"),
        m: String(m).padStart(2, "0"),
        s: String(s).padStart(2, "0"),
      });
    }

    tick();
    const timer = setInterval(tick, 1000);
    return () => clearInterval(timer);
  }, [endsAt]);

  return remaining;
}

// Renders a slide title with luxury-red accents.
// In the admin panel, wrap the word(s) you want in red with asterisks,
// e.g. "Discover Your *Signature* Style" -> "Signature" renders in luxury red.
function renderHighlightedTitle(title: string) {
  const parts = title.split(/(\*[^*]+\*)/g);
  return parts.map((part, i) =>
    part.startsWith("*") && part.endsWith("*") ? (
      <span key={i} className="text-primary">
        {part.slice(1, -1)}
      </span>
    ) : (
      <React.Fragment key={i}>{part}</React.Fragment>
    )
  );
}

function TrustBadgeStrip() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((i) => (i + 1) % TRUST_BADGES.length);
    }, 2500);
    return () => clearInterval(timer);
  }, []);

  const Badge = TRUST_BADGES[index].icon;

  return (
    <div className="flex items-center gap-1.5 text-[11px] text-white/80">
      <Badge className="w-3.5 h-3.5" />
      <span>{TRUST_BADGES[index].label}</span>
    </div>
  );
}

function PromoSlide({ promo }: { promo: SidePromo }) {
  const Icon = ICON_MAP[promo.icon] || Star;
  const countdown = useCountdown(promo.countdownEndsAt);

  return (
    <div
      className={`relative overflow-hidden bg-gradient-to-br ${promo.gradient} rounded-[22px] h-full flex flex-col justify-between text-white shadow-[0_8px_30px_rgba(0,0,0,0.3)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_12px_40px_rgba(0,0,0,0.4)]`}
    >
      {/* Background image, if set — sits behind everything with a dark overlay for text contrast */}
      {promo.imageUrl && (
        <>
          <img
            src={promo.imageUrl}
            alt={promo.title}
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-black/60 via-black/40 to-black/60" />
        </>
      )}

      {/* Glow behind icon */}
      <div className="absolute top-4 left-4 w-16 h-16 rounded-full bg-white/30 blur-2xl animate-glow-pulse pointer-events-none" />

      {/* Shine sweep */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none rounded-[22px]">
        <div className="absolute -inset-y-full -left-1/2 w-1/3 bg-white/20 animate-shine" />
      </div>

      {/* Glass panel content */}
      <div className="relative z-10 p-5">
        <div className="w-11 h-11 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center mb-3 animate-float shadow-inner">
          <Icon className="w-5 h-5" />
        </div>
        <p className="font-extrabold text-lg leading-tight drop-shadow-sm">{promo.title}</p>
        {promo.subtitle && (
          <p className="text-xs opacity-90 mt-1">{promo.subtitle}</p>
        )}

        {countdown && (
          <div className="mt-3">
            <p className="text-[10px] uppercase tracking-wide opacity-80 mb-1">Ends In</p>
            <div className="flex gap-1.5 font-mono text-sm font-bold">
              <span className="bg-black/30 rounded px-1.5 py-0.5 backdrop-blur-sm">{countdown.h}</span>:
              <span className="bg-black/30 rounded px-1.5 py-0.5 backdrop-blur-sm">{countdown.m}</span>:
              <span className="bg-black/30 rounded px-1.5 py-0.5 backdrop-blur-sm">{countdown.s}</span>
            </div>
          </div>
        )}

        {promo.ctaLabel && (
          <a href={promo.href || "#"} className="relative overflow-hidden inline-block mt-4 bg-white text-neutral-900 text-xs font-bold px-4 py-2 rounded-full shadow-md transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_0_18px_rgba(255,255,255,0.6)]">
            <span className="relative z-10">{promo.ctaLabel}</span>
            <span className="absolute inset-0 -left-full w-1/2 bg-gradient-to-r from-transparent via-white/60 to-transparent animate-shine" />
          </a>
        )}
      </div>

      <div className="relative z-10 mt-3 px-5 pb-5">
        <TrustBadgeStrip />
      </div>
    </div>
  );
}

function PromoCarousel({ promos }: { promos: SidePromo[] }) {
  const [index, setIndex] = useState(0);
  const [transitioning, setTransitioning] = useState(false);

  useEffect(() => {
    if (promos.length < 2) return;
    const timer = setInterval(() => {
      setTransitioning(true);
      setTimeout(() => {
        setIndex((i) => (i + 1) % promos.length);
        setTransitioning(false);
      }, 250);
    }, 4500);
    return () => clearInterval(timer);
  }, [promos.length]);

  if (promos.length === 0) return null;

  return (
    <div className="h-full">
      <div
        className={`h-full transition-all duration-300 ${
          transitioning ? "opacity-0 translate-x-3" : "opacity-100 translate-x-0"
        }`}
      >
        <PromoSlide promo={promos[index]} />
      </div>
    </div>
  );
}

export default function HeroSlider() {
  const [slides, setSlides] = useState<HeroSlide[]>([]);
  const [promos, setPromos] = useState<SidePromo[]>([]);
  const [current, setCurrent] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const [slideData, promoData] = await Promise.all([
        fetchHeroSlides(),
        fetchSidePromos(),
      ]);
      setSlides(slideData.filter((s) => s.visible));
      setPromos(promoData.filter((p) => p.visible));
      setLoading(false);
    }
    load();
  }, []);

  useEffect(() => {
    if (slides.length < 2) return;
    const timer = setInterval(() => {
      setCurrent((c) => (c + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [slides]);

  if (loading || slides.length === 0) return null;

  const slide = slides[current];
  const hasPromos = promos.length > 0;

  return (
    <div className="flex flex-col md:flex-row gap-4">
      <div
        className={`relative aspect-[21/20] max-h-[360px] rounded-lg overflow-hidden border border-neutral-200 shadow-sm group ${
          hasPromos ? "w-full md:w-[72%]" : "w-full"
        }`}
      >
        <div key={current} className="absolute inset-0 animate-slide-fade-in">
          <img
            src={slide.imageUrl}
            alt={slide.title}
            className="absolute inset-0 w-full h-full object-cover animate-kenburns"
          />
        </div>

        <div className="absolute inset-0 bg-gradient-to-r from-black/65 via-black/40 to-black/10" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent" />

        <div
          key={`text-${current}`}
          className="absolute left-8 md:left-14 top-1/2 -translate-y-1/2 max-w-lg text-white"
        >
          <h2
            className="text-[36px] md:text-[52px] font-extrabold leading-[1.08] tracking-tight mb-5 animate-fade-slide-up"
            style={{ animationDelay: "100ms" }}
          >
            {renderHighlightedTitle(slide.title)}
          </h2>
          <p
            className="text-base md:text-xl font-medium text-white/80 leading-relaxed max-w-md mb-9 animate-fade-slide-up"
            style={{ animationDelay: "250ms" }}
          >
            {slide.subtitle}
          </p>
          <div
            className="flex items-center gap-4 animate-fade-slide-up"
            style={{ animationDelay: "400ms" }}
          >
            {slide.ctaLabel && (
              <a
                href={slide.ctaHref}
                className="inline-block bg-primary hover:bg-primary-hover text-primary-foreground px-7 py-3.5 rounded-2xl text-sm font-semibold tracking-wide shadow-lg shadow-primary/40 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-primary/50"
              >
                {slide.ctaLabel}
              </a>
            )}
            <a
              href={slide.secondaryCtaHref || "/shop"}
              className="inline-block bg-transparent border border-white/50 text-white px-7 py-3.5 rounded-2xl text-sm font-medium tracking-wide transition-all duration-300 hover:bg-white/10 hover:border-white hover:-translate-y-0.5"
            >
              {slide.secondaryCtaLabel || "Discover More"}
            </a>
          </div>
        </div>

        {slides.length > 1 && (
          <>
            <button
              onClick={() => setCurrent((c) => (c - 1 + slides.length) % slides.length)}
              className="absolute left-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition bg-black/40 text-white rounded-full w-8 h-8 flex items-center justify-center"
            >
              ‹
            </button>
            <button
              onClick={() => setCurrent((c) => (c + 1) % slides.length)}
              className="absolute right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition bg-black/40 text-white rounded-full w-8 h-8 flex items-center justify-center"
            >
              ›
            </button>
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2">
              {slides.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrent(i)}
                  className={`h-1.5 rounded-full transition-all ${
                    i === current ? "w-6 bg-white" : "w-1.5 bg-white/50"
                  }`}
                />
              ))}
            </div>
          </>
        )}
      </div>

      {hasPromos && (
        <div className="w-full md:w-[28%]">
          <PromoCarousel promos={promos} />
        </div>
      )}
    </div>
  );
}