import { db } from "./config";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";

export interface PromoPopup {
  isEnabled: boolean;
  imageUrl: string;
  badge?: string; // e.g. "Featured Package", "Limited Offer", "Best Seller"
  title: string;
  description?: string;
  benefits: string[]; // e.g. ["Free Delivery", "Genuine Products", ...]
  originalPrice?: number;
  salePrice?: number;
  ctaLabel: string;
  ctaHref: string;
  secondaryCtaLabel?: string;
  secondaryCtaHref?: string;
  endsAt?: string; // ISO date string — drives the countdown timer
  accentColor?: string; // hex, used for badge/price/button accents
  updatedAt?: any;
}

const DOC_PATH = ["config", "promoPopup"] as const;

const DEFAULT_PROMO: PromoPopup = {
  isEnabled: false,
  imageUrl: "",
  badge: "",
  title: "",
  description: "",
  benefits: [],
  originalPrice: undefined,
  salePrice: undefined,
  ctaLabel: "Shop Now",
  ctaHref: "",
  secondaryCtaLabel: "",
  secondaryCtaHref: "",
  endsAt: "",
  accentColor: "#7B1E3A",
};

export async function fetchPromoPopup(): Promise<PromoPopup> {
  try {
    const ref = doc(db, DOC_PATH[0], DOC_PATH[1]);
    const snap = await getDoc(ref);
    if (snap.exists()) {
      return { ...DEFAULT_PROMO, ...snap.data() } as PromoPopup;
    }
    return DEFAULT_PROMO;
  } catch (error) {
    console.error("Error fetching promo popup:", error);
    return DEFAULT_PROMO;
  }
}

export async function savePromoPopup(data: PromoPopup): Promise<boolean> {
  try {
    const ref = doc(db, DOC_PATH[0], DOC_PATH[1]);
    await setDoc(ref, { ...data, updatedAt: serverTimestamp() });
    return true;
  } catch (error) {
    console.error("Error saving promo popup:", error);
    return false;
  }
}