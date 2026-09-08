"use client";

import { useEffect, useState } from "react";
import { Loader2, Save } from "lucide-react";
import ImageUploadField from "@/components/admin/ImageUploadField";
import { useToast } from "@/components/ui/ToastProvider";

interface Settings {
  businessName: string;
  logo: string;
  secondaryLogo: string;
  favicon: string;
  phone: string;
  email: string;
  serviceArea: string;
  socialLinks: { facebook: string; instagram: string; other: string };
  primaryCtaLabel: string;
  primaryCtaDestination: string;
  footerText: string;
  businessHours: string;
  copyrightText: string;
}

const EMPTY: Settings = {
  businessName: "",
  logo: "",
  secondaryLogo: "",
  favicon: "",
  phone: "",
  email: "",
  serviceArea: "",
  socialLinks: { facebook: "", instagram: "", other: "" },
  primaryCtaLabel: "",
  primaryCtaDestination: "",
  footerText: "",
  businessHours: "",
  copyrightText: "",
};

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<Settings>(EMPTY);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { showToast } = useToast();

  useEffect(() => {
    fetch("/api/settings")
      .then((r) => r.json())
      .then((data) => {
        if (data.settings) setSettings({ ...EMPTY, ...data.settings, socialLinks: { ...EMPTY.socialLinks, ...data.settings.socialLinks } });
      })
      .finally(() => setLoading(false));
  }, []);

  async function handleSave() {
    setSaving(true);
    try {
      const res = await fetch("/api/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });
      if (!res.ok) {
        showToast("Failed to save settings.", "error");
        return;
      }
      showToast("Site settings updated.", "success");
    } catch {
      showToast("Failed to save settings.", "error");
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <p className="text-ink/60">Loading...</p>;

  return (
    <div className="max-w-2xl space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-serif text-2xl font-semibold text-purple-deep">Site Settings</h1>
        <button
          onClick={handleSave}
          disabled={saving}
          className="inline-flex items-center gap-2 rounded-full bg-gold-warm px-4 py-2.5 text-sm font-semibold text-purple-deep hover:bg-gold-champagne disabled:opacity-60"
        >
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          Save Changes
        </button>
      </div>

      <div className="rounded-card border border-ink/10 bg-white p-5 space-y-4">
        <Field label="Business Name" value={settings.businessName} onChange={(v) => setSettings({ ...settings, businessName: v })} />
        <ImageUploadField label="Logo" folder="pages" value={settings.logo} onChange={(url) => setSettings({ ...settings, logo: url })} />
        <ImageUploadField label="Secondary Logo" folder="pages" value={settings.secondaryLogo} onChange={(url) => setSettings({ ...settings, secondaryLogo: url })} />
        <ImageUploadField label="Favicon" folder="pages" value={settings.favicon} onChange={(url) => setSettings({ ...settings, favicon: url })} />
        <Field label="Phone Number" value={settings.phone} onChange={(v) => setSettings({ ...settings, phone: v })} />
        <Field label="Email Address" value={settings.email} onChange={(v) => setSettings({ ...settings, email: v })} />
        <Field label="Service Area" value={settings.serviceArea} onChange={(v) => setSettings({ ...settings, serviceArea: v })} />
        <Field label="Facebook URL" value={settings.socialLinks.facebook} onChange={(v) => setSettings({ ...settings, socialLinks: { ...settings.socialLinks, facebook: v } })} />
        <Field label="Instagram URL" value={settings.socialLinks.instagram} onChange={(v) => setSettings({ ...settings, socialLinks: { ...settings.socialLinks, instagram: v } })} />
        <Field label="Main Button Label" value={settings.primaryCtaLabel} onChange={(v) => setSettings({ ...settings, primaryCtaLabel: v })} />
        <Field label="Footer Text" value={settings.footerText} onChange={(v) => setSettings({ ...settings, footerText: v })} textarea />
        <Field label="Business Hours" value={settings.businessHours} onChange={(v) => setSettings({ ...settings, businessHours: v })} />
        <Field label="Copyright Text" value={settings.copyrightText} onChange={(v) => setSettings({ ...settings, copyrightText: v })} />
      </div>
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
