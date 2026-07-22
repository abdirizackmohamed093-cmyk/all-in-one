import {
  Sparkles,
  Footprints,
  Gift,
  Luggage,
  NotebookPen,
  Watch,
  BedDouble,
  Gem,
  Backpack,
  Sparkle,
  Smartphone,
  Tv,
  ShoppingBasket,
  Shirt,
  Laptop,
  Gamepad2,
  Baby,
  LucideIcon,
  Tag,
} from "lucide-react";

// Maps a category name to the most fitting Lucide icon. Matching is
// keyword-based and case-insensitive so it works for whatever an admin
// types (e.g. "Travelling Items", "School Bags") without needing a
// separate icon field in Firestore. Falls back to a generic tag icon
// for anything unrecognized.
const ICON_RULES: { keywords: string[]; icon: LucideIcon }[] = [
  { keywords: ["perfume", "fragrance"], icon: Sparkles },
  { keywords: ["shoe", "footwear", "sneaker"], icon: Footprints },
  { keywords: ["gift"], icon: Gift },
  { keywords: ["travel", "luggage", "suitcase"], icon: Luggage },
  { keywords: ["stationery", "notebook", "office"], icon: NotebookPen },
  { keywords: ["watch"], icon: Watch },
  { keywords: ["bedding", "mattress", "bedsheet"], icon: BedDouble },
  { keywords: ["jewel", "jewelry", "jewellery"], icon: Gem },
  { keywords: ["bag", "backpack"], icon: Backpack },
  { keywords: ["beauty", "cosmetic", "makeup", "skincare"], icon: Sparkle },
  { keywords: ["phone", "tablet", "mobile"], icon: Smartphone },
  { keywords: ["tv", "audio", "electronic"], icon: Tv },
  { keywords: ["supermarket", "grocery", "food"], icon: ShoppingBasket },
  { keywords: ["fashion", "wear", "cloth", "apparel", "dress"], icon: Shirt },
  { keywords: ["computer", "laptop", "computing"], icon: Laptop },
  { keywords: ["game", "gaming"], icon: Gamepad2 },
  { keywords: ["baby", "maternity", "kid", "infant"], icon: Baby },
];

export function getCategoryIcon(name: string): LucideIcon {
  const lower = name.toLowerCase();
  for (const rule of ICON_RULES) {
    if (rule.keywords.some((kw) => lower.includes(kw))) {
      return rule.icon;
    }
  }
  return Tag;
}