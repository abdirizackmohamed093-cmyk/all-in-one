"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { CheckCircle2 } from "lucide-react";

function OrderConfirmationContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId");

  return (
    <div className="max-w-xl mx-auto px-4 py-24 text-center">
      <CheckCircle2 className="w-14 h-14 text-green-600 mx-auto mb-6" />
      <h1 className="font-serif text-2xl font-bold text-neutral-900 mb-3">
        Order Placed
      </h1>
      <p className="text-neutral-500 text-sm mb-1">
        Thank you for your order. We are preparing it for dispatch.
      </p>
      {orderId && (
        <p className="text-xs text-neutral-400 mb-8">
          Order reference: {orderId}
        </p>
      )}
      <Link
        href="/"
        className="inline-block text-xs font-bold uppercase tracking-widest border-b border-neutral-900 pb-1"
      >
        Continue Shopping
      </Link>
    </div>
  );
}

export default function OrderConfirmationPage() {
  return (
    <Suspense fallback={null}>
      <OrderConfirmationContent />
    </Suspense>
  );
}