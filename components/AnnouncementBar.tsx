"use client";

import React from "react";

export default function AnnouncementBar() {
  return (
    <div className="w-full bg-primary text-white text-center py-2 px-4 border-b border-white/10 select-none">
      <p className="text-[11px] font-medium uppercase tracking-[0.2em] md:tracking-[0.3em]">
        Complimentary Shipping Across Nairobi For Orders Above KSh 10,000
      </p>
    </div>
  );
}