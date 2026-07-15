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

export type DiscountType = "percentage" | "fixed";

export interface Coupon {
  id: string;
  code: string;
  discountType: DiscountType;
  discountValue: number;
  active: boolean;
  createdAt: any; // Firestore Timestamp
}

export async function fetchCoupons(): Promise<Coupon[]> {
  try {
    const snapshot = await getDocs(collection(db, "coupons"));
    return snapshot.docs.map((docSnap) => ({
      id: docSnap.id,
      ...docSnap.data(),
    })) as Coupon[];
  } catch (error) {
    console.error("Error fetching coupons from Firestore:", error);
    return [];
  }
}

export async function addCoupon(
  code: string,
  discountType: DiscountType,
  discountValue: number
): Promise<string | null> {
  try {
    // Codes are stored uppercase so "SAVE10" and "save10" aren't treated
    // as two different coupons at checkout time.
    const docRef = await addDoc(collection(db, "coupons"), {
      code: code.trim().toUpperCase(),
      discountType,
      discountValue,
      active: true,
      createdAt: serverTimestamp(),
    });
    return docRef.id;
  } catch (error) {
    console.error("Error adding coupon to Firestore:", error);
    return null;
  }
}

export async function setCouponActive(id: string, active: boolean): Promise<boolean> {
  try {
    await updateDoc(doc(db, "coupons", id), { active });
    return true;
  } catch (error) {
    console.error(`Error updating coupon (${id}) in Firestore:`, error);
    return false;
  }
}

export async function deleteCoupon(id: string): Promise<boolean> {
  try {
    await deleteDoc(doc(db, "coupons", id));
    return true;
  } catch (error) {
    console.error(`Error deleting coupon (${id}) from Firestore:`, error);
    return false;
  }
}