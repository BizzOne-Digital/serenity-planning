"use client";

import { useEffect, useState } from "react";
import { Loader2, Save } from "lucide-react";
import { useToast } from "@/components/ui/ToastProvider";

interface HomeSections {
  hero: {
    heading: string;
    headingEmphasis: string;
    subtext: string;
    tagline: string;
    primaryCtaLabel: string;
    primaryCtaHref: string;
    secondaryCtaLabel: string;
    secondaryCtaHref: string;
    trustLine: string;
  };
  intro: { heading: string; body: string; ctaLabel: string; ctaHref: string };
  founder: { heading: string; body: string; name: string; quote: string; ctaLabel: string; ctaHref: string };
  finalCta: { heading: string; primaryCtaLabel: string; note: string };
}

const DEFAULT_SECTIONS: HomeSections = {
  hero: {
    heading: "Give Your Loved Ones",
    headingEmphasis: "Peace of Mind",
    subtext: "",
    tagline: "Plan Today. Peace Tomorrow.",
    primaryCtaLabel: "Book a Consultation",
    primaryCtaHref: "/booking",
    secondaryCtaLabel: "Explore Planning Options",
    secondaryCtaHref: "/services",
    trustLine: "No Pressure • No Obligation • Honest Guidance",
  },
  intro: { heading: "", body: "", ctaLabel: "", ctaHref: "/about" },
  founder: { heading: "", body: "", name: "Ricardo Mercado", quote: "", ctaLabel: "Our Story", ctaHref: "/about" },
  finalCta: { heading: "", primaryCtaLabel: "Schedule Consultation", note: "" },
};

export default function AdminContentPage() {
  const [sections, setSections] = useState<HomeSections>(DEFAULT_SECTIONS);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { showToast } = useToast();

  useEffect(() => {
    fetch("/api/content?page=home")
      .then((r) => r.json())
      .then((data) => {
        if (data.content?.sections) {
          setSections({ ...DEFAULT_SECTIONS, ...data.content.sections });
        }
      })
      .finally(() => setLoading(false));
  }, []);

  async function handleSave() {
    setSaving(true);
    try {
      const res = await fetch("/api/content", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ page: "home", sections }),
      });
      if (!res.ok) {
        showToast("Failed to save homepage content.", "error");
        return;
      }
      showToast("Homepage content updated.", "success");
    } catch {
      showToast("Failed to save homepage content.", "error");
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <p className="text-ink/60">Loading...</p>;

  return (
    <div className="max-w-3xl space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="font-serif text-2xl font-semibold text-purple-deep">Homepage Content</h1>
        <button
          onClick={handleSave}
          disabled={saving}
          className="inline-flex items-center gap-2 rounded-full bg-gold-warm px-4 py-2.5 text-sm font-semibold text-purple-deep hover:bg-gold-champagne disabled:opacity-60"
        >
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          Save Changes
        </button>
      </div>

      <Section title="Hero Section">
        <Field label="Heading" value={sections.hero.heading} onChange={(v) => setSections({ ...sections, hero: { ...sections.hero, heading: v } })} />
        <Field label="Heading Emphasis" value={sections.hero.headingEmphasis} onChange={(v) => setSections({ ...sections, hero: { ...sections.hero, headingEmphasis: v } })} />
        <Field label="Description" value={sections.hero.subtext} onChange={(v) => setSections({ ...sections, hero: { ...sections.hero, subtext: v } })} textarea />
        <Field label="Tagline" value={sections.hero.tagline} onChange={(v) => setSections({ ...sections, hero: { ...sections.hero, tagline: v } })} />
        <Field label="Primary Button Label" value={sections.hero.primaryCtaLabel} onChange={(v) => setSections({ ...sections, hero: { ...sections.hero, primaryCtaLabel: v } })} />
        <Field label="Secondary Button Label" value={sections.hero.secondaryCtaLabel} onChange={(v) => setSections({ ...sections, hero: { ...sections.hero, secondaryCtaLabel: v } })} />
        <Field label="Trust Line" value={sections.hero.trustLine} onChange={(v) => setSections({ ...sections, hero: { ...sections.hero, trustLine: v } })} />
      </Section>

      <Section title="Introduction Section">
        <Field label="Heading" value={sections.intro.heading} onChange={(v) => setSections({ ...sections, intro: { ...sections.intro, heading: v } })} />
        <Field label="Body Text" value={sections.intro.body} onChange={(v) => setSections({ ...sections, intro: { ...sections.intro, body: v } })} textarea />
        <Field label="Button Label" value={sections.intro.ctaLabel} onChange={(v) => setSections({ ...sections, intro: { ...sections.intro, ctaLabel: v } })} />
      </Section>

      <Section title="Founder Section">
        <Field label="Heading" value={sections.founder.heading} onChange={(v) => setSections({ ...sections, founder: { ...sections.founder, heading: v } })} />
        <Field label="Body Text" value={sections.founder.body} onChange={(v) => setSections({ ...sections, founder: { ...sections.founder, body: v } })} textarea />
        <Field label="Founder Name" value={sections.founder.name} onChange={(v) => setSections({ ...sections, founder: { ...sections.founder, name: v } })} />
        <Field label="Quote" value={sections.founder.quote} onChange={(v) => setSections({ ...sections, founder: { ...sections.founder, quote: v } })} textarea />
      </Section>

      <Section title="Final Call-to-Action">
        <Field label="Heading" value={sections.finalCta.heading} onChange={(v) => setSections({ ...sections, finalCta: { ...sections.finalCta, heading: v } })} />
        <Field label="Button Label" value={sections.finalCta.primaryCtaLabel} onChange={(v) => setSections({ ...sections, finalCta: { ...sections.finalCta, primaryCtaLabel: v } })} />
        <Field label="Note" value={sections.finalCta.note} onChange={(v) => setSections({ ...sections, finalCta: { ...sections.finalCta, note: v } })} />
      </Section>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-card border border-ink/10 bg-white p-5">
      <h2 className="mb-4 font-serif text-lg font-semibold text-purple-deep">{title}</h2>
      <div className="space-y-4">{children}</div>
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
