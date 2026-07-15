import { db } from "./config";
import {
  collection,
  getDocs,
  addDoc,
  doc,
  updateDoc,
  query,
  orderBy,
  where,
  serverTimestamp,
} from "firebase/firestore";

export type OrderStatus = "Processing" | "Dispatched" | "Delivered" | "Cancelled";

export interface OrderItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
}

export interface Order {
  id: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  deliveryAddress: string;
  phone: string;
  items: OrderItem[];
  total: number;
  status: OrderStatus;
  createdAt: any; // Firestore Timestamp
  mpesaReference?: string;
}

export interface NewOrderInput {
  customerId: string;
  customerName: string;
  customerEmail: string;
  deliveryAddress: string;
  phone: string;
  items: OrderItem[];
  total: number;
  mpesaReference?: string;
}

// Called by checkout. Status always starts as "Processing" — customers
// never set their own order status, only admins change it afterward.
export async function addOrder(order: NewOrderInput): Promise<string | null> {
  try {
    const docRef = await addDoc(collection(db, "orders"), {
      ...order,
      mpesaReference: order.mpesaReference?.trim() || "",
      status: "Processing" as OrderStatus,
      createdAt: serverTimestamp(),
    });
    return docRef.id;
  } catch (error) {
    console.error("Error creating order in Firestore:", error);
    return null;
  }
}

// Admin view — all orders, newest first.
export async function fetchOrders(): Promise<Order[]> {
  try {
    const q = query(collection(db, "orders"), orderBy("createdAt", "desc"));
    const snapshot = await getDocs(q);
    return snapshot.docs.map((docSnap) => ({
      id: docSnap.id,
      ...docSnap.data(),
    })) as Order[];
  } catch (error) {
    console.error("Error fetching orders from Firestore:", error);
    return [];
  }
}

// Customer view — only their own orders.
export async function fetchOrdersForUser(uid: string): Promise<Order[]> {
  try {
    const q = query(
      collection(db, "orders"),
      where("customerId", "==", uid),
      orderBy("createdAt", "desc")
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map((docSnap) => ({
      id: docSnap.id,
      ...docSnap.data(),
    })) as Order[];
  } catch (error) {
    console.error("Error fetching orders for user from Firestore:", error);
    return [];
  }
}

export async function updateOrderStatus(id: string, status: OrderStatus): Promise<boolean> {
  try {
    await updateDoc(doc(db, "orders", id), { status });
    return true;
  } catch (error) {
    console.error(`Error updating order (${id}) status in Firestore:`, error);
    return false;
  }
}