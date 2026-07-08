import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Production-grade security practice: 
// Never hardcode API configuration strings into source code. 
// These values are injected via environment variables (.env.local) 
// and safely exposed to the client bundle via NEXT_PUBLIC_ prefixes.
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Next.js App Router relies heavily on hot-reloading during development.
// We must prevent initializing multiple Firebase App instances on re-renders.
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

// Initialize core e-commerce backend services
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { app, auth, db, storage };