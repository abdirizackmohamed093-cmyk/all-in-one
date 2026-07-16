"use client";

import { useEffect } from "react";
import { useAuth } from "@/context/AuthContext";

declare global {
  interface Window {
    Tawk_API?: any;
  }
}

export default function TawkIdentify() {
  const { user } = useAuth();

 useEffect(() => {
    if (!user) return;
    const email = user.email || "";

    function setAttributes() {
      if (window.Tawk_API && window.Tawk_API.setAttributes) {
        window.Tawk_API.setAttributes(
          {
            name: email || "Customer",
            email: email,
          },
          function (error: any) {
            if (error) console.error("Tawk.to setAttributes error:", error);
          }
        );
      } else {
        setTimeout(setAttributes, 1000);
      }
    }

    setAttributes();
  }, [user]);
  return null;
}