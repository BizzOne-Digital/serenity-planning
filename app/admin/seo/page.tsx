"use client";

import { useEffect, useState } from "react";
import { Loader2, Save } from "lucide-react";
import ImageUploadField from "@/components/admin/ImageUploadField";
import { useToast } from "@/components/ui/ToastProvider";

const PAGES = ["home", "about", "services", "contact"] as const;

interface SeoData {
  title: string;
  description: string;
  keywords: string;
  ogTitle: string;
  ogDescription: string;
  ogImage: string;
  canonical: string;
}

const EMPTY_SEO: SeoData = { title: "", description: "", keywords: "", ogTitle: "", ogDescription: "", ogImage: "", canonical: "" };

export default function AdminSeoPage() {
  const [page, setPage] = useState<(typeof PAGES)[number]>("home");
  const [seo, setSeo] = useState<SeoData>(EMPTY_SEO);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { showToast } = useToast();

  useEffect(() => {
    setLoading(true);
    fetch(`/api/content?page=${page}`)
      .then((r) => r.json())
      .then((data) => setSeo({ ...EMPTY_SEO, ...data.content?.seo }))
      .finally(() => setLoading(false));
  }, [page]);

  async function handleSave() {
    setSaving(true);
    try {
      const res = await fetch("/api/content", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ page, seo }),
      });
      if (!res.ok) {
        showToast("Failed to save SEO settings.", "error");
        return;
      }
      showToast("SEO settings updated.", "success");
    } catch {
      showToast("Failed to save SEO settings.", "error");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="max-w-2xl space-y-6">
      <h1 className="font-serif text-2xl font-semibold text-purple-deep">SEO Settings</h1>

      <div className="flex flex-wrap gap-2">
        {PAGES.map((p) => (
          <button
            key={p}
            onClick={() => setPage(p)}
            className={`rounded-full px-3.5 py-1.5 text-sm font-medium capitalize ${
              page === p ? "bg-purple-primary text-ivory" : "bg-white text-ink/70 border border-ink/10"
            }`}
          >
            {p}
          </button>
        ))}
      </div>

      {loading ? (
        <p className="text-ink/60">Loading...</p>
      ) : (
        <div className="rounded-card border border-ink/10 bg-white p-5 space-y-4">
          <Field label="Page Title" value={seo.title} onChange={(v) => setSeo({ ...seo, title: v })} />
          <Field label="Meta Description" value={seo.description} onChange={(v) => setSeo({ ...seo, description: v })} textarea />
          <Field label="Keywords" value={seo.keywords} onChange={(v) => setSeo({ ...seo, keywords: v })} />
          <Field label="Social Share Title" value={seo.ogTitle} onChange={(v) => setSeo({ ...seo, ogTitle: v })} />
          <Field label="Social Share Description" value={seo.ogDescription} onChange={(v) => setSeo({ ...seo, ogDescription: v })} textarea />
          <ImageUploadField label="Social Share Image" folder="pages" value={seo.ogImage} onChange={(url) => setSeo({ ...seo, ogImage: url })} />
          <Field label="Canonical URL" value={seo.canonical} onChange={(v) => setSeo({ ...seo, canonical: v })} />

          <button
            onClick={handleSave}
            disabled={saving}
            className="inline-flex items-center gap-2 rounded-full bg-gold-warm px-4 py-2.5 text-sm font-semibold text-purple-deep hover:bg-gold-champagne disabled:opacity-60"
          >
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            Save SEO Settings
          </button>
        </div>
      )}
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  textarea = false,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  textarea?: boolean;
}) {
  return (
    <div>
      <label className="mb-1.5 block text-sm font-medium text-ink">{label}</label>
      {textarea ? (
        <textarea rows={3} value={value} onChange={(e) => onChange(e.target.value)} className="w-full rounded-lg border border-ink/15 px-3 py-2 text-sm" />
      ) : (
        <input value={value} onChange={(e) => onChange(e.target.value)} className="w-full rounded-lg border border-ink/15 px-3 py-2 text-sm" />
      )}
    </div>
  );
}
