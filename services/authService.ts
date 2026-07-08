import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  updateProfile 
} from "firebase/auth";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { auth, db } from "@/firebase/config";
import { SignUpCredentials, SignInCredentials } from "@/types/auth";

/**
 * Registers a brand-new customer, updates their auth profile display name,
 * and seeds a dedicated metadata record inside Cloud Firestore.
 */
export const signUpWithEmail = async ({ email, password, displayName }: SignUpCredentials) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Set the display name directly on the Firebase auth token profile
    if (displayName) {
      await updateProfile(user, { displayName });
    }

    // Seed customer metadata into Firestore for long-term relational scalability
    await setDoc(doc(db, "users", user.uid), {
      uid: user.uid,
      displayName: displayName || "",
      email: email,
      role: "customer", // Default privilege tier.
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      phoneNumber: "",
      shippingAddresses: []
    });

    return { user, error: null };
  } catch (error: any) {
    console.error("Critical Signup Error:", error);
    return { user: null, error: error.message || "An elegant error occurred during registration." };
  }
};

/**
 * Authenticates a returning customer or administrator securely.
 */
export const signInWithEmail = async ({ email, password }: SignInCredentials) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return { user: userCredential.user, error: null };
  } catch (error: any) {
    console.error("Critical Sign-In Error:", error);
    return { user: null, error: error.message || "Invalid email or password parameters specified." };
  }
};

/**
 * Destroys the current session and signs out the user immediately.
 */
export const logoutUser = async () => {
  try {
    await signOut(auth);
    return { error: null };
  } catch (error: any) {
    console.error("Logout Termination Error:", error);
    return { error: error.message || "Failed to terminate user session securely." };
  }
};