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

export interface CategoryTile {
  id: string;
  label: string;
  imageUrl: string;
  href: string;
  linkLabel: string;
  order: number;
  visible: boolean;
}

const tilesCollection = collection(db, "categoryTiles");

export async function fetchCategoryTiles(): Promise<CategoryTile[]> {
  const q = query(tilesCollection, orderBy("order", "asc"));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((d) => ({
    id: d.id,
    ...(d.data() as Omit<CategoryTile, "id">),
  }));
}

export async function addCategoryTile(
  tile: Omit<CategoryTile, "id">
): Promise<string> {
  const docRef = await addDoc(tilesCollection, tile);
  return docRef.id;
}

export async function updateCategoryTile(
  id: string,
  tile: Partial<Omit<CategoryTile, "id">>
): Promise<void> {
  const tileRef = doc(db, "categoryTiles", id);
  await updateDoc(tileRef, tile);
}

export async function deleteCategoryTile(id: string): Promise<void> {
  const tileRef = doc(db, "categoryTiles", id);
  await deleteDoc(tileRef);
}