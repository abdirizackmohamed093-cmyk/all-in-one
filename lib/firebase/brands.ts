import { db } from "./config";
import {
  collection,
  getDocs,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  serverTimestamp,
} from "firebase/firestore";

export interface Brand {
  id: string;
  name: string;
  slug: string;
  logoUrl?: string;
}

function slugify(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export async function fetchBrands(): Promise<Brand[]> {
  try {
    const snapshot = await getDocs(collection(db, "brands"));
    return snapshot.docs.map((docSnap) => ({
      id: docSnap.id,
      ...docSnap.data(),
    })) as Brand[];
  } catch (error) {
    console.error("Error fetching brands from Firestore:", error);
    return [];
  }
}

export async function addBrand(name: string, logoUrl?: string): Promise<string | null> {
  try {
    const docRef = await addDoc(collection(db, "brands"), {
      name: name.trim(),
      slug: slugify(name),
      logoUrl: logoUrl?.trim() || "",
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    return docRef.id;
  } catch (error) {
    console.error("Error adding brand to Firestore:", error);
    return null;
  }
}

export async function updateBrand(
  id: string,
  name: string,
  logoUrl?: string
): Promise<boolean> {
  try {
    await updateDoc(doc(db, "brands", id), {
      name: name.trim(),
      slug: slugify(name),
      logoUrl: logoUrl?.trim() || "",
      updatedAt: serverTimestamp(),
    });
    return true;
  } catch (error) {
    console.error(`Error updating brand (${id}) in Firestore:`, error);
    return false;
  }
}

export async function deleteBrand(id: string): Promise<boolean> {
  try {
    await deleteDoc(doc(db, "brands", id));
    return true;
  } catch (error) {
    console.error(`Error deleting brand (${id}) from Firestore:`, error);
    return false;
  }
}