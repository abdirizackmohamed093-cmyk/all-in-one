import { db } from "./config";
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  query,
  orderBy,
} from "firebase/firestore";

export interface SidePromo {
  id: string;
  title: string;
  subtitle: string;
  href: string;
  ctaLabel: string;
  icon: string;
  gradient: string;
  countdownEndsAt: string; // ISO date string, optional
  order: number;
  visible: boolean;
}

const sidePromosCollection = collection(db, "sidePromos");

export async function fetchSidePromos(): Promise<SidePromo[]> {
  const q = query(sidePromosCollection, orderBy("order", "asc"));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((d) => ({
    id: d.id,
    ...(d.data() as Omit<SidePromo, "id">),
  }));
}

export async function addSidePromo(
  promo: Omit<SidePromo, "id">
): Promise<string> {
  const docRef = await addDoc(sidePromosCollection, promo);
  return docRef.id;
}

export async function updateSidePromo(
  id: string,
  promo: Partial<Omit<SidePromo, "id">>
): Promise<void> {
  const promoRef = doc(db, "sidePromos", id);
  await updateDoc(promoRef, promo);
}

export async function deleteSidePromo(id: string): Promise<void> {
  const promoRef = doc(db, "sidePromos", id);
  await deleteDoc(promoRef);
}