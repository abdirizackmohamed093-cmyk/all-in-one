"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { createAd, PromoPopup } from "@/lib/firebase/ads";
import PromoAdForm from "@/components/admin/PromoAdForm";

export default function NewPromoAdPage() {
  const router = useRouter();

  async function handleSave(data: Omit<PromoPopup, "id">): Promise<boolean> {
    const id = await createAd(data);
    if (id) {
      router.push("/admin/ad");
      return true;
    }
    return false;
  }

  return (
    <div className="max-w-2xl">
      <Link
        href="/admin/ad"
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-neutral-500 hover:text-charcoal mb-4 transition-colors"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        Back to Campaigns
      </Link>
      <h1 className="font-serif text-2xl font-bold text-charcoal mb-2">New Campaign</h1>
      <p className="text-sm text-neutral-500 mb-6">
        Create a new promotional popup campaign.
      </p>
      <PromoAdForm onSave={handleSave} submitLabel="Create Campaign" />
    </div>
  );
}