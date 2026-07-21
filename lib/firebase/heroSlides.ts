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

export interface HeroSlide {
  id: string;
  title: string;
  subtitle: string;
  ctaLabel: string;
  ctaHref: string;
  secondaryCtaLabel?: string;
  secondaryCtaHref?: string;
  imageUrl: string;
  order: number;
  visible: boolean;
}

const heroSlidesCollection = collection(db, "heroSlides");

export async function fetchHeroSlides(): Promise<HeroSlide[]> {
  const q = query(heroSlidesCollection, orderBy("order", "asc"));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((d) => ({
    id: d.id,
    ...(d.data() as Omit<HeroSlide, "id">),
  }));
}

export async function addHeroSlide(
  slide: Omit<HeroSlide, "id">
): Promise<string> {
  const docRef = await addDoc(heroSlidesCollection, slide);
  return docRef.id;
}

export async function updateHeroSlide(
  id: string,
  slide: Partial<Omit<HeroSlide, "id">>
): Promise<void> {
  const slideRef = doc(db, "heroSlides", id);
  await updateDoc(slideRef, slide);
}

export async function deleteHeroSlide(id: string): Promise<void> {
  const slideRef = doc(db, "heroSlides", id);
  await deleteDoc(slideRef);
}