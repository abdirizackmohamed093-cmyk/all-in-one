"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Loader2 } from "lucide-react";
import { fetchAdById, updateAd, PromoPopup } from "@/lib/firebase/ads";
import PromoAdForm from "@/components/admin/PromoAdForm";

export default function EditPromoAdPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [ad, setAd] = useState<PromoPopup | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    fetchAdById(id).then((data) => {
      if (!data) {
        setNotFound(true);
      } else {
        setAd(data);
      }
      setLoading(false);
    });
  }, [id]);

  async function handleSave(data: Omit<PromoPopup, "id">): Promise<boolean> {
    const ok = await updateAd(id, data);
    if (ok) {
      router.push("/admin/ad");
      return true;
    }
    return false;
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 className="w-6 h-6 animate-spin text-neutral-400" />
      </div>
    );
  }

  if (notFound || !ad) {
    return (
      <div className="max-w-2xl">
        <p className="text-sm text-neutral-500">Campaign not found.</p>
        <Link href="/admin/ad" className="text-sm font-semibold text-burgundy mt-2 inline-block">
          Back to Campaigns
        </Link>
      </div>
    );
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
      <h1 className="font-serif text-2xl font-bold text-charcoal mb-2">Edit Campaign</h1>
      <p className="text-sm text-neutral-500 mb-6">{ad.title}</p>
      <PromoAdForm initialData={ad} onSave={handleSave} submitLabel="Save Changes" />
    </div>
  );
}