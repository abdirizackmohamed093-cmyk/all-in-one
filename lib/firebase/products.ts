import { db } from "./config";
import { collection, getDocs, doc, getDoc } from "firebase/firestore";
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