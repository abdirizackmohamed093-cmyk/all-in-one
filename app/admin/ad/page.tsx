"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { fetchAllAds, deleteAd, setActiveAd, PromoPopup } from "@/lib/firebase/ads";
import { Loader2, Plus, Pencil, Trash2, CheckCircle2, Circle } from "lucide-react";

export default function PromoAdsListPage() {
  const [ads, setAds] = useState<PromoPopup[]>([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    const data = await fetchAllAds();
    setAds(data);
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  async function handleSetActive(id: string) {
    setBusyId(id);
    await setActiveAd(id);
    await load();
    setBusyId(null);
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this campaign? This cannot be undone.")) return;
    setBusyId(id);
    await deleteAd(id);
    await load();
    setBusyId(null);
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 className="w-6 h-6 animate-spin text-neutral-400" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl">
      <div className="flex items-center justify-between mb-2">
        <h1 className="font-serif text-2xl font-bold text-charcoal">Promotional Popups</h1>
        <Link
          href="/admin/ad/new"
          className="inline-flex items-center gap-1.5 bg-burgundy text-white text-xs font-bold uppercase tracking-widest px-4 py-2.5 rounded-md hover:opacity-90 transition-opacity"
        >
          <Plus className="w-4 h-4" />
          New Campaign
        </Link>
      </div>
      <p className="text-sm text-neutral-500 mb-6">
        Only one campaign is shown to visitors at a time — mark the one you want live as "Active".
      </p>

      {ads.length === 0 ? (
        <div className="bg-white border border-neutral-200 rounded-lg p-10 text-center text-sm text-neutral-400">
          No campaigns yet. Create your first one.
        </div>
      ) : (
        <div className="space-y-3">
          {ads.map((ad) => (
            <div
              key={ad.id}
              className={`flex items-center gap-4 bg-white border rounded-lg p-4 ${
                ad.isActive ? "border-burgundy" : "border-neutral-200"
              }`}
            >
              <div className="w-16 h-16 rounded-md overflow-hidden bg-neutral-100 shrink-0">
                {ad.imageUrl ? (
                  <img src={ad.imageUrl} alt={ad.title} className="w-full h-full object-cover" />
                ) : null}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-neutral-900 truncate">{ad.title || "(untitled)"}</p>
                <p className="text-xs text-neutral-400 truncate">{ad.badge || "No badge"}</p>
              </div>

              <button
                onClick={() => !ad.isActive && ad.id && handleSetActive(ad.id)}
                disabled={busyId === ad.id}
                className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-md border transition-colors ${
                  ad.isActive
                    ? "border-emerald-200 bg-emerald-50 text-emerald-700 cursor-default"
                    : "border-neutral-200 text-neutral-600 hover:bg-neutral-50"
                }`}
              >
                {ad.isActive ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Circle className="w-3.5 h-3.5" />}
                {ad.isActive ? "Active" : "Set Active"}
              </button>

              <Link
                href={`/admin/ad/${ad.id}/edit`}
                className="p-2 rounded-md text-neutral-500 hover:bg-neutral-100 transition-colors"
                title="Edit"
              >
                <Pencil className="w-4 h-4" />
              </Link>
              <button
                onClick={() => ad.id && handleDelete(ad.id)}
                disabled={busyId === ad.id}
                className="p-2 rounded-md text-neutral-500 hover:bg-red-50 hover:text-red-600 transition-colors"
                title="Delete"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}