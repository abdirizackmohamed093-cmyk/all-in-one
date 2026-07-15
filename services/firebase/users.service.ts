import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase/config";

export type UserRole = "customer" | "admin";

interface CreateUserProfileParams {
  uid: string;
  email: string;
  name?: string;
}

// New signups are always "customer" by default. Admin roles are granted
// manually (Firebase console for now, an internal tool later) — never
// settable by the user themselves at signup time.
export async function createUserProfile({ uid, email, name }: CreateUserProfileParams) {
  await setDoc(doc(db, "users", uid), {
    uid,
    email,
    name: name ?? "",
    role: "customer" as UserRole,
    createdAt: serverTimestamp(),
  });
}