import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase/admin";
import { getAuth } from "firebase-admin/auth";

const ALLOWED_STATUSES = ["Processing", "Dispatched", "Delivered", "Cancelled"];

export async function POST(req: NextRequest) {
  try {
    // 1. Verify a real, valid Firebase ID token was sent — never trust the
    // caller just because the request came from the admin dashboard's origin.
    const authHeader = req.headers.get("authorization") || "";
    const idToken = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : null;
    if (!idToken) {
      return NextResponse.json({ error: "Missing auth token" }, { status: 401 });
    }

    let uid: string;
    try {
      const decoded = await getAuth().verifyIdToken(idToken);
      uid = decoded.uid;
    } catch (err) {
      console.error("Invalid ID token on update-order-status:", err);
      return NextResponse.json({ error: "Invalid or expired session" }, { status: 401 });
    }

    // 2. Verify that user's role is actually "admin" in Firestore — the
    // token only proves who they are, not that they're allowed to do this.
    const userDoc = await adminDb.collection("users").doc(uid).get();
    if (!userDoc.exists || userDoc.data()?.role !== "admin") {
      return NextResponse.json({ error: "Not authorized" }, { status: 403 });
    }

    // 3. Validate the request body.
    const { orderId, newStatus } = await req.json();
    if (!orderId || typeof orderId !== "string" || !ALLOWED_STATUSES.includes(newStatus)) {
      return NextResponse.json({ error: "Invalid orderId or newStatus" }, { status: 400 });
    }

    const orderRef = adminDb.collection("orders").doc(orderId);
    const orderSnap = await orderRef.get();
    if (!orderSnap.exists) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    await orderRef.update({ status: newStatus });

    return NextResponse.json({ success: true, orderId, newStatus });
  } catch (error) {
    console.error("Error updating order status:", error);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}