import { db } from "./config";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  writeBatch,
  serverTimestamp,
} from "firebase/firestore";

export interface PromoPopup {
  id?: string;
  isActive: boolean;
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
  createdAt?: any;
  updatedAt?: any;
}

const COLLECTION = "ads";

export const emptyAd: Omit<PromoPopup, "id"> = {
  isActive: false,
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

// Admin list view — every campaign, active one sorted first.
export async function fetchAllAds(): Promise<PromoPopup[]> {
  try {
    const snapshot = await getDocs(collection(db, COLLECTION));
    const ads = snapshot.docs.map((d) => ({ id: d.id, ...d.data() })) as PromoPopup[];
    return ads.sort((a, b) => Number(b.isActive) - Number(a.isActive));
  } catch (error) {
    console.error("Error fetching ads:", error);
    return [];
  }
}

// Storefront — whichever single campaign is currently active, or null.
export async function fetchActiveAd(): Promise<PromoPopup | null> {
  try {
    const ads = await fetchAllAds();
    return ads.find((a) => a.isActive) || null;
  } catch (error) {
    console.error("Error fetching active ad:", error);
    return null;
  }
}

export async function fetchAdById(id: string): Promise<PromoPopup | null> {
  try {
    const ref = doc(db, COLLECTION, id);
    const snap = await getDoc(ref);
    if (!snap.exists()) return null;
    return { id: snap.id, ...snap.data() } as PromoPopup;
  } catch (error) {
    console.error(`Error fetching ad (${id}):`, error);
    return null;
  }
}

// Ensures only one campaign is ever active — turns every other campaign's
// isActive off before/when a given one is turned on.
async function deactivateAllExcept(excludeId?: string) {
  const snapshot = await getDocs(collection(db, COLLECTION));
  const batch = writeBatch(db);
  snapshot.docs.forEach((d) => {
    if (d.id !== excludeId && d.data().isActive) {
      batch.update(d.ref, { isActive: false });
    }
  });
  await batch.commit();
}

export async function createAd(data: Omit<PromoPopup, "id">): Promise<string | null> {
  try {
    const docRef = await addDoc(collection(db, COLLECTION), {
      ...data,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    if (data.isActive) {
      await deactivateAllExcept(docRef.id);
    }
    return docRef.id;
  } catch (error) {
    console.error("Error creating ad:", error);
    return null;
  }
}

export async function updateAd(
  id: string,
  data: Partial<Omit<PromoPopup, "id">>
): Promise<boolean> {
  try {
    const ref = doc(db, COLLECTION, id);
    await updateDoc(ref, { ...data, updatedAt: serverTimestamp() });
    if (data.isActive) {
      await deactivateAllExcept(id);
    }
    return true;
  } catch (error) {
    console.error(`Error updating ad (${id}):`, error);
    return false;
  }
}

export async function setActiveAd(id: string): Promise<boolean> {
  try {
    await deactivateAllExcept(id);
    await updateDoc(doc(db, COLLECTION, id), { isActive: true, updatedAt: serverTimestamp() });
    return true;
  } catch (error) {
    console.error(`Error setting active ad (${id}):`, error);
    return false;
  }
}

export async function deleteAd(id: string): Promise<boolean> {
  try {
    await deleteDoc(doc(db, COLLECTION, id));
    return true;
  } catch (error) {
    console.error(`Error deleting ad (${id}):`, error);
    return false;
  }
}