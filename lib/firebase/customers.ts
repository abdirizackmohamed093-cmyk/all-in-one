import { db } from "./config";
import { collection, getDocs, doc, updateDoc } from "firebase/firestore";

export interface Customer {
  id: string;
  uid: string;
  name: string;
  email: string;
  role: "customer" | "admin";
  createdAt: any; // Firestore Timestamp
}

export async function fetchCustomers(): Promise<Customer[]> {
  try {
    const snapshot = await getDocs(collection(db, "users"));
    return snapshot.docs.map((docSnap) => ({
      id: docSnap.id,
      ...docSnap.data(),
    })) as Customer[];
  } catch (error) {
    console.error("Error fetching customers from Firestore:", error);
    return [];
  }
}

export async function setUserRole(
  uid: string,
  role: "customer" | "admin"
): Promise<boolean> {
  try {
    await updateDoc(doc(db, "users", uid), { role });
    return true;
  } catch (error) {
    console.error(`Error updating role for user (${uid}):`, error);
    return false;
  }
}