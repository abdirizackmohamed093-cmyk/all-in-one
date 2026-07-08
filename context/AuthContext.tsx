"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged, User } from "firebase/auth";
import { auth, db } from "@/firebase/config";
import { doc, getDoc } from "firebase/firestore";
import { AuthUserContextType } from "@/types/auth";

const AuthUserContext = createContext<AuthUserContextType>({
  user: null,
  loading: true,
  isAdmin: false,
});

export const AuthUserProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    // onAuthStateChanged automatically listens to authentication status transitions
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setLoading(true);
      if (currentUser) {
        setUser(currentUser);
        
        // Performance & Scalability optimized check:
        // Fetch the custom user document role from Firestore to determine admin validation privileges safely.
        try {
          const userDocRef = doc(db, "users", currentUser.uid);
          const userDoc = await getDoc(userDocRef);
          
          if (userDoc.exists() && userDoc.data()?.role === "admin") {
            setIsAdmin(true);
          } else {
            setIsAdmin(false);
          }
        } catch (error) {
          console.error("Error authenticating admin role structure:", error);
          setIsAdmin(false);
        }
      } else {
        setUser(null);
        setIsAdmin(false);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return (
    <AuthUserContext.Provider value={{ user, loading, isAdmin }}>
      {children}
    </AuthUserContext.Provider>
  );
};

// Custom layout hook for consuming the context cleanly inside premium client interfaces
export const useAuth = () => useContext(AuthUserContext);