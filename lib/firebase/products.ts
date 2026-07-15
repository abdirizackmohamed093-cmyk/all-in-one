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
  Timestamp,
} from "firebase/firestore";
import { Product } from "@/components/products/ProductCard";

// Fetch the entire active catalog for the homepage matrix
export async function fetchLiveProducts(): Promise<Product[]> {
  try {
    const productsCollection = collection(db, "products");
    const snapshot = await getDocs(productsCollection);

    return snapshot.docs.map((docSnap) => ({
      id: docSnap.id,
      ...docSnap.data(),
    })) as Product[];
  } catch (error) {
    console.error("Error fetching live products from Firestore:", error);
    return [];
  }
}

// Fetch a single target luxury item matching an explicit document ID path
export async function fetchSingleProduct(id: string): Promise<Product | null> {
  try {
    const productRef = doc(db, "products", id);
    const docSnap = await getDoc(productRef);

    if (docSnap.exists()) {
      return {
        id: docSnap.id,
        ...docSnap.data(),
      } as Product;
    }
    return null;
  } catch (error) {
    console.error(`Error fetching single item profile (${id}) from Firestore:`, error);
    return null;
  }
}

// Fetch only products currently marked as flash-sale AND whose sale window
// hasn't expired yet. Filtered client-side after fetching the catalog —
// fine for a small-to-medium product count; revisit with a proper indexed
// query if the catalog grows large.
export async function fetchFlashSaleProducts(): Promise<Product[]> {
  try {
    const productsCollection = collection(db, "products");
    const snapshot = await getDocs(productsCollection);

    const now = Timestamp.now();

    return snapshot.docs
      .map((docSnap) => ({ id: docSnap.id, ...docSnap.data() }) as Product)
      .filter(
        (p) =>
          p.isFlashSale &&
          p.flashSaleEndsAt &&
          p.flashSaleEndsAt.toMillis() > now.toMillis()
      );
  } catch (error) {
    console.error("Error fetching flash sale products from Firestore:", error);
    return [];
  }
}

// Create a new product document. We omit "id" since Firestore generates it,
// and stamp createdAt/updatedAt server-side so timestamps are trustworthy
// (a client clock can't be spoofed to backdate or fake a product's age).
export async function addProduct(
  data: Omit<Product, "id">
): Promise<string | null> {
  try {
    const productsCollection = collection(db, "products");
    const docRef = await addDoc(productsCollection, {
      ...data,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    return docRef.id;
  } catch (error) {
    console.error("Error adding product to Firestore:", error);
    return null;
  }
}

// Update an existing product. Partial<> lets callers send only the fields
// that changed rather than the whole object every time.
export async function updateProduct(
  id: string,
  data: Partial<Omit<Product, "id">>
): Promise<boolean> {
  try {
    const productRef = doc(db, "products", id);
    await updateDoc(productRef, {
      ...data,
      updatedAt: serverTimestamp(),
    });
    return true;
  } catch (error) {
    console.error(`Error updating product (${id}) in Firestore:`, error);
    return false;
  }
}

// Delete a product outright. Note: this is a hard delete — for a real
// storefront you may eventually prefer a soft delete (an "isActive: false"
// flag) so historical orders still reference a real product record. We can
// revisit that when we build Orders.
export async function deleteProduct(id: string): Promise<boolean> {
  try {
    const productRef = doc(db, "products", id);
    await deleteDoc(productRef);
    return true;
  } catch (error) {
    console.error(`Error deleting product (${id}) from Firestore:`, error);
    return false;
  }
}