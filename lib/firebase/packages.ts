import { db } from "./config";
import {
  collection,
  getDocs,
  doc,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  serverTimestamp,
} from "firebase/firestore";

export interface PackageItem {
  id: string;
  name: string;
  imageUrl: string;
  price: number;
}

export interface Package {
  id: string;
  title: string;
  slug: string;
  category: string;
  categoryLabel: string;
  icon: string;
  description: string;
  bannerImageUrl?: string;
  items: PackageItem[];
  discountPercent: number;
  isFeatured: boolean;
  isVisible: boolean;
  createdAt?: any;
  updatedAt?: any;
}

export type NewPackageInput = Omit<Package, "id" | "createdAt" | "updatedAt">;

export async function fetchPackages(): Promise<Package[]> {
  try {
    const snapshot = await getDocs(collection(db, "packages"));
    return snapshot.docs.map((docSnap) => ({
      id: docSnap.id,
      ...docSnap.data(),
    })) as Package[];
  } catch (error) {
    console.error("Error fetching packages from Firestore:", error);
    return [];
  }
}

export async function fetchVisiblePackages(): Promise<Package[]> {
  const all = await fetchPackages();
  return all.filter((p) => p.isVisible);
}

export async function fetchPackagesByCategory(category: string): Promise<Package[]> {
  const all = await fetchVisiblePackages();
  return all.filter((p) => p.category === category);
}

export async function fetchSinglePackage(id: string): Promise<Package | null> {
  try {
    const ref = doc(db, "packages", id);
    const docSnap = await getDoc(ref);
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() } as Package;
    }
    return null;
  } catch (error) {
    console.error(`Error fetching package (${id}):`, error);
    return null;
  }
}

export async function fetchPackageBySlug(slug: string): Promise<Package | null> {
  const all = await fetchPackages();
  return all.find((p) => p.slug === slug) || null;
}

export async function addPackage(data: NewPackageInput): Promise<string | null> {
  try {
    const docRef = await addDoc(collection(db, "packages"), {
      ...data,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    return docRef.id;
  } catch (error) {
    console.error("Error adding package to Firestore:", error);
    return null;
  }
}

export async function updatePackage(
  id: string,
  data: Partial<NewPackageInput>
): Promise<boolean> {
  try {
    await updateDoc(doc(db, "packages", id), {
      ...data,
      updatedAt: serverTimestamp(),
    });
    return true;
  } catch (error) {
    console.error(`Error updating package (${id}):`, error);
    return false;
  }
}

export async function deletePackage(id: string): Promise<boolean> {
  try {
    await deleteDoc(doc(db, "packages", id));
    return true;
  } catch (error) {
    console.error(`Error deleting package (${id}):`, error);
    return false;
  }
}