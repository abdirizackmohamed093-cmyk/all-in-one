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

export interface ProductRow {
  id: string;
  title: string;
  productIds: string[];
  order: number;
  visible: boolean;
}

const productRowsCollection = collection(db, "productRows");

export async function fetchProductRows(): Promise<ProductRow[]> {
  const q = query(productRowsCollection, orderBy("order", "asc"));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((d) => ({
    id: d.id,
    ...(d.data() as Omit<ProductRow, "id">),
  }));
}

export async function addProductRow(
  row: Omit<ProductRow, "id">
): Promise<string> {
  const docRef = await addDoc(productRowsCollection, row);
  return docRef.id;
}

export async function updateProductRow(
  id: string,
  row: Partial<Omit<ProductRow, "id">>
): Promise<void> {
  const rowRef = doc(db, "productRows", id);
  await updateDoc(rowRef, row);
}

export async function deleteProductRow(id: string): Promise<void> {
  const rowRef = doc(db, "productRows", id);
  await deleteDoc(rowRef);
}