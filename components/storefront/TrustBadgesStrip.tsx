import { ShieldCheck, Tag, Truck, Headphones } from "lucide-react";

const BADGES = [
  {
    icon: ShieldCheck,
    title: "100% Original Products",
    subtitle: "Sourced from trusted brands",
  },
  {
    icon: Tag,
    title: "Best Prices in Kenya",
    subtitle: "Unbeatable deals daily",
  },
  {
    icon: Truck,
    title: "Nationwide Delivery",
    subtitle: "We deliver to your doorstep",
  },
  {
    icon: Headphones,
    title: "24/7 Customer Support",
    subtitle: "We're here to help anytime",
  },
];

export default function TrustBadgesStrip() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
        {BADGES.map((badge, i) => {
          const Icon = badge.icon;
          return (
            <div key={i} className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                <Icon className="w-5 h-5 text-primary" />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-bold text-neutral-900 truncate">
                  {badge.title}
                </p>
                <p className="text-xs text-neutral-500 truncate">
                  {badge.subtitle}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}