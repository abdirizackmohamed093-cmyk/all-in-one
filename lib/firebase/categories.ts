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

export interface Category {
  id: string;
  name: string;
  slug: string;
}

// Slugs give us a stable, URL-safe identifier (e.g. for /shop/electronics)
// that doesn't break if someone renames "Electronics" to "Electronics & Tech"
// later — the slug can stay fixed while the display name changes.
function slugify(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export async function fetchCategories(): Promise<Category[]> {
  try {
    const snapshot = await getDocs(collection(db, "categories"));
    return snapshot.docs.map((docSnap) => ({
      id: docSnap.id,
      ...docSnap.data(),
    })) as Category[];
  } catch (error) {
    console.error("Error fetching categories from Firestore:", error);
    return [];
  }
}

export async function addCategory(name: string): Promise<string | null> {
  try {
    const docRef = await addDoc(collection(db, "categories"), {
      name: name.trim(),
      slug: slugify(name),
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    return docRef.id;
  } catch (error) {
    console.error("Error adding category to Firestore:", error);
    return null;
  }
}

export async function updateCategory(id: string, name: string): Promise<boolean> {
  try {
    await updateDoc(doc(db, "categories", id), {
      name: name.trim(),
      slug: slugify(name),
      updatedAt: serverTimestamp(),
    });
    return true;
  } catch (error) {
    console.error(`Error updating category (${id}) in Firestore:`, error);
    return false;
  }
}

export async function deleteCategory(id: string): Promise<boolean> {
  try {
    await deleteDoc(doc(db, "categories", id));
    return true;
  } catch (error) {
    console.error(`Error deleting category (${id}) from Firestore:`, error);
    return false;
  }
}